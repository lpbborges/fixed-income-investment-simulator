export const INVESTMENT_TYPES = {
	CDB: 'cdb',
	LCI_LCA: 'lci/lca',
} as const

export const INVESTMENT_TYPES_WITH_TAX_DISCOUNT = [
	INVESTMENT_TYPES.CDB,
] as string[]

export const MODALITIES = {
	PRE: 'pre',
	POS: 'pos',
} as const

export const INDEXERS = {
	CDI: 'cdi',
	IPCA: 'ipca',
} as const

export const TAX_RATES = {
	lessThan6Months: 0.225,
	lessThan12Months: 0.2,
	lessThan24Months: 0.175,
	atLeast24Months: 0.15,
} as const
