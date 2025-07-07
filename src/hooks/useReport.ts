// // hooks/useReports.ts
// // import { useState, useEffect } from 'react';

// interface ReportData {
//     environment: string;
//     developer1: string;
//     d1_passed: number;
//     d1_failed: number;
//     developer2: string;
//     d2_passed: number;
//     d2_failed: number;
//     P_developer1?: string;
//     P_d1_passed?: number;
//     P_d1_failed?: number;
//     P_developer2?: string;
//     P_d2_passed?: number;
//     P_d2_failed?: number;
// }




// // hooks/useDonutData.ts
// import { useState, useEffect } from 'react';

// interface DonutData {
//     name: string;
//     prodSuccess: number;
//     prodError: number;
//     devSuccess: number;
//     devError: number;
// }



// interface UseDonutOptions {
//     sprint?: string;
//     startDate?: string; // Format: YYYY-MM-DD
//     endDate?: string;
// }

// export default function useDonutData({ sprint, startDate, endDate }: UseDonutOptions = {}) {
//     const [data, setData] = useState<DonutData[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const url = new URL('http://localhost:3001/api/v1/analytics/donut');
//                 if (sprint && sprint !== "All") url.searchParams.append("sprint", sprint);
//                 if (startDate) url.searchParams.append("startDate", startDate);
//                 if (endDate) url.searchParams.append("endDate", endDate);

//                 const response = await fetch(url.toString(), {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                 });

//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }

//                 const result = await response.json();
//                 setData(result);
//             } catch (err) {
//                 setError(err instanceof Error ? err.message : 'Unknown error');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [sprint, startDate, endDate]);

//     return { data, loading, error };
// }


// import { useEffect, useState } from "react";

// export interface DonutData {
//     name: string;
//     prodSuccess: number;
//     prodError: number;
//     devSuccess: number;
//     devError: number;
// }

// interface UseDonutDataOptions {
//     sprint?: string;
//     startDate?: string;
//     endDate?: string;
// }

// export default function useDonutData({ sprint, startDate, endDate }: UseDonutDataOptions = {}) {

//     const [data, setData] = useState<DonutData[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const shouldFetch = (!startDate && !endDate) || (startDate && endDate);
//         if (!shouldFetch) return;

//         const fetchData = async () => {
//             try {
//                 const url = new URL("http://localhost:3001/api/v1/analytics/donut");
//                 if (sprint && sprint !== "All") url.searchParams.append("sprint", sprint);
//                 if (startDate) url.searchParams.append("startDate", startDate);
//                 if (endDate) url.searchParams.append("endDate", endDate);

//                 const response = await fetch(url.toString());
//                 if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//                 const result = await response.json();
//                 setData(result);
//             } catch (err) {
//                 setError(err instanceof Error ? err.message : "Unknown error");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [sprint, startDate, endDate]);

//     // ✅ Don't forget this
//     return { data: data || [], loading, error };
// }


import { useEffect, useState } from "react";

export interface DonutData {
    name: string;
    prodSuccess: number;
    prodError: number;
    devSuccess: number;
    devError: number;
}

interface UseDonutDataOptions {
    sprint?: string;
    startDate?: string;
    endDate?: string;
}

export default function useDonutData({ sprint, startDate, endDate }: UseDonutDataOptions = {}) {
    const [data, setData] = useState<DonutData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const isSprintValid = sprint && sprint !== "All";
        const isDateRangeValid = startDate && endDate;
        const isNoFilter = (!sprint || sprint === "All") && !startDate && !endDate;

        const shouldFetch = isSprintValid || isDateRangeValid || isNoFilter;

        console.log("🎯 useDonutData shouldFetch =", shouldFetch, {
            sprint,
            startDate,
            endDate,
        });

        if (!shouldFetch) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // const url = new URL("http://localhost:3001/api/v1/analytics/donut");

                const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1//analytics/donut`);

                if (isSprintValid) {
                    url.searchParams.append("sprint", sprint!.trim());
                }

                if (startDate) url.searchParams.append("startDate", startDate);
                if (endDate) url.searchParams.append("endDate", endDate);

                const response = await fetch(url.toString());
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const result = await response.json();
                console.log("✅ fetched donut data:", result);
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sprint, startDate, endDate]);

    return { data: data || [], loading, error };
}
