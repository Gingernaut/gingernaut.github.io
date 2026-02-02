<script setup lang="ts">
import { computed, ref, watch } from "vue";

// --- Types & Constants ---
type Tank = {
	name: string;
	capacity: number; // cu ft (nominal)
	pressure: number; // psi
	factor: number; // GUE Tank Factor
};

const tanks: readonly Tank[] = [
	{ name: "AL80", capacity: 77, pressure: 3000, factor: 2.5 },
	{ name: "HP100", capacity: 100, pressure: 3442, factor: 3.0 },
	{ name: "LP85", capacity: 85, pressure: 2640, factor: 3.0 },
	{ name: "LP95", capacity: 95, pressure: 2640, factor: 3.5 },
	{ name: "LP104", capacity: 104, pressure: 2640, factor: 4.0 },
	{ name: "HP120", capacity: 120, pressure: 3442, factor: 3.5 },
	{ name: "Double AL80", capacity: 154, pressure: 3000, factor: 5.0 },
	{ name: "Double HP100", capacity: 200, pressure: 3442, factor: 6.0 },
	{ name: "Double LP85", capacity: 170, pressure: 2640, factor: 6.0 },
];

const standardGases = [
	{ name: "Air", fO2: 21, fHe: 0 },
	{ name: "Nitrox 32", fO2: 32, fHe: 0 },
	{ name: "TriMix 21/35", fO2: 21, fHe: 35 },
	{ name: "TriMix 18/45", fO2: 18, fHe: 45 },
	{ name: "TriMix 15/55", fO2: 15, fHe: 55 },
	{ name: "TriMix 12/65", fO2: 12, fHe: 65 },
	{ name: "TriMix 10/70", fO2: 10, fHe: 70 },
] as const;

const standardPPO2 = 1.4;

// --- State: SCR Calculator ---
const scrStartPsi = ref<number | null>(null);
const scrEndPsi = ref<number | null>(null);
const scrTime = ref<number | null>(null);
const scrDepth = ref<number | null>(null); // Average depth
const scrTank = ref<Tank>(tanks[7]); // Default to Double HP100 (index 7 now)

// --- State: Gas Planning ---
const planScr = ref<number>(0.75); // Default Conservative SCR
const planDepth = ref<number>(100);
const planStartPsi = ref<number>(tanks[3].pressure);
const planTank = ref<Tank>(tanks[7]); // Double HP100 default
const gasStrategy = ref<"all" | "half" | "third">("all");

watch(planTank, (newTank) => {
	planStartPsi.value = newTank.pressure;
});

// --- Calculations: Helpers ---
const calcAta = (depthFt: number): number => depthFt / 33 + 1;
const getTankFactor = (tank: Tank): number => tank.factor;

// --- Calculations: SCR ---
const scrResult = computed<number | null>(() => {
	if (
		scrStartPsi.value === null ||
		scrEndPsi.value === null ||
		!scrTime.value ||
		scrDepth.value === null
	)
		return null;

	const psiConsumed = scrStartPsi.value - scrEndPsi.value;
	const tankFactor = getTankFactor(scrTank.value);
	// Formula: (PSI / 100) * TankFactor
	const volConsumed = (psiConsumed / 100) * tankFactor;

	const ata = calcAta(scrDepth.value);
	// SCR (RMV) = Vol / (Time * ATA)
	return volConsumed / (scrTime.value * ata);
});

// --- Calculations: Gas Planning ---
type PlanResult = {
	minGasPsi: number;
	usablePsi: number; // Total available gas (Start - Min)
	strategyUsablePsi: number; // Gas allowed for the dive based on strategy
	turnPressure: number; // The pressure at which to turn
	minGasVol: number;
};

