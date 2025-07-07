import { useEffect, useState } from "react";

export type FormData = {
    _id: string;
    sprint: string;
    version: string;
    dueDate: string;
    releaseDate?: string;
    closeDate?: string;
    env?: "development" | "production";
    feature?: boolean;
    status?: "delayed" | "on-time";
};

interface UseReleaseDataParams {
    statusFilter?: "on-time" | "delayed" | "all";
    initialSkip?: number;
    limit?: number;
}

export function useReleaseData({
    statusFilter = "all",
    initialSkip = 0,
    limit = 5,
}: UseReleaseDataParams) {
    const [releases, setReleases] = useState<FormData[]>([]);
    const [skip, setSkip] = useState(initialSkip);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async (currentSkip: number) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            params.append("skip", currentSkip.toString());
            params.append("limit", limit.toString());

            if (statusFilter !== "all") {
                params.append("status", statusFilter);
            }

            // const response = await fetch(`http://localhost:3001/api/v1/releases?${params.toString()}`);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/releases?${params.toString()}`);


            if (!response.ok) {
                throw new Error("Failed to fetch releases");
            }

            const result: FormData[] = await response.json();
            const safeResult = Array.isArray(result) ? result : [];

            if (currentSkip === 0) {
                setReleases(safeResult);
            } else {
                setReleases(prev => [...prev, ...safeResult]);
            }

            if (safeResult.length < limit) {
                setHasMore(false);
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Initial + filter changes
    useEffect(() => {
        setSkip(initialSkip);
        setHasMore(true);
        fetchData(initialSkip);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    const loadMore = () => {
        const nextSkip = skip + limit;
        setSkip(nextSkip);
        fetchData(nextSkip);
    };

    return {
        releases,
        loading,
        error,
        hasMore,
        loadMore,
    };
}
