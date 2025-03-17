import { NextResponse } from "next/server";

export async function GET() {
	try {
		const response = await fetch(
			"https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/1?formato=json",
		);
		const data = await response.json();

		const ipcaRate = data[0].valor;

		const ipcaRateDecimal = Number.parseFloat(ipcaRate.replace(",", ".")) / 100;

		return NextResponse.json({
			rate: ipcaRateDecimal,
			source: "Banco Central do Brasil",
			date: data[0].data,
			description: "Taxa IPCA dos últimos 12 meses",
		});
	} catch (error) {
		return NextResponse.json(
			{
				rate: 0.05,
				source: "Valor padrão (API indisponível)",
				error: "Não foi possível obter o valor atual do IPCA",
			},
			{ status: 200 },
		);
	}
}