const planResult = computed<PlanResult>(() => {
	const depth = planDepth.value;
	const scr = planScr.value;
	const tank = planTank.value;
	const startPsi = planStartPsi.value;

	// 1. Min Gas
	// Formula: C * A * T
	// C = consumption for 2 divers = SCR * 2
	// T = Time to surface = depth / 10 + 1
	// A = Avg ATA = (ATA_max + ATA_surf) / 2 = (ATA_max + 1) / 2

	const timeToSurface = depth / 10 + 1;
	const maxAta = calcAta(depth);
	const avgAta = (maxAta + 1) / 2;
	const twoDiverScr = scr * 2;

	const minGasVol = twoDiverScr * avgAta * timeToSurface;

	// Convert Vol to PSI
	// Formula: (Vol / TankFactor) * 100
	let minGasPsi = Math.ceil((minGasVol / tank.factor) * 100);

	// Pad to nearest 100 (script logic)
	minGasPsi = Math.ceil(minGasPsi / 100) * 100;
	// Min 500 psi
	minGasPsi = Math.max(minGasPsi, 500);

	const usablePsi = Math.max(0, startPsi - minGasPsi);

	// Turn Pressures
	// Rule of Thirds: Start - (Usable * 1/3) -- wait, script says `start - int(usable/3)`.
	// This implies you consume 1/3, keeping 2/3 + Reserve?
	// Standard Rule of Thirds commonly means: Use 1/3, Reserve 2/3 (for self + buddy).
	// If "Reserve" is strictly Min Gas, then "Usable" is the gas ON TOP of Min Gas.
	// GUE "Gas Strategy":
	// Recreational: Minimum Gas reserve. Remainder is usable. Turn at 1/2 usable (out/back).
	// Technical/Cave: Rule of Thirds usually applied to TOTAL gas, OR calculated on Usable.
	// The script clearly acts on "Usable Gas" (Start - MinGas).
	// Turn 1/2: Start - Usable/2
	// Turn 1/3: Start - Usable/3

	const turnHalf = startPsi - Math.floor(usablePsi / 2);
	const turnThird = startPsi - Math.floor(usablePsi / 3);

	let strategyUsablePsi = usablePsi;
	if (gasStrategy.value === "half") {
		strategyUsablePsi = Math.floor(usablePsi / 2);
	} else if (gasStrategy.value === "third") {
		strategyUsablePsi = Math.floor(usablePsi / 3);
	}

	const turnPressure = startPsi - strategyUsablePsi;

	return {
		minGasPsi,
		usablePsi,
		strategyUsablePsi,
		turnPressure,
		minGasVol,
	};
});

// --- Calculations: Standard Gases ---
// MOD formula: (PO2 / fO2) * 33 - 33
const getMod = (fO2: number, pO2: number): number => {
	if (fO2 === 0) return 0;
	const ata = pO2 / (fO2 / 100);
	return Math.floor((ata - 1) * 33);
};
</script>

