import { z } from 'zod'
import { INDEXERS, INVESTMENT_TYPES, MODALITIES } from './constants'

export const investmentSchema = z.object({
	id: z.string(),
	description: z.string().optional(),
	typeOfInvestment: z.enum([INVESTMENT_TYPES.CDB, INVESTMENT_TYPES.LCI_LCA]),
	modality: z.enum([MODALITIES.PRE, MODALITIES.POS]),
	indexer: z.enum([INDEXERS.CDI, INDEXERS.IPCA]),
	rate: z
		.string()
		.min(1, 'Taxa é obrigatória')
		.transform(value => value.replace(',', '.'))
		.refine(
			val => !Number.isNaN(Number(val)) && Number(val) >= 0,
			'Taxa deve ser maior ou igual a zero',
		),
})

export const simulationFormSchema = z
	.object({
		initialInvestment: z
			.string()
			.transform(value => value.replace(',', '.')),
		monthlyInvestment: z
			.string()
			.transform(value => value.replace(',', '.')),
		months: z.string(),
		investments: z
			.array(investmentSchema)
			.min(1, 'Adicione pelo menos um investimento'),
	})
	.refine(
		form =>
			Number(form.initialInvestment) > 0 ||
			Number(form.monthlyInvestment) > 0,
		{
			path: ['initialInvestment'],
			message:
				'Investimento inicial ou o aporte mensal deve ser maior que zero',
		},
	)
	.refine(
		form =>
			Number(form.initialInvestment) > 0 ||
			Number(form.monthlyInvestment) > 0,
		{
			path: ['monthlyInvestment'],
			message:
				'Aporte mensal ou investimento inicial deve ser maior que zero',
		},
	)
	.refine(form => Number(form.months) > 0, {
		path: ['months'],
		message: 'Período deve ser maior que zero',
	})
