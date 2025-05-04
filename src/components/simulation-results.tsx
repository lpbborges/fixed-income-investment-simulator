import { formatCurrency } from '@/lib/formatters'
import type { SimulationResult } from '@/lib/types'
import type { RefObject } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './ui/table'
import { ChartLine } from 'lucide-react'

interface SimulationResultsProps {
	result: SimulationResult
	ref: RefObject<HTMLTableElement | null>
}

export function SimulationResults({ result, ref }: SimulationResultsProps) {
	return (
		<Card className="pt-0 pb-6">
			<CardHeader className="bg-success/5 p-6 border-b border-success/10">
				<CardTitle className="text-success flex items-center gap-2 text-2xl">
					<ChartLine />
					Resultado da última simulação
				</CardTitle>
				<CardDescription>{result.description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="border rounded-md font-medium">
					<Table ref={ref} className="border-collapse">
						<TableHeader>
							<TableRow className="bg-muted">
								<TableHead className="font-semibold py-4">
									Investimento
								</TableHead>
								<TableHead className="text-center font-semibold py-4">
									Valor total bruto
								</TableHead>
								<TableHead className="text-center font-semibold py-4">
									Valor total líquido
								</TableHead>
								<TableHead className="text-center font-semibold py-4">
									Rendimento líquido
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{result.investmentsYields.map(simulation => (
								<TableRow
									key={simulation.description}
									className="first:bg-success/5 group border-b-0"
								>
									<TableCell className="py-4 font-medium">
										{simulation.description}
									</TableCell>
									<TableCell className="text-center py-4 font-medium">
										{formatCurrency(
											simulation.totalGrossAmount,
										)}
									</TableCell>
									<TableCell className="text-center py-4 font-medium">
										{formatCurrency(
											simulation.totalNetAmount,
										)}
									</TableCell>
									<TableCell className="text-center py-4 font-medium group-first:text-success">
										{formatCurrency(
											simulation.totalNetIncome,
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}
