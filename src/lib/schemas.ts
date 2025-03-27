import { z } from "zod";
import { INVESTMENT_TYPES, MODALITIES, INDEXERS } from "./constants";

export const investmentSchema = z.object({
	id: z.string(),
	description: z.string().optional(),
	typeOfInvestment: z.enum([INVESTMENT_TYPES.CDB, INVESTMENT_TYPES.LCI_LCA]),
	modality: z.enum([MODALITIES.PRE, MODALITIES.POS]),
	indexer: z.enum([INDEXERS.CDI, INDEXERS.IPCA]),
	rate: z
		.string()
		.min(1, "Taxa é obrigatória")
		.refine(
			(val) => !Number.isNaN(Number(val)) && Number(val) >= 0,
			"Taxa deve ser maior ou igual a zero",
		),
});

export const simulationFormSchema = z
	.object({
		initialInvestment: z.string(),
		monthlyInvestment: z.string(),
		months: z.coerce.number().gt(0, "Período deve ser maior que zero"),
		investments: z
			.array(investmentSchema)
			.min(1, "Adicione pelo menos um investimento"),
	})
	.refine(
		(form) =>
			Number(form.initialInvestment) > 0 || Number(form.monthlyInvestment) > 0,
		{
			path: ["initialInvestment"],
			message:
				"Investimento inicial ou o aporte mensal deve ser maior que zero",
		},
	)
	.refine(
		(form) =>
			Number(form.initialInvestment) > 0 || Number(form.monthlyInvestment) > 0,
		{
			path: ["monthlyInvestment"],
			message: "Aporte mensal ou investimento inicial deve ser maior que zero",
		},
	);
