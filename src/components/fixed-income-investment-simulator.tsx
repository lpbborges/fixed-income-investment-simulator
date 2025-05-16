'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { DollarSign } from 'lucide-react'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'

import { useIndexersData } from '@/hooks/use-indexers-data'
import { useSimulation } from '@/hooks/use-simulation'
import { simulationFormSchema } from '@/lib/schemas'
import type { SimulationFormData } from '@/lib/types'
import { SimulationForm } from './simulation-form'
import { SimulationResults } from './simulation-results'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card'

const defaultValues: SimulationFormData = {
	initialInvestment: '',
	months: '',
	monthlyInvestment: '',
	investments: [],
}

export function FixedIncomeInvestmentSimulator() {
	const resultsRef = useRef<HTMLTableElement>(null)
	const { error, indexersData, isLoading } = useIndexersData()

	const form = useForm<SimulationFormData>({
		resolver: zodResolver(simulationFormSchema),
		defaultValues,
	})

	const { simulate, result } = useSimulation()

	const onSubmit = (data: SimulationFormData) => {
		simulate(data, indexersData, resultsRef)
	}

	return (
		<div className="space-y-8">
			<Card className="py-0">
				<CardHeader className="bg-primary/5 p-6 border-b border-primary/10">
					<CardTitle className="text-primary flex items-center gap-2 text-2xl">
						<DollarSign />
						Simulador de Investimentos
					</CardTitle>
					<CardDescription>
						Calcule o rendimento do seu investimento de{' '}
						<b>renda fixa</b> ao longo do tempo
					</CardDescription>
				</CardHeader>
				<CardContent>
					<SimulationForm
						isFetchingIndexers={isLoading}
						fetchIndexersError={error}
						indexersData={indexersData}
						form={form}
						onSubmit={onSubmit}
					/>
				</CardContent>
			</Card>
			{result && result?.investmentsYields?.length > 0 && (
				<SimulationResults ref={resultsRef} result={result} />
			)}
		</div>
	)
}
