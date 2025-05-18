import { type RefObject, useState } from 'react'

import { INDEXERS, INVESTMENT_TYPES, MODALITIES } from '@/lib/constants'
import * as financial from '@/lib/financial'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import type {
	IndexerData,
	Investment,
	InvestmentYield,
	SimulationFormData,
	SimulationResult,
} from '@/lib/types'

export function useSimulation() {
	const [result, setResult] = useState<SimulationResult | null>(null)

	const simulate = (
		formData: SimulationFormData,
		indexersData: IndexerData[],
		scrollTo: RefObject<HTMLTableElement | null>,
	) => {
		const initialInvestment =
			Number.parseFloat(formData.initialInvestment) || 0
		const monthlyInvestment =
			Number.parseFloat(formData.monthlyInvestment) || 0
		const months = Number(formData.months)

		const result = formData.investments.map(investment => {
			const investmentIndexer = indexersData.find(
				data => data.indexer === investment.indexer,
			)
			const investmentRate = Number.parseFloat(investment.rate) / 100
			const monthlyRate = calculateMonthlyRate(
				investment,
				investmentRate,
				investmentIndexer,
			)
			const totalGrossAmount = financial.calculateFutureValue(
				monthlyRate,
				months,
				initialInvestment,
				monthlyInvestment,
			)
			const totalNetAmount =
				investment.typeOfInvestment === INVESTMENT_TYPES.CDB
					? financial.calculateFutureValueWithTaxDiscounts(
							totalGrossAmount,
							months,
							initialInvestment,
							monthlyInvestment,
						)
					: totalGrossAmount
			const totalNetIncome =
				totalNetAmount -
				(initialInvestment + monthlyInvestment * months)

			return {
				description: buildInvestmentTitle(investment),
				totalGrossAmount,
				totalNetAmount,
				totalNetIncome,
			} as InvestmentYield
		})

		const sortedResult = result.sort(
			(a, b) => b.totalNetIncome - a.totalNetIncome,
		)

		const description =
			initialInvestment <= 0
				? `Aportes mensais de ${formatCurrency(monthlyInvestment)} por um período de ${formData.months} meses.`
				: monthlyInvestment <= 0
					? `Investimento inicial de ${formatCurrency(initialInvestment)} por um período de ${formData.months} meses.`
					: `Investimento inicial de ${formatCurrency(initialInvestment)} e aportes mensais de ${formatCurrency(monthlyInvestment)} por um período de ${formData.months} meses.`

		setResult({
			description,
			investmentsYields: sortedResult,
		})

		if (scrollTo.current) {
			scrollTo.current.scrollIntoView({
				behavior: 'smooth',
			})
		}
	}

	return { result, simulate }
}

function buildInvestmentTitle(investment: Investment) {
	const modalityObj = {
		pos: 'Pós-Fixado',
		pre: 'Prefixado',
	}

	if (investment.modality === 'pos') {
		if (investment.indexer === 'ipca') {
			return `${investment.typeOfInvestment} ${modalityObj[investment.modality]} IPCA+ ${formatPercent(Number.parseFloat(investment.rate))}`.toUpperCase()
		}

		return `${investment.typeOfInvestment} ${modalityObj[investment.modality]} ${formatPercent(Number.parseFloat(investment.rate))} CDI`.toUpperCase()
	}

	return `${investment.typeOfInvestment} ${modalityObj[investment.modality]} ${formatPercent(Number.parseFloat(investment.rate))}`.toUpperCase()
}

function calculateMonthlyRate(
	investment: Investment,
	investmentRate: number,
	indexData?: IndexerData,
): number {
	if (investment.modality === MODALITIES.PRE) {
		return (1 + investmentRate) ** (1 / 12) - 1
	}

	if (!indexData) return 0

	return investment.indexer === INDEXERS.CDI
		? (1 + indexData.rate * investmentRate) ** (1 / 12) - 1
		: (1 + indexData.rate + investmentRate) ** (1 / 12) - 1
}
