"use client";

import { type ChangeEvent, useState } from "react";

import { FixedIncomeSimulator } from "@/components/fixed-income-simulator";

type FormValuesType = {
	start_investment: number;
	months: number;
};

export default function Home() {
	const [formValues, setFormValues] = useState<FormValuesType>(
		{} as FormValuesType,
	);

	function handleChangeInputs(event: ChangeEvent<HTMLInputElement>) {
		const inputName = event.target.name;
		const value = event.target.value;

		setFormValues((currentForm) => ({
			...currentForm,
			[inputName]: value,
		}));
	}

	function handleSubmit() {}

	return (
		<div className="min-h-screen bg-background p-4 md:p-8">
			<main className="flex flex-col">
				<div className="container mx-auto max-w-5xl">
					<h1 className="text-3xl font-bold text-center mb-8">
						Simulador de Renda Fixa
					</h1>
					<FixedIncomeSimulator />
				</div>
			</main>
		</div>
	);
}
