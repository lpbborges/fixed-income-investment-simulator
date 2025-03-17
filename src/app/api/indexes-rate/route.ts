import { type NextRequest, NextResponse } from "next/server";

type IndexResponse = {
	code: string;
	description: string;
	error: string;
};

type Indexes = "cdi" | "ipca";

const indexesResponses = {
	cdi: {
		code: "4389",
		description: "Taxa CDI anual",
		error: "Não foi possível obter o valor atual do CDI",
	},
	ipca: {
		code: "13522",
		description: "Taxa IPCA dos últimos 12 meses",
		error: "Não foi possível obter o valor atual do IPCA",
	},
} as Record<Indexes, IndexResponse>;

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const index = searchParams.get("index") as Indexes;

	if (!index) {
		return NextResponse.json(
			{ rate: 0, source: "", error: "Índice inválido." },
			{ status: 400 },
		);
	}

	try {
		const response = await fetch(
			`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${indexesResponses[index].code}/dados/ultimos/1?formato=json`,
		);
		const data = await response.json();

		const rate = data[0].valor;

		const rateDecimal = Number.parseFloat(rate.replace(",", ".")) / 100;

		return NextResponse.json({
			rate: rateDecimal,
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
