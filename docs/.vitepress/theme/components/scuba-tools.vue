<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
	// Constants
	CONVERSION,
	// ATA calculations
	calcAtaImperial,
	calcAtaMetric,
	type GasStrategy,
	calcAta as libCalcAta,
	calcGasPlan as libCalcGasPlan,
	// Main calculations
	calcScr as libCalcScr,
	fromDisplayDepth as libFromDisplayDepth,
	fromDisplayPressure as libFromDisplayPressure,
	fromDisplayVolume as libFromDisplayVolume,
	getMod as libGetMod,
	toDisplayDepth as libToDisplayDepth,
	// Conversion functions
	toDisplayPressure as libToDisplayPressure,
	toDisplayVolume as libToDisplayVolume,
	type PlanResult,
	STANDARD_GASES,
	TANKS,
	type Tank,
	// Types
	type UnitSystem,
} from "../lib/scuba-calculations";

// --- Unit System State ---
const unitSystem = ref<UnitSystem>("imperial");

const UNITS = {
	imperial: { depth: "ft", pressure: "psi", volume: "cu ft" },
	metric: { depth: "m", pressure: "bar", volume: "L" },
} as const;

const units = computed(() =>
	unitSystem.value === "imperial" ? UNITS.imperial : UNITS.metric,
);

// --- Conversion Utilities (wrap library functions with reactive unitSystem) ---
const toDisplayPressure = (psi: number): number =>
	libToDisplayPressure(psi, unitSystem.value);

const fromDisplayPressure = (val: number): number =>
	libFromDisplayPressure(val, unitSystem.value);

const toDisplayDepth = (ft: number): number =>
	libToDisplayDepth(ft, unitSystem.value);

const fromDisplayDepth = (val: number): number =>
	libFromDisplayDepth(val, unitSystem.value);

const toDisplayVolume = (cuFt: number): number =>
	libToDisplayVolume(cuFt, unitSystem.value);

const fromDisplayVolume = (val: number): number =>
	libFromDisplayVolume(val, unitSystem.value);

// SCR is volume/min - same conversion as volume
const toDisplayScr = (cuFtPerMin: number): number =>
	toDisplayVolume(cuFtPerMin);
const fromDisplayScr = (val: number): number => fromDisplayVolume(val);

// --- Use tanks from library ---
const tanks = TANKS;
const standardGases = STANDARD_GASES;
const standardPPO2 = ref<number>(1.4);
const ppo2Options = [1.2, 1.3, 1.4, 1.5, 1.6];

// --- State: SCR Calculator ---
const scrStartPsi = ref<number | null>(null);
const scrEndPsi = ref<number | null>(null);
const scrTime = ref<number | null>(null);
const scrDepth = ref<number | null>(null); // Average depth (display units)
const scrTank = ref<Tank>(tanks[7]); // Default to Double HP100

// --- State: Gas Planning ---
const planScr = ref<number>(0.6); // Default SCR
const planDepth = ref<number>(100); // Display units (ft or m)
const planStartPsi = ref<number>(tanks[7].pressure); // Internal PSI
const planTank = ref<Tank>(tanks[7]); // Double HP100 default
const gasStrategy = ref<GasStrategy>("all");

watch(planTank, (newTank: Tank) => {
	planStartPsi.value = toDisplayPressure(newTank.pressure);
});

// Convert existing values when unit system changes
watch(unitSystem, (newSystem: UnitSystem, oldSystem: UnitSystem) => {
	if (oldSystem === "imperial" && newSystem === "metric") {
		// Converting from Imperial to Metric
		planDepth.value = Math.round(planDepth.value * CONVERSION.feetToMeters);
		planStartPsi.value = Math.round(planStartPsi.value * CONVERSION.psiToBar);
		planScr.value = parseFloat(
			(planScr.value * CONVERSION.cuFtToLiters).toFixed(2),
		);
	} else if (oldSystem === "metric" && newSystem === "imperial") {
		// Converting from Metric to Imperial
		planDepth.value = Math.round(planDepth.value * CONVERSION.metersToFeet);
		planStartPsi.value = Math.round(planStartPsi.value * CONVERSION.barToPsi);
		planScr.value = parseFloat(
			(planScr.value * CONVERSION.litersToCuFt).toFixed(2),
		);
	}
});

