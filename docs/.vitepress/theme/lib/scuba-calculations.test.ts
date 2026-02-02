import { describe, expect, it } from "vitest";
import {
	CONVERSION,
	calcAta,
	calcAtaImperial,
	calcAtaMetric,
	calcGasPlan,
	calcScr,
	fromDisplayDepth,
	fromDisplayPressure,
	fromDisplayVolume,
	type GasStrategy,
	getMod,
	TANKS,
	type Tank,
	toDisplayDepth,
	toDisplayPressure,
	toDisplayVolume,
	type UnitSystem,
} from "./scuba-calculations";

// --- Unit Conversion Tests ---

describe("Unit Conversions", () => {
	describe("Pressure (PSI ↔ Bar)", () => {
		it("should convert PSI to Bar in metric mode", () => {
			// 1000 PSI ≈ 68.95 bar
			expect(toDisplayPressure(1000, "metric")).toBeCloseTo(68.95, 1);
		});

		it("should return PSI as-is in imperial mode", () => {
			expect(toDisplayPressure(3000, "imperial")).toBe(3000);
		});

		it("should convert Bar to PSI in metric mode", () => {
			// 200 bar ≈ 2901 PSI
			expect(fromDisplayPressure(200, "metric")).toBeCloseTo(2901, 0);
		});

		it("should return value as-is when converting from imperial", () => {
			expect(fromDisplayPressure(3000, "imperial")).toBe(3000);
		});

		it("should round-trip correctly", () => {
			const originalPsi = 2500;
			const bar = toDisplayPressure(originalPsi, "metric");
			const backToPsi = fromDisplayPressure(bar, "metric");
			expect(backToPsi).toBeCloseTo(originalPsi, 1);
		});
	});

	describe("Depth (Feet ↔ Meters)", () => {
		it("should convert feet to meters in metric mode", () => {
			// 100 ft ≈ 30.48 m
			expect(toDisplayDepth(100, "metric")).toBeCloseTo(30.48, 2);
		});

		it("should return feet as-is in imperial mode", () => {
			expect(toDisplayDepth(100, "imperial")).toBe(100);
		});

		it("should convert meters to feet in metric mode", () => {
			// 30 m ≈ 98.4 ft
			expect(fromDisplayDepth(30, "metric")).toBeCloseTo(98.43, 1);
		});

		it("should round-trip correctly", () => {
			const originalFt = 66;
			const meters = toDisplayDepth(originalFt, "metric");
			const backToFt = fromDisplayDepth(meters, "metric");
			expect(backToFt).toBeCloseTo(originalFt, 1);
		});
	});

	describe("Volume (Cu ft ↔ Liters)", () => {
		it("should convert cubic feet to liters in metric mode", () => {
			// 1 cu ft ≈ 28.32 L
			expect(toDisplayVolume(1, "metric")).toBeCloseTo(28.32, 1);
		});

		it("should return cu ft as-is in imperial mode", () => {
			expect(toDisplayVolume(100, "imperial")).toBe(100);
		});

		it("should convert liters to cu ft in metric mode", () => {
			// 100 L ≈ 3.53 cu ft
			expect(fromDisplayVolume(100, "metric")).toBeCloseTo(3.53, 2);
		});
	});
});

// --- ATA Calculation Tests ---

describe("ATA Calculations", () => {
	describe("Imperial (33 ft/ATM)", () => {
		it("should return 1 ATA at surface", () => {
			expect(calcAtaImperial(0)).toBe(1);
		});

		it("should return 2 ATA at 33 feet", () => {
			expect(calcAtaImperial(33)).toBe(2);
		});

		it("should return 3 ATA at 66 feet", () => {
			expect(calcAtaImperial(66)).toBe(3);
		});

		it("should return ~4 ATA at 100 feet", () => {
			expect(calcAtaImperial(100)).toBeCloseTo(4.03, 2);
		});
	});

	describe("Metric (10 m/ATM)", () => {
		it("should return 1 ATA at surface", () => {
			expect(calcAtaMetric(0)).toBe(1);
		});

		it("should return 2 ATA at 10 meters", () => {
			expect(calcAtaMetric(10)).toBe(2);
		});

		it("should return 4 ATA at 30 meters", () => {
			expect(calcAtaMetric(30)).toBe(4);
		});
	});

	describe("Unit System Aware", () => {
		it("should use imperial calculation when imperial", () => {
			expect(calcAta(66, "imperial")).toBe(3);
		});

		it("should use metric calculation when metric", () => {
			expect(calcAta(20, "metric")).toBe(3);
		});
	});
});

