import type { z } from "zod";

import type { INVESTMENT_TYPES, MODALITIES, INDEXERS } from "./constants";
import type { investmentSchema, simulationFormSchema } from "./schemas";

export type InvestmentType =
	(typeof INVESTMENT_TYPES)[keyof typeof INVESTMENT_TYPES];
export type Modality = (typeof MODALITIES)[keyof typeof MODALITIES];
export type Indexer = (typeof INDEXERS)[keyof typeof INDEXERS];

export interface InvestmentYield {
	description: string;
	totalGrossAmount: number;
	totalNetIncome: number;
	totalNetAmount: number;
}

export type SimulationResult = InvestmentYield[];

export interface IndexerData {
	indexer: Indexer;
	rate: number;
	source: string;
	date?: string;
	description?: string;
	error?: string;
}

export type SimulationFormData = z.infer<typeof simulationFormSchema>;

export type Investment = z.infer<typeof investmentSchema>;
