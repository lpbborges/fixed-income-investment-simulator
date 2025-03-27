import { TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { INDEXERS, INVESTMENT_TYPES, MODALITIES } from "@/lib/constants";
import type { Investment } from "@/lib/types";

type InvestmentItemProps = {
    investment: Investment;
    onChange: (investment: Investment) => void;
    onDelete: (id: string) => void;
    isDisabled: boolean;
};

export function InvestmentItem({
    investment,
    onChange,
    onDelete,
    isDisabled,
}: InvestmentItemProps) {
    const handleChange = (field: keyof Investment, value: string) => {
        onChange({
            ...investment,
            [field]: value,
        });
    };

    return (
        <Card className="mb-4">
            <CardContent className="pb-2 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label className="text-xs mb-1 block">Tipo de Investimento</Label>
                        <RadioGroup
                            value={investment.typeOfInvestment}
                            onValueChange={(value) => handleChange("typeOfInvestment", value)}
                            className="flex flex-col space-y-1"
                            disabled={isDisabled}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={INVESTMENT_TYPES.CDB}
                                    id={`cdb-${investment.id}`}
                                />
                                <Label htmlFor={`cdb-${investment.id}`}>CDB</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={INVESTMENT_TYPES.LCI_LCA}
                                    id={`lci-lca-${investment.id}`}
                                />
                                <Label htmlFor={`lci-lca-${investment.id}`}>LCI/LCA</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div>
                        <Label className="text-xs mb-1 block">Modalidade</Label>
                        <RadioGroup
                            value={investment.modality}
                            onValueChange={(value) => handleChange("modality", value)}
                            className="flex flex-col space-y-1"
                            disabled={isDisabled}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={MODALITIES.POS}
                                    id={`pos-${investment.id}`}
                                />
                                <Label htmlFor={`pos-${investment.id}`}>Pós-fixado</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={MODALITIES.PRE}
                                    id={`pre-${investment.id}`}
                                />
                                <Label htmlFor={`pre-${investment.id}`}>Prefixado</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div>
                        <Label className="text-xs mb-1 block">Indexador</Label>
                        <RadioGroup
                            value={investment.indexer}
                            onValueChange={(value) => handleChange("indexer", value)}
                            disabled={investment.modality === MODALITIES.PRE || isDisabled}
                            className="flex flex-col space-y-1"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={INDEXERS.CDI}
                                    id={`indexer-cdi-${investment.id}`}
                                />
                                <Label htmlFor={`indexer-cdi-${investment.id}`}>CDI</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={INDEXERS.IPCA}
                                    id={`indexer-ipca-${investment.id}`}
                                />
                                <Label htmlFor={`indexer-ipca-${investment.id}`}>IPCA+</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <div className="mt-4">
                        <Label className="text-xs mb-1 block">Rentabilidade (%)</Label>
                        <Input
                            value={investment.rate}
                            onChange={(e) =>
                                handleChange("rate", e.target.value.replace(/[^0-9,.]/g, ""))
                            }
                            placeholder="100"
                            className="h-8"
                            disabled={isDisabled}
                        />
                    </div>
                    <Button
                        variant="outline-destructive"
                        size="sm"
                        onClick={() => onDelete(investment.id)}
                        disabled={isDisabled}
                        aria-label="Remover investimento"
                    >
                        <TrashIcon className="h-4 w-4" />
                        Remover
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
