import { useState, useEffect } from "react";
import type { IndexerData } from "@/lib/types";

export function useIndexersData() {
	const [indexersData, setIndexersData] = useState<IndexerData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchIndexData = async () => {
			try {
				setIsLoading(true);
				const response = await fetch("/api/indexers-rate");
				const data = await response.json();
				setIndexersData(data);
				setError(null);
			} catch (err) {
				console.error("Failed to fetch indexers rate:", err);
				setError("Failed to fetch indexers rate");
			} finally {
				setIsLoading(false);
			}
		};

		fetchIndexData();
	}, []);

	return { indexersData, isLoading, error };
}
