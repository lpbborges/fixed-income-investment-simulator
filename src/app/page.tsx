import { FixedIncomeSimulator } from '@/components/fixed-income-simulator'

export default function Home() {
	return (
		<div className="min-h-screen bg-background p-4 md:p-8">
			<main className="flex flex-col">
				<div className="container mx-auto max-w-5xl">
					<FixedIncomeSimulator />
				</div>
			</main>
		</div>
	)
}