// --- Dynamic Step Sizes (unit-aware) ---
const stepSizes = computed(() => ({
	pressure: unitSystem.value === "metric" ? 5 : 100,
	depth: unitSystem.value === "metric" ? 3 : 10,
	scr: unitSystem.value === "metric" ? 1 : 0.1,
}));

// --- Calculations: SCR (using library) ---
const scrResult = computed<number | null>(() => {
	if (
		scrStartPsi.value === null ||
		scrEndPsi.value === null ||
		!scrTime.value ||
		scrDepth.value === null
	)
		return null;

	return libCalcScr({
		startPsi: scrStartPsi.value,
		endPsi: scrEndPsi.value,
		time: scrTime.value,
		depth: scrDepth.value,
		tankFactor: scrTank.value.factor,
		unitSystem: unitSystem.value,
	});
});

// --- Calculations: Gas Planning (using library) ---
const planResult = computed<PlanResult>(() => {
	return libCalcGasPlan({
		depth: planDepth.value,
		scr: planScr.value,
		startPressure: planStartPsi.value,
		tank: planTank.value,
		gasStrategy: gasStrategy.value,
		unitSystem: unitSystem.value,
	});
});

// --- Calculations: Standard Gases (using library) ---
const getMod = (fO2: number, pO2: number): number | undefined => {
	return libGetMod(fO2, pO2, unitSystem.value);
};

// --- Tooltips: Calculation Explanations ---
const tooltips = computed(() => {
	const depth = fromDisplayDepth(planDepth.value);
	const scr = fromDisplayScr(planScr.value);
	const tank = planTank.value;

	const timeToSurface = depth / 10 + 1;
	const maxAta = calcAtaImperial(depth);
	const avgAta = (maxAta + 1) / 2;

	// Display-appropriate ascent rate explanation
	const ascentRate = unitSystem.value === "metric" ? "3 m/min" : "10 ft/min";
	const ascentDivisor = unitSystem.value === "metric" ? 3 : 10;
	const twoDiverScr = scr * 2;
	const scrDisplay = planScr.value; // Already in display units

	// Display values
	const depthDisp = planDepth.value;
	const startDisp = planStartPsi.value;
	const minGasDisp = Math.round(toDisplayPressure(planResult.value.minGasPsi));
	const usableDisp = Math.round(toDisplayPressure(planResult.value.usablePsi));
	const stratUsableDisp = Math.round(
		toDisplayPressure(planResult.value.strategyUsablePsi),
	);
	const turnDisp = Math.round(toDisplayPressure(planResult.value.turnPressure));

	const strategyLabel =
		gasStrategy.value === "all"
			? "All Usable"
			: gasStrategy.value === "half"
				? "Half Usable (÷2)"
				: gasStrategy.value === "third"
					? "Rule of Thirds (÷3)"
					: "Modified 1/3";

	return {
		minGas: `Min Gas (CAT Formula)\nC = 2 divers × ${scrDisplay} = ${toDisplayScr(twoDiverScr).toFixed(2)} ${units.value.volume}/min\nA = Avg ATA = (${maxAta.toFixed(2)} + 1) / 2 = ${avgAta.toFixed(2)}\nT = Time to surface @ ${ascentRate}\n  = ${depthDisp}${units.value.depth} ÷ ${ascentDivisor} + 1 min = ${timeToSurface.toFixed(1)} min\n\nMin Vol = ${toDisplayScr(twoDiverScr).toFixed(2)} × ${avgAta.toFixed(2)} × ${timeToSurface.toFixed(1)} = ${toDisplayVolume(planResult.value.minGasVol).toFixed(1)} ${units.value.volume}\nMin Pressure = ${minGasDisp} ${units.value.pressure} (rounded up)`,

		usableGas: `Usable Gas (${strategyLabel})\n\nTotal Usable = Start - Min Gas\n= ${startDisp} - ${minGasDisp} = ${usableDisp} ${units.value.pressure}\n\n${gasStrategy.value === "all" ? `Strategy: Use all usable gas\n= ${stratUsableDisp} ${units.value.pressure}` : `Strategy: ${strategyLabel}\n= ${usableDisp} × factor = ${stratUsableDisp} ${units.value.pressure}`}`,

		turnPressure: `Turn Pressure\n\nTurn = Start - Usable Gas (After Strategy)\n= ${startDisp} - ${stratUsableDisp}\n= ${turnDisp} ${units.value.pressure} (rounded up to 100)`,

		timeMax: `Dive Time (Max Depth)\n\nUsable Vol = ${toDisplayVolume(((planResult.value.strategyUsablePsi * (gasStrategy.value === "all" ? 1 : 2)) / 100) * tank.factor).toFixed(1)} ${units.value.volume}\nATA at ${depthDisp}${units.value.depth} = ${maxAta.toFixed(2)}\n\nTime = Vol ÷ (SCR × ATA)\n= ${planResult.value.expectedTimeMax.toFixed(1)} min`,

		timeAvg: `Dive Time (Avg Depth)\n\nUsable Vol = ${toDisplayVolume(((planResult.value.strategyUsablePsi * (gasStrategy.value === "all" ? 1 : 2)) / 100) * tank.factor).toFixed(1)} ${units.value.volume}\nAvg ATA = ${avgAta.toFixed(2)}\n\nTime = Vol ÷ (SCR × Avg ATA)\n= ${planResult.value.expectedTimeAvg.toFixed(1)} min`,
	};
});
</script>

