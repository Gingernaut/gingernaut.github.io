/**
 * Scuba Calculations Library
 * Pure functions for scuba diving gas management calculations.
 * Based on GUE (Global Underwater Explorers) standards.
 *
 * Architecture: All public calculation functions (calcScr, calcGasPlan, getMod)
 * accept and return values in "display units" — the user's chosen unit system.
 * Imperial uses PSI, feet, and cubic feet. Metric uses bar, meters, and liters.
 */

// --- Types ---

export type UnitSystem = "imperial" | "metric";

export type Tank = {
	name: string;
	capacity: number; // cu ft (nominal) - Imperial
	pressure: number; // psi - Imperial rated pressure
	factor: number; // GUE Imperial Tank Factor (cu ft per 100 PSI)
	waterVolumeLiters: number; // Internal (water) volume in liters (metric tank factor)
};

export type GasStrategy = "all" | "half" | "third" | "modified";

export type PlanResult = {
	minGasPressure: number; // Display units (PSI or bar)
	usablePressure: number; // Display units
	strategyUsablePressure: number; // Display units
	strategyUsableVol: number; // Display units (cu ft or L)
	turnPressure: number; // Display units (rounded)
	turnPressureExact: number; // Display units (unrounded)
	minGasVol: number; // Display units (cu ft or L)
	expectedTimeMax: number; // minutes
	expectedTimeAvg: number; // minutes
};

export type ScrInput = {
	startPressure: number; // Display units (PSI or bar)
	endPressure: number; // Display units
	time: number; // minutes
	depth: number; // Display units (ft or m)
	tank: Tank;
	unitSystem: UnitSystem;
};

export type GasPlanInput = {
	depth: number; // Display units (ft or m)
	scr: number; // Display units (cu ft/min or L/min)
	startPressure: number; // Display units (psi or bar)
	tank: Tank;
	gasStrategy: GasStrategy;
	unitSystem: UnitSystem;
};

// --- Constants ---

export const CONVERSION = {
	feetToMeters: 0.3048,
	metersToFeet: 3.28084,
	psiToBar: 0.0689476,
	barToPsi: 14.5038,
	cuFtToLiters: 28.3168,
	litersToCuFt: 0.0353147,
} as const;

export const TANKS: readonly Tank[] = [
	{
		name: "AL80",
		capacity: 77,
		pressure: 3000,
		factor: 2.5,
		waterVolumeLiters: 11.1,
	},
	{
		name: "HP100",
		capacity: 100,
		pressure: 3442,
		factor: 3.0,
		waterVolumeLiters: 13.2,
	},
	{
		name: "LP85",
		capacity: 85,
		pressure: 2640,
		factor: 3.0,
		waterVolumeLiters: 14.0,
	},
	{
		name: "LP95",
		capacity: 95,
		pressure: 2640,
		factor: 3.5,
		waterVolumeLiters: 15.1,
	},
	{
		name: "LP104",
		capacity: 104,
		pressure: 2640,
		factor: 4.0,
		waterVolumeLiters: 16.4,
	},
	{
		name: "HP120",
		capacity: 120,
		pressure: 3442,
		factor: 3.5,
		waterVolumeLiters: 15.1,
	},
	{
		name: "Double AL80",
		capacity: 154,
		pressure: 3000,
		factor: 5.0,
		waterVolumeLiters: 22.2,
	},
	{
		name: "Double HP100",
		capacity: 200,
		pressure: 3442,
		factor: 6.0,
		waterVolumeLiters: 26.4,
	},
	{
		name: "Double LP85",
		capacity: 170,
		pressure: 2640,
		factor: 6.0,
		waterVolumeLiters: 28.0,
	},
];

export const STANDARD_GASES = [
	{ name: "Air", fO2: 21, fHe: 0 },
	{ name: "Nitrox 32", fO2: 32, fHe: 0 },
	{ name: "TriMix 21/35", fO2: 21, fHe: 35 },
	{ name: "TriMix 18/45", fO2: 18, fHe: 45 },
	{ name: "TriMix 15/55", fO2: 15, fHe: 55 },
	{ name: "TriMix 12/65", fO2: 12, fHe: 65 },
	{ name: "TriMix 10/70", fO2: 10, fHe: 70 },
] as const;

