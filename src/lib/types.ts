import type { INVESTMENT_TYPES, MODALITIES, INDEXERS } from "./constants";

export type InvestmentType =
	(typeof INVESTMENT_TYPES)[keyof typeof INVESTMENT_TYPES];
export type Modality = (typeof MODALITIES)[keyof typeof MODALITIES];
export type Indexer = (typeof INDEXERS)[keyof typeof INDEXERS];

export interface SimulationResult {
	months: number[];
	balance: number[];
	interest: number[];
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

export interface SimulationFormData {
	initialInvestment: string;
	months: string;
	typeOfInvestment: InvestmentType;
	modality: Modality;
	indexer: Indexer;
	rate: string;
}
