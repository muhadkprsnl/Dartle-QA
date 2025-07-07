import { useState, useEffect } from "react"

interface SprintError {
    name: string;        // sprint name
    devError: number;    // % error in development
    prodError: number;   // % error in production
}

/**
 * Hook to fetch sprint-wise error percentage data
 * @param startDate - string like "2025-06-01"
 * @param endDate - string like "2025-06-30"
 * loading: sprintLoading,
  error: sprintError
 */
export function useSprintErrorComparison(startDate: string, endDate: string) {
    const [sprints, setSprints] = useState<SprintError[]>([])
    const [sprintLoading, setLoading] = useState(true)
    const [sprintError, setError] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sprint-error-comparison?startDate=${startDate}&endDate=${endDate}`
                    // `http://localhost:3001/api/v1/sprint-error-comparison?startDate=${startDate}&endDate=${endDate}`

                )

                if (!res.ok) throw new Error("Failed to fetch sprint error data")
                const data: SprintError[] = await res.json()
                setSprints(data)
            } catch (err) {
                console.error("Sprint error fetch failed:", err)
                setError("Failed to load sprint error comparison data")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [startDate, endDate])

    return { sprints, sprintLoading, sprintError }
}