<template>
  <div class="scuba-tools w-full px-4 lg:px-8 xl:px-12 mx-auto space-y-6 pb-8">

    <!-- Header -->
    <div class="flex items-center justify-between py-4">
      <div></div>
      <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Scuba Tools</h1>
      <div class="flex items-center gap-2">
        <label class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Units</label>
        <div class="relative">
          <select v-model="unitSystem" class="pl-3 pr-8 py-1.5 rounded-lg bg-gray-100 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition-all text-sm font-medium text-gray-700 appearance-none cursor-pointer hover:bg-gray-200">
            <option value="imperial">Imperial (ft / PSI)</option>
            <option value="metric">Metric (m / bar)</option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
            <span class="i-carbon-chevron-down text-sm"></span>
          </div>
        </div>
      </div>
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
                            <option v-for="t in tanks" :key="t.name" :value="t">{{ t.name }} ({{ Math.round(toDisplayVolume(t.capacity)) }}{{ units.volume }} / {{ Math.round(toDisplayPressure(t.pressure)) }}{{ units.pressure }})</option>
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
                            <input v-model.number="scrStartPsi" type="number" :step="stepSizes.pressure" placeholder="0" class="w-full pl-3 pr-8 py-2 rounded-lg bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition-all font-mono text-sm font-medium text-gray-800 group-hover:bg-gray-100 placeholder-gray-300">
                            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold pointer-events-none">{{ units.pressure }}</span>
                         </div>
                    </div>
                    <!-- End Pressure -->
                    <div class="space-y-1">
                         <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">End Pressure</label>
                         <div class="relative group">
                            <input v-model.number="scrEndPsi" type="number" :step="stepSizes.pressure" placeholder="0" class="w-full pl-3 pr-8 py-2 rounded-lg bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition-all font-mono text-sm font-medium text-gray-800 group-hover:bg-gray-100 placeholder-gray-300">
                            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold pointer-events-none">{{ units.pressure }}</span>
                         </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                     <!-- Avg Depth -->
                    <div class="space-y-1">
                         <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Avg Depth</label>
                         <div class="relative group">
                            <input v-model.number="scrDepth" type="number" placeholder="0" class="w-full pl-3 pr-8 py-2 rounded-lg bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition-all font-mono text-sm font-medium text-gray-800 group-hover:bg-gray-100 placeholder-gray-300">
                            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold pointer-events-none">{{ units.depth }}</span>
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
                    <span class="text-4xl font-black tracking-tighter shadow-sm drop-shadow-sm">{{ scrResult ? toDisplayVolume(scrResult).toFixed(2) : '--' }}</span>
                    <span class="text-xs font-bold text-blue-400">{{ units.volume }}/min</span>
                 </div>
                  <button
                  v-if="scrResult"
                  @click="() => { planScr = parseFloat(toDisplayScr(scrResult).toFixed(2)); planTank = scrTank; }"
                  class="mt-3 w-full py-1.5 px-4 bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-sm hover:shadow"
                >
                  Apply to Plan ↓
                </button>
            </div>
        </section>

        <!-- 2. Gas Planning -->
        <section class="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col h-full lg:col-span-2 2xl:col-span-2">
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
                                <input v-model.number="planScr" type="number" :step="stepSizes.scr" class="w-full pl-3 pr-12 py-2 rounded-lg bg-gray-50 border-transparent focus:border-green-500 focus:bg-white focus:ring-0 transition-all font-mono text-sm font-medium text-gray-800 group-hover:bg-gray-100">
                                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold pointer-events-none">{{ units.volume }}/min</span>
                             </div>
                        </div>
                         <div class="space-y-1">
                             <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Max Planned Depth</label>
                             <div class="relative group">
                                 <input v-model.number="planDepth" type="number" :step="stepSizes.depth" class="w-full pl-3 pr-8 py-2 rounded-lg bg-gray-50 border-transparent focus:border-green-500 focus:bg-white focus:ring-0 transition-all font-mono text-sm font-medium text-gray-800 group-hover:bg-gray-100">
                                 <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold pointer-events-none">{{ units.depth }}</span>
                             </div>
                         </div>
                     </div>

                     <div class="space-y-1">
                        <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Cylinder</label>
                        <div class="relative">
                            <select v-model="planTank" class="w-full pl-3 pr-8 py-2 rounded-lg bg-gray-50 border-transparent focus:border-green-500 focus:bg-white focus:ring-0 transition-all text-sm font-medium text-gray-700 appearance-none cursor-pointer hover:bg-gray-100">
                              <option v-for="t in tanks" :key="t.name" :value="t">{{ t.name }} ({{ Math.round(toDisplayVolume(t.capacity)) }}{{ units.volume }} / {{ Math.round(toDisplayPressure(t.pressure)) }}{{ units.pressure }})</option>
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
                                <option value="modified">Modified 1/3 (Conservative)</option>
                            </select>
                             <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
                                 <span class="i-carbon-chevron-down text-sm"></span>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-1">
                         <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Start Pressure</label>
                         <div class="relative group">
                            <input v-model.number="planStartPsi" type="number" :step="stepSizes.pressure" class="w-full pl-3 pr-8 py-2 rounded-lg bg-gray-50 border-transparent focus:border-green-500 focus:bg-white focus:ring-0 transition-all font-mono text-sm font-medium text-gray-800 group-hover:bg-gray-100">
                             <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold pointer-events-none">{{ units.pressure }}</span>
                         </div>
                    </div>
                </div>

                <!-- Visualization Column -->
                <div class="p-5 flex flex-col md:flex-row gap-4 items-center justify-center bg-gray-50/30">
                     <!-- Stats Grid -->
                    <div class="flex-1 w-full grid grid-cols-2 gap-2">
                         <!-- Min Gas -->
                        <div class="p-2.5 bg-red-50 rounded-lg border border-red-100 cursor-help tooltip-cell">
                             <div class="tooltip-content">{{ tooltips.minGas }}</div>
                             <div class="text-[9px] font-bold text-red-400 uppercase tracking-wider mb-0.5">Min Gas <span class="opacity-50"></span></div>
                             <div class="text-lg font-black text-red-600 font-mono leading-none">{{ Math.round(toDisplayPressure(planResult.minGasPsi)) }} <span class="text-[10px] font-normal text-red-400">{{ units.pressure }}</span></div>
                             <div class="text-[10px] text-red-400 font-medium mt-0.5">{{ toDisplayVolume(planResult.minGasVol).toFixed(1) }} {{ units.volume }}</div>
                        </div>

                         <!-- Usable Gas (Strategy) -->
                        <div class="p-2.5 bg-green-50 rounded-lg border border-green-100 cursor-help tooltip-cell">
                             <div class="tooltip-content">{{ tooltips.usableGas }}</div>
                             <div class="text-[9px] font-bold text-green-600 uppercase tracking-wider mb-0.5">Usable Gas <span class="opacity-50">({{ gasStrategy }})</span></div>
                             <div class="text-lg font-black text-green-700 font-mono leading-none">{{ Math.round(toDisplayPressure(planResult.strategyUsablePsi)) }} <span class="text-[10px] font-normal text-green-500">{{ units.pressure }}</span></div>
                            <div class="text-[10px] text-green-400 font-medium mt-0.5">{{ toDisplayVolume(planResult.strategyUsableVol).toFixed(1) }} {{ units.volume }}</div>

                        </div>

                         <!-- Turn Pressure -->
                        <div class="p-2.5 bg-white rounded-lg border border-gray-100 shadow-sm relative col-span-2 cursor-help tooltip-cell">
                             <div class="tooltip-content">{{ tooltips.turnPressure }}</div>
                             <div class="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Turn Pressure</div>
                             <div class="text-2xl font-black text-gray-800 font-mono leading-none">
                                {{ Math.round(toDisplayPressure(planResult.turnPressure)) }}
                                <span class="text-lg text-gray-400 font-normal">({{ Math.round(toDisplayPressure(planResult.turnPressureExact)) }})</span>
                                <span class="text-xs font-bold text-gray-400 ml-1">{{ units.pressure }}</span>
                             </div>
                        </div>

                         <!-- Duration Estimate -->
                        <div class="col-span-2 grid grid-cols-2 gap-2">
                             <div class="p-2.5 bg-indigo-50 rounded-lg border border-indigo-100 cursor-help tooltip-cell">
                                 <div class="tooltip-content">{{ tooltips.timeMax }}</div>
                                 <div class="text-[9px] font-bold text-indigo-500 uppercase tracking-wider mb-0.5">Time (Max Depth)</div>
                                 <div class="text-xl font-black text-indigo-700 font-mono leading-none">
                                    {{ Math.floor(planResult.expectedTimeMax) }} <span class="text-[10px] font-normal text-indigo-500">min</span>
                                 </div>
                             </div>
                             <div class="p-2.5 bg-indigo-50 rounded-lg border border-indigo-100 cursor-help tooltip-cell">
                                 <div class="tooltip-content">{{ tooltips.timeAvg }}</div>
                                 <div class="text-[9px] font-bold text-indigo-500 uppercase tracking-wider mb-0.5">Time (Avg Depth)</div>
                                 <div class="text-xl font-black text-indigo-700 font-mono leading-none">
                                    {{ Math.floor(planResult.expectedTimeAvg) }} <span class="text-[10px] font-normal text-indigo-500">min</span>
                                 </div>
                             </div>
                        </div>
                    </div>

                    <!-- Tank Graphic -->
                    <div class="relative w-20 h-56 shrink-0 bg-gray-200 rounded-2xl border-4 border-gray-300 overflow-hidden shadow-inner hidden sm:block">
                        <!-- Gas Fill -->
                        <div class="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-700 ease-out"
                             :style="{ height: `${Math.min(100, (fromDisplayPressure(planStartPsi) / planTank.pressure) * 100)}%` }">
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
             <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
               <h2 class="text-lg font-bold flex items-center gap-2 text-gray-800">
                <div class="p-1.5 bg-purple-100 rounded-lg text-purple-600">
                    <span class="i-carbon-chemistry text-lg block"></span>
                </div>
                Standard Gases
              </h2>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">PPO₂:</span>
                <select v-model="standardPPO2" class="text-sm font-medium bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-purple-600 cursor-pointer hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all">
                    <option v-for="ppo2 in ppo2Options" :key="ppo2" :value="ppo2">{{ ppo2 }}</option>
                </select>
              </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-100">
                            <th class="px-5 py-3 font-semibold">Gas Name</th>
                            <th class="px-5 py-3 font-semibold text-center">Oxygen (O<sub>2</sub>)</th>
                            <th class="px-5 py-3 font-semibold text-center">Helium (He)</th>
                            <th class="px-5 py-3 font-semibold text-center">MOD ({{ units.depth }})</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50 text-sm">
                        <tr v-for="gas in standardGases" :key="gas.name" class="hover:bg-purple-50/30 transition-colors group">
                            <td class="px-5 py-3 font-medium text-gray-900">{{ gas.name }}</td>
                            <td class="px-5 py-3 text-center text-gray-600">{{ gas.fO2 }}%</td>
                            <td class="px-5 py-3 text-center text-gray-400">{{ gas.fHe }}%</td>
                            <td class="px-5 py-3 text-center font-mono text-purple-600 font-bold bg-purple-50/50 group-hover:bg-purple-100/50 transition-colors">
                                {{ getMod(gas.fO2, standardPPO2) }}
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

/* Custom tooltip styles */
.tooltip-cell {
  position: relative;
}

.tooltip-cell .tooltip-content {
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%) translateX(8px);
  background: rgba(17, 24, 39, 0.95);
  color: #f3f4f6;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 11px;
  font-family: ui-monospace, monospace;
  white-space: pre-line;
  line-height: 1.5;
  min-width: 280px;
  max-width: 360px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s, transform 0.2s;
  z-index: 100;
  pointer-events: none;
}

.tooltip-cell .tooltip-content::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 100%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-right-color: rgba(17, 24, 39, 0.95);
}

.tooltip-cell:hover .tooltip-content {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(12px);
}
</style>