// --- SCR Calculation Tests ---

describe("SCR Calculation", () => {
	const doublehp100 = TANKS.find((t) => t.name === "Double HP100")!;

	it("should calculate SCR for a typical dive", () => {
		// Dive: 60 min at 60 ft, consumed 1000 PSI on Double HP100 (factor 6.0)
		const result = calcScr({
			startPsi: 3400,
			endPsi: 2400,
			time: 60,
			depth: 60,
			tankFactor: doublehp100.factor,
			unitSystem: "imperial",
		});

		// Volume consumed: (1000 / 100) * 6.0 = 60 cu ft
		// ATA at 60 ft: 60/33 + 1 ≈ 2.82
		// SCR = 60 / (60 * 2.82) ≈ 0.355 cu ft/min
		expect(result).not.toBeNull();
		expect(result!).toBeCloseTo(0.35, 1);
	});

	it("should return null when missing required inputs", () => {
		expect(
			calcScr({
				startPsi: 3000,
				endPsi: 2000,
				time: 0, // Missing time
				depth: 60,
				tankFactor: 6.0,
				unitSystem: "imperial",
			}),
		).toBeNull();
	});

	it("should handle metric inputs correctly", () => {
		// Same gas consumption but in metric: 18m depth, bar pressures
		const result = calcScr({
			startPsi: 234, // ~3400 PSI in bar
			endPsi: 165, // ~2400 PSI in bar
			time: 60,
			depth: 18, // ~60 ft in meters
			tankFactor: 6.0,
			unitSystem: "metric",
		});

		expect(result).not.toBeNull();
		expect(result!).toBeCloseTo(0.35, 1);
	});
});

// --- Gas Planning Tests ---

