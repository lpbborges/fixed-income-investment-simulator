import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
	typeOfInvestment: z
		.enum(["with-income-taxes", "without-income-taxes"])
		.default("without-income-taxes"),
	modality: z.enum(["pos", "pre"]).default("pos"),
	months: z.coerce.number().min(1),
	initialInvestment: z.string(),
	rate: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function FixedIncomeSimulatorForm() {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			initialInvestment: "0",
			modality: "pos",
			months: 0,
			rate: "0",
			typeOfInvestment: "with-income-taxes",
		},
	});

	return (
		<Form {...form}>
			<form>
				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="typeOfInvestment"
						render={({ field }) => (
							<FormItem className="space-y-3">
								<FormLabel>Tipo de investimento</FormLabel>
								<FormControl>
									<RadioGroup
										onValueChange={field.onChange}
										defaultValue={field.value}
										className="flex flex-col space-y-1"
									>
										<FormItem className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem value="with-income-taxes" />
											</FormControl>
											<FormLabel className="font-normal">CDB</FormLabel>
										</FormItem>
										<FormItem className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem value="without-income-taxes" />
											</FormControl>
											<FormLabel className="font-normal">LCI/LCA</FormLabel>
										</FormItem>
									</RadioGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="modality"
						render={({ field }) => (
							<FormItem className="space-y-3">
								<FormLabel>Modalidade</FormLabel>
								<FormControl>
									<RadioGroup
										onValueChange={field.onChange}
										defaultValue={field.value}
										className="flex flex-col space-y-1"
									>
										<FormItem className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem value="pos" />
											</FormControl>
											<FormLabel className="font-normal">CDB</FormLabel>
										</FormItem>
										<FormItem className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem value="pre" />
											</FormControl>
											<FormLabel className="font-normal">LCI/LCA</FormLabel>
										</FormItem>
									</RadioGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="initialInvestment"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Investimento inicial</FormLabel>
								<FormControl>
									<Input placeholder="shadcn" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="months"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Período (meses)</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="rate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Rentabilidade (%)</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</form>
		</Form>
	);
}
