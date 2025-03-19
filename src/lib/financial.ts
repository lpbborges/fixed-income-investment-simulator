function calculateFutureValue(
    rateInPercentage: number,
    period: number,
    amount: number,
) {
    const rate = rateInPercentage / 100;
    return amount * (1 + rate) ** period;
}

function calculateFutureValueWithRecurringInvestments(
    rateInPercentage: number,
    period: number,
    initialInvestment = 0,
    recurringInvestment = 0,
) {
    const rate = rateInPercentage / 100;

    return (
        calculateFutureValue(rateInPercentage, period, initialInvestment) +
        (recurringInvestment * ((1 + rate) ** period - 1)) / rate
    );
}

const TAX_RATES = {
    lessThan6Months: 0.225,
    lessThan12Months: 0.2,
    lessThan24Months: 0.175,
    atLeast24Months: 0.15
} as const;

function getTaxRateByPeriod(period: number): number {
    if (period < 6) return TAX_RATES.lessThan6Months;
    if (period < 12) return TAX_RATES.lessThan12Months;
    if (period < 24) return TAX_RATES.lessThan24Months;

    return TAX_RATES.atLeast24Months;
}

function calculateFutureValueWithRecurringInvestmentsAndTaxDiscounts(
    grossAmount: number,
    period: number,
    initialAmount = 0,
    recurringAmount = 0,
) {
    const taxRate = getTaxRateByPeriod(period)
    const totalInvested = initialAmount + recurringAmount * period;

    return (grossAmount - totalInvested) * (1 - taxRate) + totalInvested;
}

export {
    calculateFutureValue,
    calculateFutureValueWithRecurringInvestments,
    calculateFutureValueWithRecurringInvestmentsAndTaxDiscounts,
};
