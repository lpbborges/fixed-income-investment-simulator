import { cookies } from "next/headers";
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

const ONE_HOUR_IN_SECONDS = 60 * 60
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS * 24;

async function fetchIndexerData(indexer: keyof typeof indexerResponses) {
    const indexerResponse = indexerResponses[indexer];

    const cookieStore = await cookies();

    try {
        const response = await fetch(
            `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${indexerResponse.code}/dados/ultimos/1?formato=json`,
            {
                cache: "force-cache",
                next: { revalidate: ONE_HOUR_IN_SECONDS },
            },
        );
        const data = await response.json();
        const rate = data[0].valor;
        const rateDecimal = Number.parseFloat(rate.replace(",", ".")) / 100;
        const indexerData = {
            indexer,
            rate: rateDecimal,
            date: data[0].data,
            description: indexerResponse.description,
        };

        cookieStore.set(indexer, JSON.stringify(indexerData), {
            maxAge: ONE_DAY_IN_SECONDS,
        });

        return indexerData;
    } catch (error) {
        console.error("Failed to fetch indexer data", error);

        const cookieValue = cookieStore.get(indexer)?.value ?? "";

        if (cookieValue) {
            return JSON.parse(cookieValue);
        }

        return {
            indexer,
            rate: 0,
            description: indexerResponse.error,
        };
    }
}

export async function GET() {
    const response = await Promise.all([
        fetchIndexerData("cdi"),
        fetchIndexerData("ipca"),
    ]);

    return NextResponse.json(response, { status: 200 });
}
