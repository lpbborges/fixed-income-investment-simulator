import { RefObject, useState } from "react";

import { MODALITIES, INDEXERS, INVESTMENT_TYPES } from "@/lib/constants";
import * as financial from "@/lib/financial";
import type {
	SimulationResult,
	SimulationFormData,
	IndexerData,
	Investment,
	InvestmentYield,
} from "@/lib/types";
import { formatPercent } from "@/lib/formatters";

export function useSimulation() {
	const [result, setResult] = useState<SimulationResult | null>(null);

	const simulate = (
		formData: SimulationFormData,
		indexersData: IndexerData[],
		scrollTo: RefObject<HTMLTableElement | null>,
	) => {
		const initialInvestment =
			Number.parseFloat(formData.initialInvestment) || 0;
		const monthlyInvestment =
			Number.parseFloat(formData.monthlyInvestment) || 0;

		const result = formData.investments.map((investment) => {
			const investmentIndexer = indexersData.find(
				(data) => data.indexer === investment.indexer,
			);
			const investmentRate = Number.parseFloat(investment.rate) / 100;
			const monthlyRate = calculateMonthlyRate(
				investment,
				investmentRate,
				investmentIndexer,
			);
			const totalGrossAmount = financial.calculateFutureValue(
				monthlyRate,
				formData.months,
				initialInvestment,
				monthlyInvestment,
			);
			const totalNetAmount =
				investment.typeOfInvestment === INVESTMENT_TYPES.CDB
					? financial.calculateFutureValueWithTaxDiscounts(
							totalGrossAmount,
							formData.months,
							initialInvestment,
							monthlyInvestment,
						)
					: totalGrossAmount;
			const totalNetIncome =
				totalNetAmount -
				(initialInvestment + monthlyInvestment * formData.months);

			return {
				description: buildInvestmentTitle(investment),
				totalGrossAmount,
				totalNetAmount,
				totalNetIncome,
			} as InvestmentYield;
		});

		const sortedResult = result.sort(
			(a, b) => b.totalNetIncome - a.totalNetIncome,
		);

		setResult({
			description: `Investimento inicial de R$ ${initialInvestment}, com aportes mensais de R$ ${monthlyInvestment} por um período de ${formData.months} meses.`,
			investmentsYields: sortedResult,
		});

		if (scrollTo.current) {
			scrollTo.current.scrollIntoView();
		}
	};

	return { result, simulate };
}

function buildInvestmentTitle(investment: Investment) {
	const modalityObj = {
		pos: "Pós-Fixado",
		pre: "Prefixado",
	};

	if (investment.modality === "pos") {
		if (investment.indexer === "ipca") {
			return `${investment.typeOfInvestment} ${modalityObj[investment.modality]} IPCA+ ${formatPercent(Number.parseFloat(investment.rate))}`.toUpperCase();
		}

		return `${investment.typeOfInvestment} ${modalityObj[investment.modality]} ${formatPercent(Number.parseFloat(investment.rate))} CDI`.toUpperCase();
	}

	return `${investment.typeOfInvestment} ${modalityObj[investment.modality]} ${formatPercent(Number.parseFloat(investment.rate))}`.toUpperCase();
}

function calculateMonthlyRate(
	investment: Investment,
	investmentRate: number,
	indexData?: IndexerData,
): number {
	if (investment.modality === MODALITIES.PRE) {
		return (1 + investmentRate) ** (1 / 12) - 1;
	}

	if (!indexData) return 0;

	return investment.indexer === INDEXERS.CDI
		? (1 + indexData.rate * investmentRate) ** (1 / 12) - 1
		: (1 + indexData.rate + investmentRate) ** (1 / 12) - 1;
}