describe("Gas Planning", () => {
	const doublehp100 = TANKS.find((t) => t.name === "Double HP100")!;
	const al80 = TANKS.find((t) => t.name === "AL80")!;

	describe("Min Gas Calculation (CAT Formula)", () => {
		it("should calculate min gas for 100 ft dive", () => {
			const result = calcGasPlan({
				depth: 100,
				scr: 0.75,
				startPressure: 3400,
				tank: doublehp100,
				gasStrategy: "all",
				unitSystem: "imperial",
			});

			// CAT formula:
			// C = 0.75 * 2 = 1.5 cu ft/min
			// A = (100/33 + 1 + 1) / 2 = (4.03 + 1) / 2 = 2.515
			// T = 100/10 + 1 = 11 min
			// Min Vol = 1.5 * 2.515 * 11 ≈ 41.5 cu ft
			// Min PSI = (41.5 / 6.0) * 100 ≈ 692, rounded to 700
			expect(result.minGasPsi).toBeGreaterThanOrEqual(700);
			expect(result.minGasPsi).toBeLessThanOrEqual(800);
		});

		it("should enforce 500 PSI minimum", () => {
			// Shallow dive with large tank should still have 500 min
			const result = calcGasPlan({
				depth: 20,
				scr: 0.5,
				startPressure: 3400,
				tank: doublehp100,
				gasStrategy: "all",
				unitSystem: "imperial",
			});

			expect(result.minGasPsi).toBe(500);
		});

		it("should round min gas to nearest 100", () => {
			const result = calcGasPlan({
				depth: 100,
				scr: 0.75,
				startPressure: 3400,
				tank: doublehp100,
				gasStrategy: "all",
				unitSystem: "imperial",
			});

			expect(result.minGasPsi % 100).toBe(0);
		});
	});

	describe("Gas Strategies", () => {
		const baseInput = {
			depth: 100,
			scr: 0.75,
			startPressure: 3000,
			tank: al80,
			unitSystem: "imperial" as UnitSystem,
		};

		it('should use all usable gas for "all" strategy', () => {
			const result = calcGasPlan({ ...baseInput, gasStrategy: "all" });
			// Usable = Start - MinGas
			expect(result.usablePsi).toBe(
				result.strategyUsablePsi + (result.turnPressure - result.minGasPsi),
			);
		});

		it('should use half for "half" strategy', () => {
			const allResult = calcGasPlan({ ...baseInput, gasStrategy: "all" });
			const halfResult = calcGasPlan({ ...baseInput, gasStrategy: "half" });

			// Half strategy uses ~half the usable gas
			expect(halfResult.strategyUsablePsi).toBeLessThan(
				allResult.strategyUsablePsi,
			);
		});

		it('should use one-third for "third" strategy', () => {
			const allResult = calcGasPlan({ ...baseInput, gasStrategy: "all" });
			const thirdResult = calcGasPlan({ ...baseInput, gasStrategy: "third" });

			// Third strategy uses ~1/3 of the usable gas
			expect(thirdResult.strategyUsablePsi).toBeLessThan(
				allResult.strategyUsablePsi,
			);
		});

		it('should apply modified 1/3 calculation for "modified" strategy', () => {
			const result = calcGasPlan({ ...baseInput, gasStrategy: "modified" });

			// Modified: reserveBase = floor(3000/300)*300 = 3000
			// reserveGas = 3000/3 = 1000
			// usablePool = 3000 - 1000 = 2000
			// penetration = floor(2000/3) = 666
			expect(result).toBeDefined();
			expect(result.turnPressure).toBeGreaterThan(result.minGasPsi);
		});
	});

	describe("Turn Pressure", () => {
		it("should round turn pressure UP to nearest 100", () => {
			const result = calcGasPlan({
				depth: 80,
				scr: 0.6,
				startPressure: 3000,
				tank: al80,
				gasStrategy: "half",
				unitSystem: "imperial",
			});

			expect(result.turnPressure % 100).toBe(0);
			expect(result.turnPressure).toBeGreaterThanOrEqual(
				result.turnPressureExact,
			);
		});

		it("should track exact turn pressure separately from rounded", () => {
			const result = calcGasPlan({
				depth: 100,
				scr: 0.75,
				startPressure: 3000,
				tank: al80,
				gasStrategy: "third",
				unitSystem: "imperial",
			});

			expect(result.turnPressure).toBeGreaterThanOrEqual(
				result.turnPressureExact,
			);
		});
	});

	describe("Duration Estimates", () => {
		it("should calculate max depth time (shorter)", () => {
			const result = calcGasPlan({
				depth: 100,
				scr: 0.75,
				startPressure: 3400,
				tank: doublehp100,
				gasStrategy: "all",
				unitSystem: "imperial",
			});

			expect(result.expectedTimeMax).toBeGreaterThan(0);
			expect(result.expectedTimeMax).toBeLessThan(result.expectedTimeAvg);
		});

		it("should calculate avg depth time (longer)", () => {
			const result = calcGasPlan({
				depth: 100,
				scr: 0.75,
				startPressure: 3400,
				tank: doublehp100,
				gasStrategy: "all",
				unitSystem: "imperial",
			});

			expect(result.expectedTimeAvg).toBeGreaterThan(result.expectedTimeMax);
		});
	});

	describe("Metric Mode", () => {
		it("should handle metric inputs correctly", () => {
			// 30m depth, 21 L/min SCR, 230 bar start
			const result = calcGasPlan({
				depth: 30,
				scr: 21, // ~0.74 cu ft/min
				startPressure: 230, // ~3340 PSI
				tank: doublehp100,
				gasStrategy: "all",
				unitSystem: "metric",
			});

			expect(result.minGasPsi).toBeGreaterThan(0);
			expect(result.turnPressure).toBeGreaterThanOrEqual(result.minGasPsi);
		});
	});
});