<template>
  <div class="scuba-tools w-full px-4 lg:px-8 xl:px-12 mx-auto space-y-6 pb-8">

    <!-- Header -->
    <div class="text-center py-4">
      <h1 class="text-3xl font-extrabold mb-2 text-gray-900 tracking-tight">Scuba Tools</h1>
    </div>

    <!-- Grid Container -->
    <div class="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-6">

        <!-- 1. SCR Calculator -->
        <section class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full lg:col-span-1 2xl:col-span-1">
            <div class="p-4 border-b border-gray-100 bg-gray-50/50">
                <h2 class="text-lg font-bold flex items-center gap-2 text-gray-800">
                    <div class="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                        <span class="i-carbon-calculator text-lg block"></span>
                    </div>
                    SCR Calculator
                </h2>
            </div>

            <div class="p-5 space-y-4 flex-1">
                <!-- Tank Select -->
                <div class="space-y-1">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Cylinder</label>
                    <div class="relative">
                        <select v-model="scrTank" class="w-full pl-3 pr-8 py-2 rounded-lg bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition-all text-sm font-medium text-gray-700 appearance-none cursor-pointer hover:bg-gray-100">
                            <option v-for="t in tanks" :key="t.name" :value="t">{{ t.name }} ({{ t.capacity }}cf / {{ t.pressure }}psi)</option>
                        </select>
                        <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
                             <span class="i-carbon-chevron-down text-sm"></span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <!-- Start Pressure -->
                    <div class="space-y-1">
                         <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Start Pressure</label>
                         <div class="relative group">
                            <input v-model.number="scrStartPsi" type="number" step="100" placeholder="0" class="w-full pl-3 pr-8 py-2 rounded-lg bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition-all font-mono text-sm font-medium text-gray-800 group-hover:bg-gray-100 placeholder-gray-300">
                            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold pointer-events-none">PSI</span>
                         </div>
                    </div>
                    <!-- End Pressure -->
                    <div class="space-y-1">
                         <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">End Pressure</label>
                         <div class="relative group">
                            <input v-model.number="scrEndPsi" type="number" step="100" placeholder="0" class="w-full pl-3 pr-8 py-2 rounded-lg bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition-all font-mono text-sm font-medium text-gray-800 group-hover:bg-gray-100 placeholder-gray-300">
                            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold pointer-events-none">PSI</span>
                         </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                     <!-- Avg Depth -->
                    <div class="space-y-1">
                         <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Avg Depth</label>
                         <div class="relative group">
                            <input v-model.number="scrDepth" type="number" placeholder="0" class="w-full pl-3 pr-8 py-2 rounded-lg bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition-all font-mono text-sm font-medium text-gray-800 group-hover:bg-gray-100 placeholder-gray-300">
                            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold pointer-events-none">ft</span>
                         </div>
                    </div>
                     <!-- Time -->
                    <div class="space-y-1">
                         <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Time</label>
                         <div class="relative group">
                             <input v-model.number="scrTime" type="number" placeholder="0" class="w-full pl-3 pr-8 py-2 rounded-lg bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition-all font-mono text-sm font-medium text-gray-800 group-hover:bg-gray-100 placeholder-gray-300">
                             <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold pointer-events-none">min</span>
                         </div>
                    </div>
                </div>
            </div>

             <!-- Result Footer -->
            <div class="p-4 bg-blue-50/50 border-t border-blue-100 text-center mt-auto">
                 <div class="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Calculated SCR</div>
                 <div class="flex items-center justify-center gap-2 items-baseline text-blue-600">
                    <span class="text-4xl font-black tracking-tighter shadow-sm drop-shadow-sm">{{ scrResult ? scrResult.toFixed(2) : '--' }}</span>
                    <span class="text-xs font-bold text-blue-400">cu ft/min</span>
                 </div>
                  <button
                  v-if="scrResult"
                  @click="planScr = parseFloat(scrResult.toFixed(2))"
                  class="mt-3 w-full py-1.5 px-4 bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-sm hover:shadow"
                >
                  Apply to Plan ↓
                </button>
            </div>
        </section>

        <!-- 2. Gas Planning -->
        <section class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full lg:col-span-2 2xl:col-span-2">
            <div class="p-4 border-b border-gray-100 bg-gray-50/50">
               <h2 class="text-lg font-bold flex items-center gap-2 text-gray-800">
                <div class="p-1.5 bg-green-100 rounded-lg text-green-600">
                    <span class="i-carbon-chart-evaluation text-lg block"></span>
                </div>
                Pre-Dive Gas Planning
              </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
                <!-- Inputs Column -->
                <div class="p-5 space-y-4 border-b md:border-b-0 md:border-r border-gray-100">
                     <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-1">
                             <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">SCR</label>
                             <div class="relative group">
                                <input v-model.number="planScr" type="number" step="0.1" class="w-full pl-3 pr-12 py-2 rounded-lg bg-gray-50 border-transparent focus:border-green-500 focus:bg-white focus:ring-0 transition-all font-mono text-sm font-medium text-gray-800 group-hover:bg-gray-100">
                                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold pointer-events-none">ft³/min</span>
                             </div>
                        </div>
                         <div class="space-y-1">
                             <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Target Depth</label>
                             <div class="relative group">
                                 <input v-model.number="planDepth" type="number" step="10" class="w-full pl-3 pr-8 py-2 rounded-lg bg-gray-50 border-transparent focus:border-green-500 focus:bg-white focus:ring-0 transition-all font-mono text-sm font-medium text-gray-800 group-hover:bg-gray-100">
                                 <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold pointer-events-none">ft</span>
                             </div>
                         </div>
                     </div>

                     <div class="space-y-1">
                        <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Cylinder</label>
                        <div class="relative">
                            <select v-model="planTank" class="w-full pl-3 pr-8 py-2 rounded-lg bg-gray-50 border-transparent focus:border-green-500 focus:bg-white focus:ring-0 transition-all text-sm font-medium text-gray-700 appearance-none cursor-pointer hover:bg-gray-100">
                              <option v-for="t in tanks" :key="t.name" :value="t">{{ t.name }} ({{ t.capacity }}cf / {{ t.pressure }}psi)</option>
                            </select>
                             <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
                                 <span class="i-carbon-chevron-down text-sm"></span>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Gas Strategy</label>
                        <div class="relative">
                            <select v-model="gasStrategy" class="w-full pl-3 pr-8 py-2 rounded-lg bg-gray-50 border-transparent focus:border-green-500 focus:bg-white focus:ring-0 transition-all text-sm font-medium text-gray-700 appearance-none cursor-pointer hover:bg-gray-100">
                                <option value="all">All Usable</option>
                                <option value="half">Half Usable</option>
                                <option value="third">Rule of Thirds</option>
                            </select>
                             <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
                                 <span class="i-carbon-chevron-down text-sm"></span>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-1">
                         <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Start Pressure</label>
                         <div class="relative group">
                            <input v-model.number="planStartPsi" type="number" step="100" class="w-full pl-3 pr-8 py-2 rounded-lg bg-gray-50 border-transparent focus:border-green-500 focus:bg-white focus:ring-0 transition-all font-mono text-sm font-medium text-gray-800 group-hover:bg-gray-100">
                             <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold pointer-events-none">PSI</span>
                         </div>
                    </div>
                </div>

                <!-- Visualization Column -->
                <div class="p-5 flex flex-col md:flex-row gap-4 items-center justify-center bg-gray-50/30">
                     <!-- Stats Grid -->
                    <div class="flex-1 w-full grid grid-cols-2 gap-2">
                         <!-- Min Gas -->
                        <div class="p-2.5 bg-red-50 rounded-lg border border-red-100">
                             <div class="text-[9px] font-bold text-red-400 uppercase tracking-wider mb-0.5">Min Gas <span class="opacity-50"></span></div>
                             <div class="text-lg font-black text-red-600 font-mono leading-none">{{ planResult.minGasPsi }} <span class="text-[10px] font-normal text-red-400">psi</span></div>
                             <div class="text-[10px] text-red-400 font-medium mt-0.5">{{ planResult.minGasVol.toFixed(1) }} cu ft</div>
                        </div>

                         <!-- Usable Gas (Strategy) -->
                        <div class="p-2.5 bg-green-50 rounded-lg border border-green-100">
                             <div class="text-[9px] font-bold text-green-600 uppercase tracking-wider mb-0.5">Usable Gas <span class="opacity-50">({{ gasStrategy }})</span></div>
                             <div class="text-lg font-black text-green-700 font-mono leading-none">{{ planResult.strategyUsablePsi }} <span class="text-[10px] font-normal text-green-500">psi</span></div>
                              <div class="text-[10px] text-green-600 font-medium mt-0.5">{{ planResult.strategyUsablePsi > 0 ? 'Allowed' : 'None' }}</div>
                        </div>

                         <!-- Turn Pressure -->
                        <div class="p-2.5 bg-white rounded-lg border border-gray-100 shadow-sm relative overflow-hidden col-span-2">
                             <div class="absolute top-0 right-0 w-6 h-6 bg-blue-500/10 rounded-bl-lg"></div>
                             <div class="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Turn Pressure</div>
                             <div class="text-2xl font-black text-gray-800 font-mono leading-none">{{ planResult.turnPressure }} <span class="text-xs font-bold text-gray-400">psi</span></div>
                             <div class="text-[10px] text-gray-400 font-medium mt-1">Turn when gauge reads {{ planResult.turnPressure }} psi</div>
                        </div>
                    </div>

                    <!-- Tank Graphic -->
                    <div class="relative w-20 h-56 shrink-0 bg-gray-200 rounded-2xl border-4 border-gray-300 overflow-hidden shadow-inner hidden sm:block">
                        <!-- Gas Fill -->
                        <div class="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-700 ease-out"
                             :style="{ height: `${Math.min(100, (planStartPsi / planTank.pressure) * 100)}%` }">
                        </div>

                        <!-- Min Gas Zone -->
                         <div class="absolute bottom-0 w-full bg-red-500/80 border-t-2 border-red-400 transition-all duration-700 pattern-diagonal-lines pattern-white/10 pattern-size-2 pattern-bg-transparent"
                             :style="{ height: `${Math.min(100, (planResult.minGasPsi / planTank.pressure) * 100)}%` }">
                        </div>

                         <!-- Turn Pressure Line -->
                         <div class="absolute w-full border-t-2 border-yellow-400 border-dashed transition-all duration-700 z-20"
                             :style="{ bottom: `${(planResult.turnPressure / planTank.pressure) * 100}%` }">
                              <div class="absolute right-1 -translate-y-1/2 text-[8px] font-bold text-yellow-600 bg-white/90 px-1 rounded shadow-sm">
                                Turn
                              </div>
                         </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 3. Standard Gases Table -->
        <section class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full col-span-1 lg:col-span-3 2xl:col-span-1">
             <div class="p-4 border-b border-gray-100 bg-gray-50/50">
               <h2 class="text-lg font-bold flex items-center gap-2 text-gray-800">
                <div class="p-1.5 bg-purple-100 rounded-lg text-purple-600">
                    <span class="i-carbon-chemistry text-lg block"></span>
                </div>
                Standard Gases
              </h2>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-100">
                            <th class="px-5 py-3 font-semibold">Gas Name</th>
                            <th class="px-5 py-3 font-semibold text-center">Oxygen (O<sub>2</sub>)</th>
                            <th class="px-5 py-3 font-semibold text-center">Helium (He)</th>
                            <th class="px-5 py-3 font-semibold text-center">MOD (ft) <span class="text-[9px] opacity-70 block font-normal">@ {{ standardPPO2 }} PPO<sub>2</sub></span></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50 text-sm">
                        <tr v-for="gas in standardGases" :key="gas.name" class="hover:bg-purple-50/30 transition-colors group">
                            <td class="px-5 py-3 font-medium text-gray-900">{{ gas.name }}</td>
                            <td class="px-5 py-3 text-center text-gray-600">{{ gas.fO2 }}%</td>
                            <td class="px-5 py-3 text-center text-gray-400">{{ gas.fHe }}%</td>
                            <td class="px-5 py-3 text-center font-mono text-purple-600 font-bold bg-purple-50/50 group-hover:bg-purple-100/50 transition-colors">
                                {{ getMod(gas.fO2, standardPPO2) }}'
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

    </div>
  </div>
</template>

<style scoped>
/* Ensure inputs don't show spinner buttons in styling if undesired, though typically fine */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
