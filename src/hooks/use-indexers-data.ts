'use client'

import type { IndexerData } from '@/lib/types'
import { useEffect, useState } from 'react'

export function useIndexersData() {
	const [indexersData, setIndexersData] = useState<IndexerData[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const controller = new AbortController()
		const signal = controller.signal

		const fetchIndexData = async () => {
			try {
				setIsLoading(true)
				const response = await fetch('/api/indexers-rate', {
					signal,
					cache: 'no-store',
				})

				if (!response.ok) {
					throw new Error(
						`API responded with status: ${response.status}`,
					)
				}

				const data = await response.json()

				setIndexersData(data)
				setError(null)
			} catch (err) {
				// Don't log aborted requests as errors
				if (err instanceof Error && err.name !== 'AbortError') {
					console.error('Failed to fetch indexers rate:', err)
					setError('Falha ao obter taxas dos indexadores')
				}
			} finally {
				if (!signal.aborted) {
					setIsLoading(false)
				}
			}
		}

		fetchIndexData()

		// Cleanup function to abort fetch on unmount
		return () => {
			controller.abort()
		}
	}, [])

	return { indexersData, isLoading, error }
}
