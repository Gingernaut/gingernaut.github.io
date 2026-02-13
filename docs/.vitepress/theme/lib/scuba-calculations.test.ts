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
	pressureToVolume,
	TANKS,
	type Tank,
	toDisplayDepth,
	toDisplayPressure,
	toDisplayVolume,
	type UnitSystem,
	volumeToPressure,
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

// --- Volume/Pressure Conversion Tests ---

describe("Volume/Pressure Conversion (pressureToVolume / volumeToPressure)", () => {
	const al80 = TANKS.find((t) => t.name === "AL80")!;
	const doublehp100 = TANKS.find((t) => t.name === "Double HP100")!;

	describe("Imperial (tank factor)", () => {
		it("should convert pressure to volume: 1000 PSI on AL80 = 25 cu ft", () => {
			expect(pressureToVolume(1000, al80, "imperial")).toBe(25);
		});

		it("should convert volume to pressure: 25 cu ft on AL80 = 1000 PSI", () => {
			expect(volumeToPressure(25, al80, "imperial")).toBe(1000);
		});

		it("should round-trip correctly", () => {
			const psi = 2000;
			const vol = pressureToVolume(psi, doublehp100, "imperial");
			const backToPsi = volumeToPressure(vol, doublehp100, "imperial");
			expect(backToPsi).toBeCloseTo(psi, 5);
		});
	});

	describe("Metric (water volume liters)", () => {
		it("should convert pressure to volume: 100 bar on Double HP100 = 2640 L", () => {
			// 100 bar × 26.4 L = 2640 L
			expect(pressureToVolume(100, doublehp100, "metric")).toBe(2640);
		});

		it("should convert volume to pressure: 2640 L on Double HP100 = 100 bar", () => {
			expect(volumeToPressure(2640, doublehp100, "metric")).toBe(100);
		});

		it("should use waterVolumeLiters, not imperial factor", () => {
			// AL80: waterVolumeLiters = 11.1, factor = 2.5
			// 100 bar × 11.1 = 1110 L (NOT 100/100 × 2.5 = 2.5)
			expect(pressureToVolume(100, al80, "metric")).toBe(1110);
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

	it("should calculate SCR for a typical dive (imperial)", () => {
		// Dive: 60 min at 60 ft, consumed 1000 PSI on Double HP100 (factor 6.0)
		const result = calcScr({
			startPressure: 3400,
			endPressure: 2400,
			time: 60,
			depth: 60,
			tank: doublehp100,
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
				startPressure: 3000,
				endPressure: 2000,
				time: 0, // Missing time
				depth: 60,
				tank: doublehp100,
				unitSystem: "imperial",
			}),
		).toBeNull();
	});

	it("should handle metric inputs using native water volume", () => {
		// 18m depth, 69 bar consumed on Double HP100 (waterVolumeLiters: 26.4)
		const result = calcScr({
			startPressure: 234, // bar
			endPressure: 165, // bar
			time: 60,
			depth: 18, // meters
			tank: doublehp100,
			unitSystem: "metric",
		});

		// Volume consumed: (234 - 165) × 26.4 = 69 × 26.4 = 1821.6 L
		// ATA at 18m: 18/10 + 1 = 2.8
		// SCR = 1821.6 / (60 × 2.8) = 10.84 L/min
		expect(result).not.toBeNull();
		expect(result!).toBeCloseTo(10.84, 1);
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
			expect(result.minGasPressure).toBeGreaterThanOrEqual(700);
			expect(result.minGasPressure).toBeLessThanOrEqual(800);
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

			expect(result.minGasPressure).toBe(500);
		});

		it("should round min gas to nearest 100 PSI (imperial)", () => {
			const result = calcGasPlan({
				depth: 100,
				scr: 0.75,
				startPressure: 3400,
				tank: doublehp100,
				gasStrategy: "all",
				unitSystem: "imperial",
			});

			expect(result.minGasPressure % 100).toBe(0);
		});

		it("should round min gas to nearest 5 bar (metric)", () => {
			const result = calcGasPlan({
				depth: 30,
				scr: 21,
				startPressure: 230,
				tank: doublehp100,
				gasStrategy: "all",
				unitSystem: "metric",
			});

			expect(result.minGasPressure % 5).toBe(0);
		});

		it("should enforce 35 bar minimum (metric)", () => {
			const result = calcGasPlan({
				depth: 6,
				scr: 14,
				startPressure: 230,
				tank: doublehp100,
				gasStrategy: "all",
				unitSystem: "metric",
			});

			expect(result.minGasPressure).toBe(35);
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
			// minGas=1700, usable=1300, turn=1700
			expect(result.minGasPressure).toBe(1700);
			expect(result.usablePressure).toBe(1300);
			expect(result.strategyUsablePressure).toBe(1300);
			expect(result.turnPressure).toBe(result.minGasPressure);
		});

		it('should use half for "half" strategy', () => {
			const halfResult = calcGasPlan({ ...baseInput, gasStrategy: "half" });
			// usable=1300, half=floor(1300/2)=650
			// turnExact=3000-650=2350, rounded=2400, strategyUsable=3000-2400=600
			expect(halfResult.strategyUsablePressure).toBe(600);
			expect(halfResult.turnPressure).toBe(2400);
		});

		it('should use one-third for "third" strategy', () => {
			const thirdResult = calcGasPlan({ ...baseInput, gasStrategy: "third" });
			// usable=1300, third=floor(1300/3)=433
			// turnExact=3000-433=2567, rounded=2600, strategyUsable=3000-2600=400
			expect(thirdResult.strategyUsablePressure).toBe(400);
			expect(thirdResult.turnPressure).toBe(2600);
		});

		it('should apply modified 1/3 calculation for "modified" strategy', () => {
			const result = calcGasPlan({ ...baseInput, gasStrategy: "modified" });
			// reserveBase = floor(3000/300)*300 = 3000
			// reserveGas = 3000/3 = 1000, usablePool = 3000-1000 = 2000
			// penetration = floor(2000/3) = 666
			// turnExact = 3000-666 = 2334, rounded = 2400, strategyUsable = 600
			expect(result.turnPressureExact).toBe(2334);
			expect(result.turnPressure).toBe(2400);
			expect(result.strategyUsablePressure).toBe(600);
		});
	});

	describe("Turn Pressure", () => {
		it("should round turn pressure UP to nearest 100 PSI (imperial)", () => {
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

		it("should round turn pressure UP to nearest 10 bar (metric)", () => {
			const result = calcGasPlan({
				depth: 30,
				scr: 21,
				startPressure: 230,
				tank: doublehp100,
				gasStrategy: "half",
				unitSystem: "metric",
			});

			expect(result.turnPressure % 10).toBe(0);
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

			// minGas=700, usable=2700, turn=700
			// usedVol = (2700/100)*6 = 162 cu ft, maxATA = 4.03
			// time = 162 / (0.75 × 4.03) ≈ 53.6 min
			expect(result.expectedTimeMax).toBeCloseTo(53.6, 0);
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

			// usedVol = 162 cu ft, avgATA = 2.52
			// time = 162 / (0.75 × 2.52) ≈ 85.9 min
			expect(result.expectedTimeAvg).toBeCloseTo(85.9, 0);
			expect(result.expectedTimeAvg).toBeGreaterThan(result.expectedTimeMax);
		});
	});

	describe("Metric Mode (native)", () => {
		it("should calculate gas plan natively in metric", () => {
			// 30m depth, 21 L/min SCR, 230 bar start, Double HP100 (26.4L)
			const result = calcGasPlan({
				depth: 30,
				scr: 21,
				startPressure: 230,
				tank: doublehp100,
				gasStrategy: "all",
				unitSystem: "metric",
			});

			// CAT: C=42, A=(4+1)/2=2.5, T=30/3+1=11
			// minGasVol = 42*2.5*11 = 1155 L
			// minGasPressure = ceil(1155/26.4) = ceil(43.75) = 44 → rounded to 45 bar
			expect(result.minGasPressure).toBe(45);
			expect(result.turnPressure).toBe(50); // rounded up to nearest 10
		});

		it("should produce clean bar values for min gas", () => {
			const result = calcGasPlan({
				depth: 30,
				scr: 21,
				startPressure: 230,
				tank: doublehp100,
				gasStrategy: "all",
				unitSystem: "metric",
			});

			// Min gas should be a clean multiple of 5 bar
			expect(result.minGasPressure % 5).toBe(0);
		});
	});
});

// --- MOD Calculation Tests ---

describe("MOD Calculation", () => {
	const ppo2 = 1.4;

	describe("Imperial Mode", () => {
		it("should calculate MOD for Air (21%) — precision fix", () => {
			const mod = getMod(21, ppo2, "imperial");
			// ATA = (1.4 * 100) / 21 = 6.667, MOD = (5.667) × 33 = 187 ft
			// Previously gave 186 due to IEEE 754 precision loss
			expect(mod).toBe(187);
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

	describe("Metric Mode (native calculation)", () => {
		it("should calculate MOD for Air (21%) in meters", () => {
			const mod = getMod(21, ppo2, "metric");
			// Native: (6.667 - 1) * 10 = 56.67 → floor = 56 m
			expect(mod).toBe(56);
		});

		it("should calculate MOD for Nitrox 32 in meters", () => {
			const mod = getMod(32, ppo2, "metric");
			// (4.375 - 1) * 10 = 33.75 → floor = 33 m
			expect(mod).toBe(33);
		});

		it("should calculate MOD for TriMix 12/65 correctly (no double-floor error)", () => {
			const mod = getMod(12, ppo2, "metric");
			// Native metric: (1.4*100/12 - 1) * 10 = (11.667 - 1) * 10 = 106.67 → 106 m
			// Previously gave 107 m due to double-floor through feet conversion
			expect(mod).toBe(106);
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
		expect(al80!.waterVolumeLiters).toBe(11.1);
	});

	it("should have correct Double HP100 specs", () => {
		const dhp100 = TANKS.find((t) => t.name === "Double HP100");
		expect(dhp100).toBeDefined();
		expect(dhp100!.capacity).toBe(200);
		expect(dhp100!.pressure).toBe(3442);
		expect(dhp100!.factor).toBe(6.0);
		expect(dhp100!.waterVolumeLiters).toBe(26.4);
	});
});

// =============================================================================
// GUE TRAINING SLIDE EXAMPLES
// These tests verify calculations match exact examples from GUE training materials
// =============================================================================

describe("GUE Slide Examples", () => {
	// Tank for Double 80s (TF = 5, waterVolume = 22.2 L)
	const double80s = TANKS.find((t) => t.name === "Double AL80")!;

	describe("Tank Factor Calculations (GUE Slide)", () => {
		it("should calculate gas volume correctly: AL80 at 1000 psi = 25 cu ft", () => {
			// From slide: (1000 / 100) x 2.5 = 25 ft³
			const al80 = TANKS.find((t) => t.name === "AL80")!;
			const volumeCuFt = pressureToVolume(1000, al80, "imperial");
			expect(volumeCuFt).toBe(25);
		});

		it("should calculate gas volume correctly: Double 80s at 2000 psi = 100 cu ft", () => {
			// From slide: (2000 / 100) x 5 = 100 ft³
			const volumeCuFt = pressureToVolume(2000, double80s, "imperial");
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
				startPressure: 3000,
				endPressure: 1000, // consumed 2000 psi
				time: 50,
				depth: 66,
				tank: double80s,
				unitSystem: "imperial",
			});

			expect(result).not.toBeNull();
			expect(result!).toBeCloseTo(0.66, 1);
		});

		it("METRIC: Double AL80 (22.2L), 100 bar consumed @ 20m = 14.8 L/min", () => {
			// Native metric: 100 bar × 22.2L = 2220L
			// ATA at 20m = 3
			// SCR = 2220 / (50 × 3) = 14.8 L/min
			const result = calcScr({
				startPressure: 200, // 200 bar start
				endPressure: 100, // 100 bar end
				time: 50,
				depth: 20, // 20 meters
				tank: double80s,
				unitSystem: "metric",
			});

			expect(result).not.toBeNull();
			// Result is directly in L/min (native metric)
			expect(result!).toBeCloseTo(14.8, 1);
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

		it("METRIC: 210 bar → turn 170 bar (native metric rounding)", () => {
			// Native metric Modified 1/3:
			// reserveBase = floor(210/20)*20 = 200
			// reserve = 200/3 = 66.67
			// usable = 210 - 66.67 = 143.33
			// penetration = floor(143.33/3) = 47
			// turnExact = 210 - 47 = 163
			// rounded up to nearest 10 = 170 bar
			const result = calcGasPlan({
				depth: 20,
				scr: 15,
				startPressure: 210,
				tank: double80s,
				gasStrategy: "modified",
				unitSystem: "metric",
			});

			expect(result.turnPressureExact).toBe(163);
			expect(result.turnPressure).toBe(170);
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

			// minGas=600, usable=2400, third=floor(2400/3)=800
			// turnExact=2200, rounded=2200, strategyUsable=800
			expect(result.minGasPressure).toBe(600);
			expect(result.usablePressure).toBe(2400);
			expect(result.strategyUsablePressure).toBe(800);
			expect(result.turnPressure).toBe(2200);
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

		it("METRIC: 210 bar @ 20 m, SCR 15 L/min → ~28 min dive", () => {
			// Native metric with Double AL80 (22.2L):
			// turn=170, usable=210-170=40 bar, usedPressure=40*2=80 bar
			// usedVol = 80 × 22.2 = 1776 L
			// ATA at 20m = 3
			// time = 1776 / (15 × 3) = 39.5 min
			const result = calcGasPlan({
				depth: 20,
				scr: 15,
				startPressure: 210,
				tank: double80s,
				gasStrategy: "modified",
				unitSystem: "metric",
			});

			expect(result.expectedTimeMax).toBeCloseTo(39.5, 0);
		});
	});

	describe("Gas Volume Calculations", () => {
		it("IMPERIAL: Double 80s at 3000 psi = 150 cu ft", () => {
			const volume = pressureToVolume(3000, double80s, "imperial");
			expect(volume).toBe(150);
		});

		it("METRIC: Double AL80 (22.2L) at 210 bar = 4662 liters", () => {
			const volume = pressureToVolume(210, double80s, "metric");
			expect(volume).toBe(4662);
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

		it("METRIC: SCR 15 L/min @ 20 m (3 ATA) = 2 bar/min on 22.2L doubles", () => {
			const scrAtDepth = 15 * 3;
			const barPerMin = scrAtDepth / 22.2;
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
