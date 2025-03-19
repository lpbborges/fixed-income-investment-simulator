import type { z } from "zod";
import type { INVESTMENT_TYPES, MODALITIES, INDEXERS } from "./constants";
import type { simulationFormSchema } from "./schemas";

export type InvestmentType =
	(typeof INVESTMENT_TYPES)[keyof typeof INVESTMENT_TYPES];
export type Modality = (typeof MODALITIES)[keyof typeof MODALITIES];
export type Indexer = (typeof INDEXERS)[keyof typeof INDEXERS];

export interface SimulationResult {
	description: string;
	totalGrossIncome: number;
	totalGrossAmount: number;
	totalNetIncome: number;
	totalNetAmount: number;
	incomeTaxDiscount: number;
}

export interface IndexData {
	rate: number;
	source: string;
	date?: string;
	description?: string;
	error?: string;
}

export type SimulationFormData = z.infer<typeof simulationFormSchema>;
