import { NextResponse } from "next/server";

type IndexerResponse = {
	code: string;
	description: string;
	error: string;
};

type Indexers = "cdi" | "ipca";

const indexerResponses = {
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
} as Record<Indexers, IndexerResponse>;

async function fetchIndexerData(indexer: keyof typeof indexerResponses) {
	const indexerResponse = indexerResponses[indexer];

	try {
		const response = await fetch(
			`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${indexerResponse.code}/dados/ultimos/1?formato=json`,
		);
		const data = await response.json();
		const rate = data[0].valor;
		const rateDecimal = Number.parseFloat(rate.replace(",", ".")) / 100;

		return {
			indexer,
			rate: rateDecimal,
			source: "Banco Central do Brasil",
			date: data[0].data,
			description: indexerResponse.description,
		};
	} catch (error) {
		console.error("Failed to fetch index data", error);

		return {
			indexer,
			rate: 0.1315,
			source: "Valor padrão (API indisponível)",
			error: indexerResponse.error,
		};
	}
}

export async function GET() {
	try {
		const response = await Promise.all([
			fetchIndexerData("cdi"),
			fetchIndexerData("ipca"),
		]);

		return NextResponse.json(response, { status: 200 });
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
