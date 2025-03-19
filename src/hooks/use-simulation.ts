import { useState } from "react";

import {
	MODALITIES,
	INDEXERS,
	INVESTMENT_TYPES_WITH_TAX_DISCOUNT,
} from "@/lib/constants";
import * as financial from "@/lib/financial";
import type {
	SimulationResult,
	SimulationFormData,
	IndexData,
} from "@/lib/types";
import { formatPercent } from "@/lib/formatters";

export function useSimulation() {
	const [result, setResult] = useState<SimulationResult | null>(null);

	const simulate = (
		formData: SimulationFormData,
		indexData: IndexData | null,
	) => {
		const investment = Number.parseFloat(formData.initialInvestment) || 0;
		const monthlyInvestment =
			Number.parseFloat(formData.monthlyInvestment) || 0;
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

		const totalGrossAmount =
			financial.calculateFutureValueWithRecurringInvestments(
				monthlyRate * 100,
				period,
				investment,
				monthlyInvestment,
			);
		const totalNetAmount = INVESTMENT_TYPES_WITH_TAX_DISCOUNT.includes(
			formData.typeOfInvestment,
		)
			? financial.calculateFutureValueWithRecurringInvestmentsAndTaxDiscounts(
					totalGrossAmount,
					period,
					investment,
					monthlyInvestment,
				)
			: totalGrossAmount;

		const totalNetIncome =
			totalNetAmount - (investment + monthlyInvestment * period);

		setResult({
			description: buildInvestmentTitle(formData),
			totalGrossIncome: totalGrossAmount - investment,
			totalGrossAmount,
			incomeTaxDiscount: totalGrossAmount - totalNetAmount,
			totalNetAmount,
			totalNetIncome,
		});
	};

	return { result, simulate };
}

function buildInvestmentTitle(formData: SimulationFormData) {
	const modalityObj = {
		pos: "Pós-Fixado",
		pre: "Prefixado",
	};

	if (formData.modality === "pos") {
		if (formData.indexer === "ipca") {
			return `${formData.typeOfInvestment} ${modalityObj[formData.modality]} IPCA+ ${formatPercent(Number.parseFloat(formData.rate))}`.toUpperCase();
		}

		return `${formData.typeOfInvestment} ${modalityObj[formData.modality]} ${formatPercent(Number.parseFloat(formData.rate))} CDI`.toUpperCase();
	}

	return `${formData.typeOfInvestment} ${modalityObj[formData.modality]} ${formatPercent(Number.parseFloat(formData.rate))}`.toUpperCase();
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
