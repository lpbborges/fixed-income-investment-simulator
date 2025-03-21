import type { SimulationResult } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

interface SimulationResultsProps {
	result: SimulationResult[];
	initialInvestment: string;
	months: string;
}

export function SimulationResults({
	result,
	initialInvestment,
	months,
}: SimulationResultsProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Resultado da Simulação</CardTitle>
				<CardDescription>
					{`Investimento inicial de ${formatCurrency(Number(initialInvestment))} por ${months} meses`}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Investimento</TableHead>
							<TableHead className="text-center">Valor total bruto</TableHead>
							<TableHead className="text-center">Valor total líquido</TableHead>
							<TableHead className="text-center">Rendimento líquido</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{result.map((simulation) => (
							<TableRow key={simulation.description}>
								<TableCell>{simulation.description}</TableCell>
								<TableCell className="text-center">
									{formatCurrency(simulation.totalGrossAmount)}
								</TableCell>
								<TableCell className="text-center">
									{formatCurrency(simulation.totalNetAmount)}
								</TableCell>
								<TableCell className="text-center">
									{formatCurrency(simulation.totalNetIncome)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
