/**
 * Scuba Calculations Library
 * Pure functions for scuba diving gas management calculations.
 * Based on GUE (Global Underwater Explorers) standards.
 */

// --- Types ---

export type UnitSystem = "imperial" | "metric";

export type Tank = {
	name: string;
	capacity: number; // cu ft (nominal) - internal Imperial
	pressure: number; // psi - internal Imperial
	factor: number; // GUE Tank Factor
};

export type GasStrategy = "all" | "half" | "third" | "modified";

export type PlanResult = {
	minGasPsi: number;
	usablePsi: number;
	strategyUsablePsi: number;
	strategyUsableVol: number;
	turnPressure: number;
	turnPressureExact: number;
	minGasVol: number;
	expectedTimeMax: number;
	expectedTimeAvg: number;
};

export type ScrInput = {
	startPsi: number;
	endPsi: number;
	time: number;
	depth: number;
	tankFactor: number;
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
 * Calculate Surface Consumption Rate (SCR/RMV)
 * Formula: SCR = Volume Consumed / (Time × ATA)
 * Returns SCR in cu ft/min (internal Imperial units)
 */
export const calcScr = (input: ScrInput): number | null => {
	const { startPsi, endPsi, time, depth, tankFactor, unitSystem } = input;

	if (startPsi === null || endPsi === null || !time || depth === null) {
		return null;
	}

	// Convert display pressure to internal PSI for calculation
	const startPsiInternal = fromDisplayPressure(startPsi, unitSystem);
	const endPsiInternal = fromDisplayPressure(endPsi, unitSystem);
	const psiConsumed = startPsiInternal - endPsiInternal;

	// Formula: (PSI / 100) * TankFactor
	const volConsumed = (psiConsumed / 100) * tankFactor;

	const ata = calcAta(depth, unitSystem);
	// SCR (RMV) = Vol / (Time * ATA)
	return volConsumed / (time * ata);
};

// --- Gas Planning Calculation ---

/**
 * Calculate comprehensive gas plan including min gas, turn pressure, and duration estimates.
 * Based on GUE standards and CAT formula for minimum gas.
 */
export const calcGasPlan = (input: GasPlanInput): PlanResult => {
	const { depth, scr, startPressure, tank, gasStrategy, unitSystem } = input;

	// Convert display units to internal Imperial for calculation
	const depthFt = fromDisplayDepth(depth, unitSystem);
	const scrCuFt = fromDisplayVolume(scr, unitSystem);
	const startPsi = fromDisplayPressure(startPressure, unitSystem);

	// 1. Min Gas (CAT Formula)
	// C = consumption for 2 divers = SCR * 2
	// A = Avg ATA = (ATA_max + ATA_surf) / 2 = (ATA_max + 1) / 2
	// T = Time to surface = depth / 10 + 1 (10 ft/min ascent)
	const timeToSurface = depthFt / 10 + 1;
	const maxAta = calcAtaImperial(depthFt);
	const avgAta = (maxAta + 1) / 2;
	const twoDiverScr = scrCuFt * 2;

	const minGasVol = twoDiverScr * avgAta * timeToSurface;

	// Convert Vol to PSI: (Vol / TankFactor) * 100
	let minGasPsi = Math.ceil((minGasVol / tank.factor) * 100);

	// Round up to nearest 100 psi
	minGasPsi = Math.ceil(minGasPsi / 100) * 100;
	// Minimum 500 psi
	minGasPsi = Math.max(minGasPsi, 500);

	const usablePsi = Math.max(0, startPsi - minGasPsi);

	// 2. Apply Gas Strategy
	let strategyUsablePsi = usablePsi;
	if (gasStrategy === "half") {
		strategyUsablePsi = Math.floor(usablePsi / 2);
	} else if (gasStrategy === "third") {
		strategyUsablePsi = Math.floor(usablePsi / 3);
	} else if (gasStrategy === "modified") {
		// Modified Rule of 1/3 (Intro to Cave)
		const reserveBase = Math.floor(startPsi / 300) * 300;
		const reserveGas = reserveBase / 3;
		const usablePool = startPsi - reserveGas;
		strategyUsablePsi = Math.floor(usablePool / 3);
	}

	// 3. Calculate Turn Pressure
	const unroundedUsable = strategyUsablePsi;
	const turnPressureExact = startPsi - unroundedUsable;

	// Round UP to nearest 100 psi (conservative)
	const turnPressure = Math.ceil(turnPressureExact / 100) * 100;

	// Recalculate Usable Gas based on the rounded Turn Pressure
	strategyUsablePsi = startPsi - turnPressure;

	// 4. Duration Planning
	const usedPsi =
		gasStrategy === "all" ? strategyUsablePsi : strategyUsablePsi * 2;
	const usedVol = (usedPsi / 100) * tank.factor;
	const expectedTimeMax = usedVol / (scrCuFt * maxAta);
	const expectedTimeAvg = usedVol / (scrCuFt * avgAta);

	// Calculate strategy usable volume
	const strategyUsableVol = (strategyUsablePsi / 100) * tank.factor;

	return {
		minGasPsi,
		usablePsi,
		strategyUsablePsi,
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
 */
export const getMod = (
	fO2: number,
	pO2: number,
	unitSystem: UnitSystem,
): number | undefined => {
	if (fO2 === 0) return undefined;

	const ata = pO2 / (fO2 / 100);
	// Imperial: (ata - 1) * 33 feet
	const modFt = Math.floor((ata - 1) * 33);

	return unitSystem === "metric"
		? Math.floor(modFt * CONVERSION.feetToMeters)
		: modFt;
};
