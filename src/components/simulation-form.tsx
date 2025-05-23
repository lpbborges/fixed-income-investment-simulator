'use client'

import { ChartLine, Loader2, PlusCircle, RefreshCw } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import { INDEXERS, INVESTMENT_TYPES, MODALITIES } from '@/lib/constants'
import { formatDate } from '@/lib/formatters'
import type { IndexerData, Investment, SimulationFormData } from '@/lib/types'
import { InvestmentItem } from './investment-item'
import { Button } from './ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { DecimalInput } from './decimal-input'

interface SimulationFormProps {
	form: UseFormReturn<SimulationFormData>
	onSubmit: (data: SimulationFormData) => void
	fetchIndexersError: string | null
	indexersData: IndexerData[]
	isFetchingIndexers: boolean
}

export function SimulationForm({
	form,
	onSubmit,
	fetchIndexersError,
	indexersData,
	isFetchingIndexers,
}: SimulationFormProps) {
	const investments = form.watch('investments')

	const addInvestment = useCallback(() => {
		const newInvestment: Investment = {
			id: `investment-${Date.now()}`,
			typeOfInvestment: INVESTMENT_TYPES.CDB,
			modality: MODALITIES.POS,
			indexer: INDEXERS.CDI,
			rate: '100',
		}

		form.setValue('investments', [...investments, newInvestment], {
			shouldValidate: true,
		})
	}, [form, investments])

	const isInvestmentsInvalid = useMemo(
		() =>
			form.getFieldState('investments').invalid &&
			form.formState.isSubmitted,
		[form.getFieldState, form.formState.isSubmitted],
	)

	const deleteInvestment = (id: string) => {
		const filteredInvestments = investments.filter(inv => inv.id !== id)
		form.setValue('investments', filteredInvestments)
	}

	const updateInvestment = (updatedInvestment: Investment) => {
		const updatedInvestments = investments.map(inv =>
			inv.id === updatedInvestment.id ? updatedInvestment : inv,
		)
		form.setValue('investments', updatedInvestments)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<FormField
						control={form.control}
						name="initialInvestment"
						render={({ field }) => (
							<FormItem>
								<div className="space-y-2">
									<FormLabel>
										Investimento Inicial (R$)
									</FormLabel>
									<FormControl>
										<DecimalInput
											placeholder="1000,00"
											aria-label="Investimento Inicial em Reais"
											{...field}
										/>
									</FormControl>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="monthlyInvestment"
						render={({ field }) => (
							<FormItem>
								<div className="space-y-2">
									<FormLabel>Aporte mensal (R$)</FormLabel>
									<FormControl>
										<DecimalInput
											placeholder="100,00"
											aria-label="Aporte mensal em reais"
											{...field}
										/>
									</FormControl>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="months"
						render={({ field }) => (
							<FormItem>
								<div className="space-y-2">
									<FormLabel>Período (meses)</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="12"
											aria-label="Período em meses"
											type="number"
										/>
									</FormControl>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				{isFetchingIndexers ? (
					<div className="flex items-center text-sm text-muted-foreground">
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Obtendo taxas atuais dos indexadores...
					</div>
				) : (
					<div className="w-full flex flex-col gap-4 sm:flex-row">
						{indexersData.map(data => (
							<div
								key={data.indexer}
								className="bg-secondary/5 w-full space-y-1 p-4 border border-secondary/20 rounded-md shadow-sm"
							>
								<p className="text-secondary font-semibold">
									{data.indexer.toUpperCase()}
								</p>
								<p className="text-lg font-bold">
									{(data.rate * 100).toFixed(2)}%{' '}
									<span className="text-sm font-normal text-muted-foreground">
										ao ano
									</span>
								</p>
								<p className="text-xs text-muted-foreground">
									{data.date &&
										`Atualizado em: ${formatDate(data.date)}`}
									{data.description &&
										` • ${data.description}`}
								</p>
							</div>
						))}
						{fetchIndexersError && (
							<p className="text-xs text-destructive">
								{fetchIndexersError}
							</p>
						)}
					</div>
				)}
				<div className="space-y-4">
					<div>
						<div className="flex justify-between items-center">
							<h3 className="sr-only sm:not-sr-only text-lg font-medium">
								Investimentos
							</h3>
							<Button
								className="flex-1 sm:flex-0 border-secondary/20 hover:bg-secondary/5  text-secondary hover:text-secondary"
								type="button"
								onClick={addInvestment}
								variant="outline"
								disabled={isFetchingIndexers}
							>
								<PlusCircle className="mr-2 h-4 w-4" />
								Adicionar investimento
							</Button>
						</div>
					</div>
					{investments.length <= 0 && (
						<div
							className={`text-center p-4 border border-dashed rounded-md ${isInvestmentsInvalid ? ' border-destructive' : ''}`}
						>
							<p
								className={`${isInvestmentsInvalid ? 'text-destructive' : 'text-muted-foreground'}`}
							>
								Adicione pelo menos um investimento para simular
							</p>
						</div>
					)}
					{investments.map(investment => (
						<InvestmentItem
							key={investment.id}
							investment={investment}
							onChange={updateInvestment}
							onDelete={deleteInvestment}
							isDisabled={isFetchingIndexers}
						/>
					))}
				</div>
				<div className="w-full flex justify-end gap-2 pb-6">
					<Button
						className="border-secondary/20 hover:bg-secondary/5 text-secondary hover:text-secondary"
						type="button"
						variant="outline"
						disabled={isFetchingIndexers}
						onClick={() => {
							form.reset()
						}}
					>
						<RefreshCw className="h-4 w-4" aria-hidden="true" />
						Limpar
					</Button>
					<Button type="submit" disabled={isFetchingIndexers}>
						{isFetchingIndexers ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<>
								<ChartLine />
								Simular
							</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	)
}
