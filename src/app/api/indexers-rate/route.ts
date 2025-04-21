import type { IndexerResponse, Indexers } from '@/lib/types'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const indexerResponses = new Map<Indexers, IndexerResponse>([
	[
		'cdi',
		{
			code: '4389',
			description: 'Taxa CDI anual',
			error: 'Não foi possível obter o valor atual do CDI',
		},
	],
	[
		'ipca',
		{
			code: '13522',
			description: 'Taxa IPCA dos últimos 12 meses',
			error: 'Não foi possível obter o valor atual do IPCA',
		},
	],
])

const ONE_HOUR_IN_SECONDS = 60 * 60
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS * 24

async function fetchIndexerData(indexer: Indexers) {
	const indexerResponse = indexerResponses.get(indexer)

	if (!indexerResponse) {
		throw new Error(`Invalid indexer: ${indexer}`)
	}

	const cookieStore = await cookies()
	const cookieKey = `indexer-${indexer}`

	try {
		const response = await fetch(
			`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${indexerResponse.code}/dados/ultimos/1?formato=json`,
			{
				next: { revalidate: ONE_HOUR_IN_SECONDS },
			},
		)
		const data = await response.json()
		const rate = data[0].valor
		const rateDecimal = Number.parseFloat(rate.replace(',', '.')) / 100
		const indexerData = {
			indexer,
			rate: rateDecimal,
			date: data[0].data,
			description: indexerResponse.description,
		}

		cookieStore.set(cookieKey, JSON.stringify(indexerData), {
			maxAge: ONE_DAY_IN_SECONDS,
			path: '/',
			sameSite: 'strict',
		})

		return indexerData
	} catch (error) {
		console.error(`Failed to fetch ${indexer} data`, error)

		// Try to get from cookie as fallback
		const cookieValue = cookieStore.get(cookieKey)?.value

		if (cookieValue) {
			return JSON.parse(cookieValue)
		}

		return {
			indexer,
			rate: 0,
			description: indexerResponse.error,
		}
	}
}

export async function GET() {
	try {
		const response = await Promise.all([
			fetchIndexerData('cdi'),
			fetchIndexerData('ipca'),
		])

		return NextResponse.json(response, {
			status: 200,
			headers: {
				'Cache-Control': `public, s-maxage=${ONE_HOUR_IN_SECONDS}, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
			},
		})
	} catch (err) {
		console.error('Error in indexers-rate API route:', err)
		return NextResponse.json(
			{ error: 'Failed to fetch indexer data' },
			{ status: 500 },
		)
	}
}
