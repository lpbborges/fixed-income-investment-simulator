"use client";

import { useForm } from "react-hook-form";
import { SimulationForm } from "./simulation-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import type { SimulationFormData } from "@/lib/types";
import { simulationFormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { INDEXERS, INVESTMENT_TYPES, MODALITIES } from "@/lib/constants";
import { useIndexData } from "@/hooks/use-index-data";
import { useSimulation } from "@/hooks/use-simulation";
import { SimulationResults } from "./simulation-results";

const defaultValues: SimulationFormData = {
	initialInvestment: "",
	months: "",
	typeOfInvestment: INVESTMENT_TYPES.WITH_TAX_DISCOUNT,
	modality: MODALITIES.POS,
	indexer: INDEXERS.CDI,
	rate: "",
};

export function FixedIncomeSimulator() {
	const form = useForm<SimulationFormData>({
		resolver: zodResolver(simulationFormSchema),
		defaultValues,
	});

	const { calculateSimulation, result } = useSimulation();
	const { error, indexData, isLoading } = useIndexData(form.watch("indexer"));

	const onSubmit = (data: SimulationFormData) => {
		calculateSimulation(data, indexData);
	};

	return (
		<div className="space-y-8">
			<Card>
				<CardHeader>
					<CardTitle>Simulador de Investimentos</CardTitle>
					<CardDescription>
						Calcule o rendimento do seu investimento em renda fixa ao longo do
						tempo
					</CardDescription>
				</CardHeader>
				<CardContent>
					<SimulationForm
						form={form}
						onSubmit={onSubmit}
						indexData={indexData}
						error={error}
						isLoading={isLoading}
					/>
				</CardContent>
			</Card>
			{result && (
				<SimulationResults
					result={result}
					initialInvestment={form.getValues("initialInvestment")}
					months={form.getValues("months")}
				/>
			)}
		</div>
	);
}