// --- Unit Conversion Functions ---

export const toDisplayPressure = (
	psi: number,
	unitSystem: UnitSystem,
): number => (unitSystem === "metric" ? psi * CONVERSION.psiToBar : psi);

export const fromDisplayPressure = (
	val: number,
	unitSystem: UnitSystem,
): number => (unitSystem === "metric" ? val * CONVERSION.barToPsi : val);

export const toDisplayDepth = (ft: number, unitSystem: UnitSystem): number =>
	unitSystem === "metric" ? ft * CONVERSION.feetToMeters : ft;

export const fromDisplayDepth = (
	val: number,
	unitSystem: UnitSystem,
): number => (unitSystem === "metric" ? val * CONVERSION.metersToFeet : val);

export const toDisplayVolume = (
	cuFt: number,
	unitSystem: UnitSystem,
): number => (unitSystem === "metric" ? cuFt * CONVERSION.cuFtToLiters : cuFt);

export const fromDisplayVolume = (
	val: number,
	unitSystem: UnitSystem,
): number => (unitSystem === "metric" ? val * CONVERSION.litersToCuFt : val);

// --- Volume/Pressure Conversion (unit-aware, using native tank factors) ---

/** Convert a pressure delta to gas volume using the native tank factor for the unit system */
export const pressureToVolume = (
	pressure: number,
	tank: Tank,
	unitSystem: UnitSystem,
): number => {
	if (unitSystem === "metric") {
		return pressure * tank.waterVolumeLiters; // bar * L = L
	}
	return (pressure / 100) * tank.factor; // (PSI / 100) * TF = cu ft
};

/** Convert a gas volume to pressure using the native tank factor for the unit system */
export const volumeToPressure = (
	volume: number,
	tank: Tank,
	unitSystem: UnitSystem,
): number => {
	if (unitSystem === "metric") {
		return volume / tank.waterVolumeLiters; // L / L = bar
	}
	return (volume / tank.factor) * 100; // (cu ft / TF) * 100 = PSI
};

// --- ATA Calculations ---

/** Calculate ATA using Imperial units (33 feet of seawater per ATM) */
export const calcAtaImperial = (depthFt: number): number => depthFt / 33 + 1;

/** Calculate ATA using Metric units (10 meters of seawater per ATM) */
export const calcAtaMetric = (depthM: number): number => depthM / 10 + 1;

/** Calculate ATA based on unit system (takes display units) */
export const calcAta = (depth: number, unitSystem: UnitSystem): number =>
	unitSystem === "imperial" ? calcAtaImperial(depth) : calcAtaMetric(depth);

// --- SCR Calculation ---

/**
 * Calculate Surface Consumption Rate (SCR/RMV).
 * All inputs and return value are in display units.
 * Imperial: returns cu ft/min. Metric: returns L/min.
 */
export const calcScr = (input: ScrInput): number | null => {
	const { startPressure, endPressure, time, depth, tank, unitSystem } = input;

	if (
		startPressure === null ||
		endPressure === null ||
		!time ||
		depth === null
	) {
		return null;
	}

	const pressureConsumed = startPressure - endPressure;
	const volConsumed = pressureToVolume(pressureConsumed, tank, unitSystem);
	const ata = calcAta(depth, unitSystem);

	return volConsumed / (time * ata);
};

// --- Gas Planning Calculation ---

/**
 * Calculate comprehensive gas plan including min gas, turn pressure, and duration estimates.
 * Based on GUE standards and CAT formula for minimum gas.
 * All inputs and outputs are in display units (PSI/ft/cuft or bar/m/L).
 */
