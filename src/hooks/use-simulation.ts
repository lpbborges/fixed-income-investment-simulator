import { useState } from "react";
import type {
	SimulationResult,
	SimulationFormData,
	IndexData,
} from "@/lib/types";
import { MODALITIES, INDEXERS, TAX_BRACKETS } from "@/lib/constants";

export function useSimulation() {
	const [result, setResult] = useState<SimulationResult | null>(null);

	const calculateSimulation = (
		formData: SimulationFormData,
		indexData: IndexData | null,
	) => {
		const investment = Number.parseFloat(formData.initialInvestment) || 0;
		const period = Number.parseInt(formData.months) || 0;
		const investmentRate =
			Number.parseFloat(formData.rate.replace(",", ".")) / 100;

		if (investment <= 0 || period <= 0) {
			return;
		}

		const monthlyRate = calculateMonthlyRate(
			formData,
			indexData,
			investmentRate,
		);
		const {
			monthsArray,
			balanceArray,
			interestArray,
			totalInterest,
			currentBalance,
		} = calculateMonthlyValues(investment, period, monthlyRate);

		const { totalNetAmount, incomeTaxDiscount, totalNetIncome } =
			calculateTaxes(
				formData.typeOfInvestment,
				period,
				totalInterest,
				investment,
			);

		setResult({
			months: monthsArray,
			balance: balanceArray,
			interest: interestArray,
			totalGrossIncome: totalInterest,
			totalGrossAmount: currentBalance,
			incomeTaxDiscount,
			totalNetAmount,
			totalNetIncome,
		});
	};

	return { result, calculateSimulation };
}

function calculateMonthlyRate(
	formData: SimulationFormData,
	indexData: IndexData | null,
	investmentRate: number,
): number {
	if (formData.modality === MODALITIES.PRE) {
		return (1 + investmentRate) ** (1 / 12) - 1;
	}

	if (!indexData) return 0;

	return formData.indexer === INDEXERS.CDI
		? (1 + indexData.rate * investmentRate) ** (1 / 12) - 1
		: (1 + indexData.rate + investmentRate) ** (1 / 12) - 1;
}

function calculateMonthlyValues(
	investment: number,
	period: number,
	monthlyRate: number,
) {
	const monthsArray: number[] = [];
	const balanceArray: number[] = [];
	const interestArray: number[] = [];

	let currentBalance = investment;
	let totalInterest = 0;

	for (let i = 0; i < period; i++) {
		const monthlyInterest = currentBalance * monthlyRate;
		totalInterest += monthlyInterest;
		currentBalance += monthlyInterest;

		monthsArray.push(i);
		balanceArray.push(currentBalance);
		interestArray.push(monthlyInterest);
	}

	return {
		monthsArray,
		balanceArray,
		interestArray,
		totalInterest,
		currentBalance,
	};
}

function calculateTaxes(
	typeOfInvestment: string,
	period: number,
	totalInterest: number,
	investment: number,
) {
	if (typeOfInvestment !== "cdb") {
		return {
			totalNetAmount: investment + totalInterest,
			incomeTaxDiscount: 0,
			totalNetIncome: totalInterest,
		};
	}

	const taxBracket =
		TAX_BRACKETS.find((bracket) => period <= bracket.months) ||
		TAX_BRACKETS[TAX_BRACKETS.length - 1];
	const incomeTaxDiscount = totalInterest * taxBracket.rate;
	const totalNetIncome = totalInterest - incomeTaxDiscount;
	const totalNetAmount = investment + totalNetIncome;

	return { totalNetAmount, incomeTaxDiscount, totalNetIncome };
}
