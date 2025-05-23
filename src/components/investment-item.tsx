'use client'

import { TrashIcon } from 'lucide-react'
import { memo } from 'react'

import { INDEXERS, INVESTMENT_TYPES, MODALITIES } from '@/lib/constants'
import type { Investment } from '@/lib/types'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { DecimalInput } from './decimal-input'

type InvestmentItemProps = {
	investment: Investment
	onChange: (investment: Investment) => void
	onDelete: (id: string) => void
	isDisabled: boolean
}

export const InvestmentItem = memo(function InvestmentItem({
	investment,
	onChange,
	onDelete,
	isDisabled,
}: InvestmentItemProps) {
	const handleChange = (field: keyof Investment, value: string) => {
		onChange({
			...investment,
			[field]: value,
		})
	}

	const isIndexerDisabled =
		investment.modality === MODALITIES.PRE || isDisabled

	return (
		<Card className="mb-4 bg-accent/3 border border-accent/10">
			<CardContent className="pb-2 pt-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
					<div>
						<Label className="text-xs mb-2 block">
							Tipo de Investimento
						</Label>
						<RadioGroup
							value={investment.typeOfInvestment}
							onValueChange={value =>
								handleChange('typeOfInvestment', value)
							}
							className="flex flex-row justify-between md:flex-col space-y-1"
							disabled={isDisabled}
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									className="bg-white"
									value={INVESTMENT_TYPES.CDB}
									id={`cdb-${investment.id}`}
								/>
								<Label htmlFor={`cdb-${investment.id}`}>
									CDB
								</Label>
							</div>
							<div className="flex items-center space-x-2 w-24">
								<RadioGroupItem
									className="bg-white"
									value={INVESTMENT_TYPES.LCI_LCA}
									id={`lci-lca-${investment.id}`}
								/>
								<Label htmlFor={`lci-lca-${investment.id}`}>
									LCI/LCA
								</Label>
							</div>
						</RadioGroup>
					</div>

					<div>
						<Label className="text-xs mb-2 block">Modalidade</Label>
						<RadioGroup
							value={investment.modality}
							onValueChange={value =>
								handleChange('modality', value)
							}
							className="flex flex-row justify-between md:flex-col space-y-1"
							disabled={isDisabled}
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									className="bg-white"
									value={MODALITIES.POS}
									id={`pos-${investment.id}`}
								/>
								<Label htmlFor={`pos-${investment.id}`}>
									Pós-fixado
								</Label>
							</div>
							<div className="flex items-center space-x-2 w-24">
								<RadioGroupItem
									className="bg-white"
									value={MODALITIES.PRE}
									id={`pre-${investment.id}`}
								/>
								<Label htmlFor={`pre-${investment.id}`}>
									Prefixado
								</Label>
							</div>
						</RadioGroup>
					</div>

					<div>
						<Label className="text-xs mb-2 block">Indexador</Label>
						<RadioGroup
							value={investment.indexer}
							onValueChange={value =>
								handleChange('indexer', value)
							}
							disabled={isIndexerDisabled}
							className="flex flex-row justify-between md:flex-col space-y-1"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									className="bg-white"
									value={INDEXERS.CDI}
									id={`indexer-cdi-${investment.id}`}
								/>
								<Label htmlFor={`indexer-cdi-${investment.id}`}>
									CDI
								</Label>
							</div>
							<div className="flex items-center space-x-2 w-24">
								<RadioGroupItem
									className="bg-white"
									value={INDEXERS.IPCA}
									id={`indexer-ipca-${investment.id}`}
								/>
								<Label
									htmlFor={`indexer-ipca-${investment.id}`}
								>
									IPCA+
								</Label>
							</div>
						</RadioGroup>
					</div>
				</div>

				<div className="flex justify-between items-end">
					<div className="mt-4">
						<Label className="text-xs mb-1 block">
							Rentabilidade (%)
						</Label>
						<DecimalInput
							value={investment.rate}
							onChange={(value: string) =>
								handleChange('rate', value)
							}
							placeholder="100,00"
							className="h-8 bg-white"
							disabled={isDisabled}
						/>
					</div>
					<Button
						variant="outline-destructive"
						className="bg-white hover:bg-destructive/15 hover:text-destructive"
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
	)
})
