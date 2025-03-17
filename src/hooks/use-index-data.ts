import { useState, useEffect } from "react";
import type { IndexData, Indexer } from "@/lib/types";

export function useIndexData(indexer: Indexer) {
	const [indexData, setIndexData] = useState<IndexData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchIndexData = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(`/api/indexes-rate?index=${indexer}`);
				const data = await response.json();
				setIndexData(data);
				setError(null);
			} catch (err) {
				console.error(`Failed to fetch ${indexer.toUpperCase()} rate:`, err);
				setError(`Failed to fetch ${indexer.toUpperCase()} rate`);
			} finally {
				setIsLoading(false);
			}
		};

		fetchIndexData();
	}, [indexer]);

	return { indexData, isLoading, error };
}