export const calcGasPlan = (input: GasPlanInput): PlanResult => {
	const { depth, scr, startPressure, tank, gasStrategy, unitSystem } = input;

	// Ascent rate: 10 ft/min (imperial) or 3 m/min (metric)
	const ascentRate = unitSystem === "metric" ? 3 : 10;
	const timeToSurface = depth / ascentRate + 1;

	const maxAta = calcAta(depth, unitSystem);
	const avgAta = (maxAta + 1) / 2;

	// 1. Min Gas (CAT Formula)
	// C = consumption for 2 divers = SCR * 2
	// A = Avg ATA = (ATA_max + 1) / 2
	// T = Time to surface at ascent rate + 1 min safety stop
	const twoDiverScr = scr * 2;
	const minGasVol = twoDiverScr * avgAta * timeToSurface;

	let minGasPressure = Math.ceil(volumeToPressure(minGasVol, tank, unitSystem));

	// Unit-aware rounding and minimum
	if (unitSystem === "metric") {
		// Round up to nearest 5 bar, minimum 35 bar
		minGasPressure = Math.max(Math.ceil(minGasPressure / 5) * 5, 35);
	} else {
		// Round up to nearest 100 PSI, minimum 500 PSI
		minGasPressure = Math.max(Math.ceil(minGasPressure / 100) * 100, 500);
	}

	const usablePressure = Math.max(0, startPressure - minGasPressure);

	// 2. Apply Gas Strategy
	let strategyUsablePressure = usablePressure;
	if (gasStrategy === "half") {
		strategyUsablePressure = Math.floor(usablePressure / 2);
	} else if (gasStrategy === "third") {
		strategyUsablePressure = Math.floor(usablePressure / 3);
	} else if (gasStrategy === "modified") {
		// Modified 1/3: round base to 300 PSI (imperial) or 20 bar (metric)
		const roundBase = unitSystem === "metric" ? 20 : 300;
		const reserveBase = Math.floor(startPressure / roundBase) * roundBase;
		const reserveGas = reserveBase / 3;
		const usablePool = startPressure - reserveGas;
		strategyUsablePressure = Math.floor(usablePool / 3);
	}

	// 3. Turn Pressure (round UP to nearest 100 PSI or 10 bar)
	const turnPressureExact = startPressure - strategyUsablePressure;
	const turnStep = unitSystem === "metric" ? 10 : 100;
	const turnPressure = Math.ceil(turnPressureExact / turnStep) * turnStep;

	// Recalculate usable gas based on rounded turn pressure
	strategyUsablePressure = startPressure - turnPressure;

	// 4. Duration Planning
	const usedPressure =
		gasStrategy === "all" ? strategyUsablePressure : strategyUsablePressure * 2;
	const usedVol = pressureToVolume(usedPressure, tank, unitSystem);
	const expectedTimeMax = usedVol / (scr * maxAta);
	const expectedTimeAvg = usedVol / (scr * avgAta);

	const strategyUsableVol = pressureToVolume(
		strategyUsablePressure,
		tank,
		unitSystem,
	);

	return {
		minGasPressure,
		usablePressure,
		strategyUsablePressure,
		strategyUsableVol,
		turnPressure,
		turnPressureExact,
		minGasVol,
		expectedTimeMax,
		expectedTimeAvg,
	};
};

// --- MOD Calculation ---

/**
 * Calculate Maximum Operating Depth for a given O2 percentage and PPO2 limit.
 * Returns depth in display units (ft or m).
 * Uses native unit calculation to avoid double-floor conversion errors.
 */
export const getMod = (
	fO2: number,
	pO2: number,
	unitSystem: UnitSystem,
): number | undefined => {
	if (fO2 === 0) return undefined;

	// Compute ATA as (pO2 * 100) / fO2 to avoid IEEE 754 precision loss
	// from the intermediate division pO2 / (fO2 / 100)
	const ata = (pO2 * 100) / fO2;

	if (unitSystem === "metric") {
		// Native metric: MOD = floor((ata - 1) * 10) meters
		return Math.floor((ata - 1) * 10);
	}

	// Imperial: MOD = floor((ata - 1) * 33) feet
	return Math.floor((ata - 1) * 33);
};
