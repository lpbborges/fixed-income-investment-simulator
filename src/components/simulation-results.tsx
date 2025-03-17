import type { SimulationResult } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";

interface SimulationResultsProps {
    result: SimulationResult;
    initialInvestment: string;
    months: string;
}

export function SimulationResults({
    result,
    initialInvestment,
    months,
}: SimulationResultsProps) {
    const resultCards = [
        {
            title: "Investimento inicial",
            value: formatCurrency(Number(initialInvestment)),
        },
        {
            title: "Rendimento bruto",
            value: formatCurrency(result.totalGrossIncome),
        },
        {
            title: "Valor final bruto",
            value: formatCurrency(result.totalGrossAmount),
        },
        {
            title: "Descontos de IR",
            value: formatCurrency(result.incomeTaxDiscount),
        },
        {
            title: "Rendimento líquido",
            value: formatCurrency(result.totalNetIncome),
        },
        {
            title: "Valor final líquido",
            value: formatCurrency(result.totalNetAmount),
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Resultado da Simulação</CardTitle>
                <CardDescription>
                    Investimento inicial de {formatCurrency(Number(initialInvestment))}{" "}
                    por {months} meses
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {resultCards.map((card) => (
                        <Card key={card.title} className={cn("bg-primary/10")}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {card.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{card.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
