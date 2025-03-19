import { z } from "zod";
import { INVESTMENT_TYPES, MODALITIES, INDEXERS } from "./constants";

export const simulationFormSchema = z.object({
	initialInvestment: z
		.string()
		.refine((val) => Number(val) > 0, "Valor inicial deve ser maior que zero"),
	monthlyInvestment: z
		.string()
		.refine((val) => Number(val) > 0, "Aporte mensal deve ser maior que zero"),
	months: z
		.string()
		.min(1, "Período é obrigatório")
		.refine(
			(val) => !Number.isNaN(Number(val)) && Number(val) > 0,
			"Período deve ser maior que zero",
		),
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