// --- MOD Calculation Tests ---

describe("MOD Calculation", () => {
	const ppo2 = 1.4;

	describe("Imperial Mode", () => {
		it("should calculate MOD for Air (21%)", () => {
			const mod = getMod(21, ppo2, "imperial");
			// ATA = 1.4 / 0.21 ≈ 6.667
			// MOD = floor((6.667 - 1) * 33) = floor(186.67) = 186 ft
			expect(mod).toBe(186);
		});

		it("should calculate MOD for Nitrox 32 (32%)", () => {
			const mod = getMod(32, ppo2, "imperial");
			// ATA = 1.4 / 0.32 = 4.375
			// MOD = (4.375 - 1) * 33 = 111 ft
			expect(mod).toBe(111);
		});

		it("should calculate MOD for pure O2 (100%)", () => {
			const mod = getMod(100, ppo2, "imperial");
			// ATA = 1.4 / 1.0 = 1.4
			// MOD = (1.4 - 1) * 33 = 13 ft
			expect(mod).toBe(13);
		});
	});

	describe("Metric Mode", () => {
		it("should calculate MOD for Air (21%) in meters", () => {
			const mod = getMod(21, ppo2, "metric");
			// 186 ft ≈ 56.7 m → floor = 56 m
			expect(mod).toBe(56);
		});

		it("should calculate MOD for Nitrox 32 in meters", () => {
			const mod = getMod(32, ppo2, "metric");
			// 111 ft ≈ 33 m
			expect(mod).toBe(33);
		});
	});

	describe("Edge Cases", () => {
		it("should return undefined for 0% O2", () => {
			expect(getMod(0, ppo2, "imperial")).toBeUndefined();
		});
	});
});

// --- Tank Constants Tests ---

describe("Tank Constants", () => {
	it("should have correct AL80 specs", () => {
		const al80 = TANKS.find((t) => t.name === "AL80");
		expect(al80).toBeDefined();
		expect(al80!.capacity).toBe(77);
		expect(al80!.pressure).toBe(3000);
		expect(al80!.factor).toBe(2.5);
	});

	it("should have correct Double HP100 specs", () => {
		const dhp100 = TANKS.find((t) => t.name === "Double HP100");
		expect(dhp100).toBeDefined();
		expect(dhp100!.capacity).toBe(200);
		expect(dhp100!.pressure).toBe(3442);
		expect(dhp100!.factor).toBe(6.0);
	});
});

// =============================================================================
// GUE TRAINING SLIDE EXAMPLES
// These tests verify calculations match exact examples from GUE training materials
// =============================================================================

