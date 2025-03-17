import { NextResponse } from "next/server";

export async function GET() {
	try {
		const response = await fetch(
			"https://api.bcb.gov.br/dados/serie/bcdata.sgs.4389/dados/ultimos/1?formato=json",
		);
		const data = await response.json();

		const cdiRate = data[0].valor;

		const cdiRateDecimal = Number.parseFloat(cdiRate.replace(",", ".")) / 100;

		return NextResponse.json({
			rate: cdiRateDecimal,
			source: "Banco Central do Brasil",
			date: data[0].data,
			description: "Taxa CDI anual",
		});
	} catch (error) {
		return NextResponse.json(
			{
				rate: 0.1315,
				source: "Valor padrão (API indisponível)",
				error: "Não foi possível obter o valor atual do CDI",
			},
			{ status: 200 },
		);
	}
}
