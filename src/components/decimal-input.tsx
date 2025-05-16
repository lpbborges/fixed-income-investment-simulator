import { Input } from './ui/input'

type CurrencyInputProps = Omit<
	React.ComponentProps<'input'>,
	'value' | 'onChange'
> & {
	value: string
	onChange: (value: string) => void
	places?: number
}

export function DecimalInput({
	onChange,
	value,
	places = 2,
	...rest
}: CurrencyInputProps) {
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let input = e.target.value

		input = input.replace(/[^0-9.,]/g, '')

		const match = input.match(/[.,]/)
		const separator = match ? match[0] : null
		let parts = separator ? input.split(/[,.]/) : [input]

		if (parts.length > 2) {
			parts = [parts[0], parts[1]]
		}

		if (parts.length === 2) {
			parts[1] = parts[1].slice(0, places)
			input = `${parts[0]}${separator}${parts[1]}`
		}

		onChange(input)
	}

	return (
		<Input
			value={value}
			onChange={handleInputChange}
			inputMode="decimal"
			{...rest}
		/>
	)
}