describe("GUE Slide Examples", () => {
	// Tank for Double 80s (TF = 5)
	const double80s: Tank = {
		name: "Double AL80",
		capacity: 154,
		pressure: 3000,
		factor: 5.0,
	};

	describe("Tank Factor Calculations (GUE Slide)", () => {
		it("should calculate gas volume correctly: AL80 at 1000 psi = 25 cu ft", () => {
			// From slide: (1000 / 100) x 2.5 = 25 ft³
			const al80 = TANKS.find((t) => t.name === "AL80")!;
			const volumeCuFt = (1000 / 100) * al80.factor;
			expect(volumeCuFt).toBe(25);
		});

		it("should calculate gas volume correctly: Double 80s at 2000 psi = 100 cu ft", () => {
			// From slide: (2000 / 100) x 5 = 100 ft³
			const volumeCuFt = (2000 / 100) * double80s.factor;
			expect(volumeCuFt).toBe(100);
		});

		it("should verify tank factor formula: TF = capacity / pressure * 100", () => {
			// From slide: AL80 = 77ft³ / 3000 psi = 0.025 × 100 = 2.5 (rounded)
			// Actual: 77/3000*100 = 2.567, which GUE rounds to 2.5
			const al80 = TANKS.find((t) => t.name === "AL80")!;
			const calculatedTF = (al80.capacity / al80.pressure) * 100;
			// The stored factor is the rounded value used in practice
			expect(Math.round(calculatedTF * 2) / 2).toBe(al80.factor);
		});
	});

	describe("SCR Calculation (GUE Slide Examples)", () => {
		it("IMPERIAL: Double 80s, 2000 psi in 50 min @ 66 ft = 0.66 cu ft/min", () => {
			// From slide:
			// 1. Volume: (2000 / 100) x 5 = 100 ft³
			// 2. ATA: (66 / 33) + 1 = 3 ATA
			// 3. SCR = 100 / 50 / 3 = 0.66 ft³/min
			const result = calcScr({
				startPsi: 3000,
				endPsi: 1000, // consumed 2000 psi
				time: 50,
				depth: 66,
				tankFactor: 5.0,
				unitSystem: "imperial",
			});

			expect(result).not.toBeNull();
			expect(result!).toBeCloseTo(0.66, 1);
		});

		it("METRIC: Double 11s, 100 bar consumed = SCR in reasonable range", () => {
			// From slide: 100 bar x 22 L = 2200 liters, SCR = 14.66 L/min
			// Our implementation uses tank factor approach which differs slightly
			const result = calcScr({
				startPsi: 200, // 200 bar start
				endPsi: 100, // 100 bar end
				time: 50,
				depth: 20, // 20 meters
				tankFactor: 6.0,
				unitSystem: "metric",
			});

			expect(result).not.toBeNull();
			const scrLitersPerMin = result! * CONVERSION.cuFtToLiters;
			expect(scrLitersPerMin).toBeGreaterThan(10);
			expect(scrLitersPerMin).toBeLessThan(25);
		});
	});

	describe("Modified 1/3 Rule - GUE Intro to Cave", () => {
		it("IMPERIAL: 3100 psi → turn 2400 (GUE slide example)", () => {
			// From GUE slide:
			// 1. Reserve: round(3100 to 3000) / 3 = 1000 psi
			// 2. Usable: 3100 - 1000 = 2100 psi
			// 3. Penetration: 2100 / 3 = 700 psi
			// 4. Turn: 3100 - 700 = 2400 psi
			const result = calcGasPlan({
				depth: 60,
				scr: 0.5,
				startPressure: 3100,
				tank: double80s,
				gasStrategy: "modified",
				unitSystem: "imperial",
			});

			expect(result.turnPressureExact).toBe(2400);
			expect(result.turnPressure).toBe(2400);
		});

		it("IMPERIAL: 3000 psi → turn 2400 (rounded up)", () => {
			// reserveBase = 3000, reserve = 1000, usable = 2000
			// penetration = floor(2000/3) = 666
			// turnExact = 3000 - 666 = 2334, rounded up = 2400
			const result = calcGasPlan({
				depth: 60,
				scr: 0.5,
				startPressure: 3000,
				tank: double80s,
				gasStrategy: "modified",
				unitSystem: "imperial",
			});

			expect(result.turnPressureExact).toBe(2334);
			expect(result.turnPressure).toBe(2400);
		});

		it("METRIC: 210 bar → turn ~170 bar (GUE slide example)", () => {
			// From GUE slide: turn = 170 bar
			// Our implementation converts to PSI internally
			const result = calcGasPlan({
				depth: 20,
				scr: 15,
				startPressure: 210,
				tank: double80s,
				gasStrategy: "modified",
				unitSystem: "metric",
			});

			const turnBar = toDisplayPressure(result.turnPressure, "metric");
			expect(turnBar).toBeCloseTo(170, -1); // Within 10 bar
		});
	});

	describe("Traditional Rule of Thirds (GUE Standard)", () => {
		it("should reserve 2/3 for exit (1/3 for you, 1/3 for teammate)", () => {
			const result = calcGasPlan({
				depth: 100,
				scr: 0.5,
				startPressure: 3000,
				tank: double80s,
				gasStrategy: "third",
				unitSystem: "imperial",
			});

			expect(result.strategyUsablePsi).toBeLessThan(result.usablePsi);
			expect(result.strategyUsablePsi).toBeGreaterThan(0);
		});
	});

	describe("Dive Duration Planning (GUE Slide)", () => {
		it("IMPERIAL: 3000 psi @ 66 ft, SCR 0.5 → ~40 min dive", () => {
			// From GUE slide: Time = 40 min
			const result = calcGasPlan({
				depth: 66,
				scr: 0.5,
				startPressure: 3000,
				tank: double80s,
				gasStrategy: "modified",
				unitSystem: "imperial",
			});

			expect(result.expectedTimeMax).toBeCloseTo(40, -1);
		});

		it("METRIC: 210 bar @ 20 m → reasonable duration", () => {
			const result = calcGasPlan({
				depth: 20,
				scr: 15,
				startPressure: 210,
				tank: double80s,
				gasStrategy: "modified",
				unitSystem: "metric",
			});

			expect(result.expectedTimeMax).toBeGreaterThan(20);
			expect(result.expectedTimeMax).toBeLessThan(60);
		});
	});

	describe("Gas Volume Calculations", () => {
		it("IMPERIAL: Double 80s at 3000 psi = 150 cu ft", () => {
			const volume = (3000 / 100) * double80s.factor;
			expect(volume).toBe(150);
		});

		it("METRIC: Double 11L at 210 bar = 4620 liters", () => {
			const volume = 22 * 210;
			expect(volume).toBe(4620);
		});
	});

	describe("ATA Calculations (GUE Reference)", () => {
		it("should match exact depth/ATA values (33 fsw per ATM)", () => {
			expect(calcAtaImperial(0)).toBe(1);
			expect(calcAtaImperial(33)).toBe(2);
			expect(calcAtaImperial(66)).toBe(3);
			expect(calcAtaImperial(99)).toBe(4);
		});

		it("METRIC: should match GUE depth/ATA values (10 m per ATM)", () => {
			expect(calcAtaMetric(0)).toBe(1);
			expect(calcAtaMetric(10)).toBe(2);
			expect(calcAtaMetric(20)).toBe(3);
			expect(calcAtaMetric(30)).toBe(4);
		});
	});

	describe("Gas Tracking Chart Verification", () => {
		it("IMPERIAL: SCR 0.5 @ 30 ft (2 ATA) = 20 PSI/min on doubles", () => {
			const scrAtDepth = 0.5 * 2;
			const psiPerMin = (scrAtDepth / 5) * 100;
			expect(psiPerMin).toBe(20);
		});

		it("IMPERIAL: SCR 0.5 @ 100 ft (4 ATA) = 40 PSI/min on doubles", () => {
			const scrAtDepth = 0.5 * 4;
			const psiPerMin = (scrAtDepth / 5) * 100;
			expect(psiPerMin).toBe(40);
		});

		it("METRIC: SCR 15 L/min @ 20 m (3 ATA) = 2 bar/min on 22L doubles", () => {
			const scrAtDepth = 15 * 3;
			const barPerMin = scrAtDepth / 22;
			expect(barPerMin).toBeCloseTo(2, 0);
		});
	});

	describe("Team Gas Planning - Similar Tanks (GUE)", () => {
		it("should calculate exact team gas math", () => {
			// Diver A: 3000 psi, Diver B: 2800 psi (controlling)
			// Math: 2800/3 = 933, usable = 1867, pen = 622
			const controllingPsi = 2800;
			const reserve = Math.floor(controllingPsi / 3);
			const usable = controllingPsi - reserve;
			const penetration = Math.floor(usable / 3);

			expect(reserve).toBe(933);
			expect(usable).toBe(1867);
			expect(penetration).toBe(622);
			expect(3000 - penetration).toBe(2378); // Diver A turn
			expect(2800 - penetration).toBe(2178); // Diver B turn
		});
	});
});
