import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface SimulationResult {
    months: number[];
    balance: number[];
    interest: number[];
    totalGrossIncome: number;
    totalGrossAmount: number;
    totalNetIncome: number;
    totalNetAmount: number;
    incomeTaxDiscount: number;
}

interface IndexData {
    rate: number;
    source: string;
    date?: string;
    description?: string;
    error?: string;
}

export function FixedIncomeSimulator() {
    const [initialInvestment, setInitialInvestment] = useState<string>("0");
    const [months, setMonths] = useState<string>("0");
    const [typeOfInvestment, setTypeOfInvestment] = useState<"cdb" | "lci-lca">(
        "cdb",
    );
    const [modality, setModality] = useState<"pos" | "pre">("pos");
    const [indexer, setIndexer] = useState<"cdi" | "ipca">("cdi");
    const [rate, setRate] = useState("0");
    const [simulationResult, setSimulationResult] =
        useState<SimulationResult | null>(null);
    const [indexData, setIndexData] = useState<IndexData | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIndexData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/indexes/${indexer}`);
                const data = await response.json();
                console.log("data", data);

                setIndexData(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch IPCA rate:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIndexData();
    }, [indexer]);

    const handleInitialInvestmentChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = e.target.value.replace(/[^0-9.]/g, "");
        setInitialInvestment(value);
    };

    const handleMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        setMonths(value);
    };

    const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9.]/g, "");
        setRate(value);
    };

    const calculateSimulation = () => {
        if (!indexData) {
            return null
        }
        const investment = Number.parseFloat(initialInvestment) ?? 0;
        const period = Number.parseInt(months) ?? 0;
        const investmentRate = Number.parseFloat(rate.replace(",", ".")) / 100;

        if (investment <= 0 || period <= 0) {
            return;
        }

        const monthlyRate =
            modality === "pre"
                ? (1 + investmentRate) ** (1 / 12) - 1
                : indexer === "cdi" ? (1 + indexData?.rate * investmentRate) ** (1 / 12) - 1
                    : (1 + indexData?.rate + investmentRate) ** (1 / 12) - 1;

        const monthsArray: number[] = [0];
        const balanceArray: number[] = [];
        const interestArray: number[] = [];

        let currentBalance = investment;
        let totalInterest = 0;

        for (let i = 1; i <= period; i++) {
            const monthlyInterest = currentBalance * monthlyRate;
            totalInterest += monthlyInterest;
            currentBalance += monthlyInterest;

            monthsArray.push(i + 1);
            balanceArray.push(currentBalance);
            interestArray.push(monthlyInterest);
        }

        let totalNetAmount = currentBalance;
        let incomeTaxDiscount = 0;
        let totalNetIncome = totalInterest;
        if (typeOfInvestment === "cdb") {
            if (period <= 6) {
                incomeTaxDiscount = totalInterest * 0.225;
                totalNetIncome = totalInterest - incomeTaxDiscount;
                totalNetAmount = investment + totalInterest - incomeTaxDiscount;
            } else if (period > 6 && period <= 12) {
                incomeTaxDiscount = totalInterest * 0.2;
                totalNetIncome = totalInterest - incomeTaxDiscount;
                totalNetAmount = investment + totalInterest - incomeTaxDiscount;
            } else if (period > 12 && period <= 24) {
                incomeTaxDiscount = totalInterest * 0.175;
                totalNetIncome = totalInterest - incomeTaxDiscount;
                totalNetAmount = investment + totalInterest - incomeTaxDiscount;
            } else {
                incomeTaxDiscount = totalInterest * 0.15;
                totalNetIncome = totalInterest - incomeTaxDiscount;
                totalNetAmount = investment + totalInterest - incomeTaxDiscount;
            }
        }

        setSimulationResult({
            months: monthsArray,
            balance: balanceArray,
            interest: interestArray,
            totalGrossIncome: totalInterest,
            totalGrossAmount: currentBalance,
            incomeTaxDiscount,
            totalNetAmount,
            totalNetIncome,
        });
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
                    <div className="space-y-4">
                        {modality !== "pre" && (
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
                                                    {indexer.toUpperCase()} atual: {(indexData?.rate * 100).toFixed(2)}
                                                    % ao ano
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Fonte: {indexData.source}
                                                    {indexData.date &&
                                                        ` • Atualizado em: ${formatDate(indexData.date)}`}
                                                    {indexData.description &&
                                                        ` • ${indexData.description}`}
                                                </p>
                                            </>
                                        )}
                                        {error && (
                                            <p className="text-xs text-destructive">{error}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="grid grid-cols-3 gap-6">
                            <RadioGroup defaultValue={typeOfInvestment}>
                                <Label>Tipo de Investimento</Label>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="cdb"
                                        id="cdb"
                                        onClick={() => setTypeOfInvestment("cdb")}
                                    />
                                    <Label htmlFor="cdb">CDB</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="lci-lca"
                                        id="lci-lca-r"
                                        onClick={() => setTypeOfInvestment("lci-lca")}
                                    />
                                    <Label htmlFor="lci-lca-r">LCI/LCA</Label>
                                </div>
                            </RadioGroup>
                            <RadioGroup defaultValue={modality}>
                                <Label>Modalidade</Label>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="pos"
                                        id="pos"
                                        onClick={() => setModality("pos")}
                                    />
                                    <Label htmlFor="cdb">Pós-fixado</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="pre"
                                        id="pre"
                                        onClick={() => setModality("pre")}
                                    />
                                    <Label htmlFor="pre">Prefixado</Label>
                                </div>
                            </RadioGroup>
                            <RadioGroup defaultValue={indexer} disabled={modality === "pre"}>
                                <Label>Indexador</Label>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="cdi"
                                        id="indexer-cdi"
                                        onClick={() => setIndexer("cdi")}
                                    />
                                    <Label htmlFor="indexer-cdi">CDI</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="ipca"
                                        id="indexer-ipca"
                                        onClick={() => setIndexer("ipca")}
                                    />
                                    <Label htmlFor="cdb">IPCA+</Label>
                                </div>
                            </RadioGroup>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="initialInvestment" className="text-right">
                                    Investimento Inicial (R$)
                                </Label>
                                <Input
                                    id="initialInvestment"
                                    value={initialInvestment}
                                    onChange={handleInitialInvestmentChange}
                                    placeholder="1000"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="months" className="text-right">
                                    Período (meses)
                                </Label>
                                <Input
                                    id="months"
                                    value={months}
                                    onChange={handleMonthsChange}
                                    placeholder="12"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="rate" className="text-right">
                                    Rentabilidade (%)
                                </Label>
                                <Input
                                    id="rate"
                                    value={rate}
                                    onChange={handleRateChange}
                                    placeholder="100"
                                />
                            </div>
                        </div>

                        <div className="w-full flex justify-center">
                            <Button onClick={calculateSimulation} disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Carregando...
                                    </>
                                ) : (
                                    "Calcular rendimento"
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {simulationResult && (
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Resultado da Simulação</CardTitle>
                            <CardDescription>
                                Investimento inicial de{" "}
                                {formatCurrency(Number.parseFloat(initialInvestment))} por{" "}
                                {months} meses
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className={cn("bg-primary/10")}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Investimento inicial
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {formatCurrency(Number(initialInvestment))}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className={cn("bg-primary/10")}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Rendimento bruto
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {formatCurrency(simulationResult.totalGrossIncome)}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className={cn("bg-primary/10")}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Valor final bruto
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {formatCurrency(simulationResult.totalGrossAmount)}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className={cn("bg-primary/10")}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Descontos de IR
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {formatCurrency(simulationResult.incomeTaxDiscount)}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className={cn("bg-primary/10")}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Rendimento líquido
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {formatCurrency(simulationResult.totalNetIncome)}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className={cn("bg-primary/10")}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Valor final líquido
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {formatCurrency(simulationResult.totalNetAmount)}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
