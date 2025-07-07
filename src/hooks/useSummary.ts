// app/hooks/useSummary.ts
import { useState, useEffect } from "react";
import axios from "axios";

interface SummaryData {
    totalBugs: number;
    successRate: number;
    errorRate: number;
    delays: number;
}

interface SummaryResponse {
    prod: SummaryData;
    dev: SummaryData;
}

export function useSummary(
    viewMode: "development" | "production" | "both",
    startDate: string,
    endDate: string,
    selectedSprint?: string // ✅ Add sprint
) {
    const [summary, setSummary] = useState<SummaryResponse>({
        prod: { totalBugs: 0, successRate: 0, errorRate: 0, delays: 0 },
        dev: { totalBugs: 0, successRate: 0, errorRate: 0, delays: 0 },
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/summary`, {
                    // "http://localhost:3001/api/v1/summary", {
                    params: {
                        startDate,
                        endDate,
                        sprint: selectedSprint && selectedSprint !== "All" ? selectedSprint : undefined,
                    },
                });
                setSummary(response.data);
            } catch (err) {
                console.error("Summary fetch error:", err);
                setError("Failed to fetch summary data");
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [viewMode, startDate, endDate, selectedSprint]);

    return { summary, loading, error };
}
