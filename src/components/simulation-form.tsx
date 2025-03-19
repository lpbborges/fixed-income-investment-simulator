"use client";

import { Loader2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { SimulationFormData, IndexData } from "@/lib/types";
import { INVESTMENT_TYPES, MODALITIES, INDEXERS } from "@/lib/constants";
import { formatDate } from "@/lib/formatters";
import { Button } from "./ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface SimulationFormProps {
	form: UseFormReturn<SimulationFormData>;
	onSubmit: (data: SimulationFormData) => void;
	indexData: IndexData | null;
	isLoading: boolean;
	error: string | null;
}

export function SimulationForm({
	form,
	onSubmit,
	indexData,
	isLoading,
	error,
}: SimulationFormProps) {
	const modality = form.watch("modality");
	const indexer = form.watch("indexer");

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{modality !== MODALITIES.PRE && (
					<div className="flex items-center space-x-2">
						{isLoading ? (
							<div className="flex items-center text-sm text-muted-foreground">
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Obtendo taxa {indexer.toUpperCase()} atual...
							</div>
						) : (
							<div className="space-y-1">
								{indexData && (
									<>
										<p className="text-sm font-medium">
											{indexer.toUpperCase()} atual:{" "}
											{(indexData.rate * 100).toFixed(2)}% ao ano
										</p>
										<p className="text-xs text-muted-foreground">
											Fonte: {indexData.source}
											{indexData.date &&
												` • Atualizado em: ${formatDate(indexData.date)}`}
											{indexData.description && ` • ${indexData.description}`}
										</p>
									</>
								)}
								{error && <p className="text-xs text-destructive">{error}</p>}
							</div>
						)}
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<FormField
						control={form.control}
						name="typeOfInvestment"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tipo de Investimento</FormLabel>
								<FormControl>
									<RadioGroup
										onValueChange={field.onChange}
										defaultValue={field.value}
										className="flex flex-col space-y-1"
									>
										<div className="flex items-center space-x-2">
											<RadioGroupItem
												value={INVESTMENT_TYPES.CDB}
												id="cdb-ri"
											/>
											<FormLabel htmlFor="cdb-ri">CDB</FormLabel>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem
												value={INVESTMENT_TYPES.LCI_LCA}
												id="lci_lca-ri"
											/>
											<FormLabel htmlFor="lci_lca-ri">LCI/LCA</FormLabel>
										</div>
									</RadioGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="modality"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Modalidade</FormLabel>
								<FormControl>
									<RadioGroup
										onValueChange={field.onChange}
										defaultValue={field.value}
										className="flex flex-col space-y-1"
									>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value={MODALITIES.POS} id="pos" />
											<FormLabel htmlFor="pos">Pós-fixado</FormLabel>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value={MODALITIES.PRE} id="pre" />
											<FormLabel htmlFor="pre">Prefixado</FormLabel>
										</div>
									</RadioGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="indexer"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Indexador</FormLabel>
								<FormControl>
									<RadioGroup
										onValueChange={field.onChange}
										defaultValue={field.value}
										disabled={modality === MODALITIES.PRE}
										className="flex flex-col space-y-1"
									>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value={INDEXERS.CDI} id="indexer-cdi" />
											<FormLabel htmlFor="indexer-cdi">CDI</FormLabel>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value={INDEXERS.IPCA} id="indexer-ipca" />
											<FormLabel htmlFor="indexer-ipca">IPCA+</FormLabel>
										</div>
									</RadioGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="initialInvestment"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Investimento Inicial (R$)</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder="1000"
										aria-label="Investimento Inicial em Reais"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="months"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Período (meses)</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder="12"
										aria-label="Período em meses"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="rate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Rentabilidade (%)</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder="100"
										aria-label="Taxa de rentabilidade em porcentagem"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="w-full flex justify-center">
					<Button type="submit" disabled={isLoading}>
						{isLoading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							"Simular"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
