export const INVESTMENT_TYPES = {
	WITH_TAX_DISCOUNT: "with_tax_discount",
	WITHOUT_TAX_DISCOUNT: "without_tax_discount",
} as const;

export const MODALITIES = {
	PRE: "pre",
	POS: "pos",
} as const;

export const INDEXERS = {
	CDI: "cdi",
	IPCA: "ipca",
} as const;

export const TAX_BRACKETS = [
	{ months: 6, rate: 0.225 },
	{ months: 12, rate: 0.2 },
	{ months: 24, rate: 0.175 },
	{ months: Number.POSITIVE_INFINITY, rate: 0.15 },
] as const;
