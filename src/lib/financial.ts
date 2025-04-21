import { TAX_RATES } from './constants'

function calculateFutureValue(
	rate: number,
	period: number,
	initialInvestment = 0,
	recurringInvestment = 0,
) {
	return (
		initialInvestment * (1 + rate) ** period +
		(recurringInvestment * ((1 + rate) ** period - 1)) / rate
	)
}

function getTaxRateByPeriod(period: number): number {
	if (period < 6) return TAX_RATES.lessThan6Months
	if (period < 12) return TAX_RATES.lessThan12Months
	if (period < 24) return TAX_RATES.lessThan24Months

	return TAX_RATES.atLeast24Months
}

function calculateFutureValueWithTaxDiscounts(
	grossAmount: number,
	period: number,
	initialAmount = 0,
	recurringAmount = 0,
) {
	const taxRate = getTaxRateByPeriod(period)
	const totalInvested = initialAmount + recurringAmount * period

	return (grossAmount - totalInvested) * (1 - taxRate) + totalInvested
}

export { calculateFutureValue, calculateFutureValueWithTaxDiscounts }
