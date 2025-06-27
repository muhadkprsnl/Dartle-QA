"use client";
import { useEffect, useState, useMemo } from "react";
import {
    LayoutDashboard, Table, FileText, ChevronRight, ChevronLeft, CircleAlert, CircleCheck
} from "lucide-react";
import {
    PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from "recharts";
import useDonutData from '@/hooks/useReport'; // ✅ ensure this points to updated file
import DonutChart from "@/components/ui/donutChart";
import { SprintComboBox } from "@/components/ui/sprint-combobox"; // Import the SprintComboBox component
import { DeveloperComboBox } from "@/components/ui/developer-combobox";
import { Spinner } from "@/components/ui/spinner";
import { SpinnerWithText } from "@/components/ui/spinnerwithtext";
import { Suspense } from "react";
import Loading from "../loading";
import { DateRange } from "react-day-picker"
import { format } from "date-fns";
import { useSummary } from "@/hooks/useSummary";
import { useSprintErrorComparison } from "@/hooks/usesprintError";
import { useReleaseData } from "@/hooks/useRelease";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Monitor, FlaskConical } from "lucide-react"
import { useAuthRedirect } from "@/hooks/auth-redirect"

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
type StatusFilter = "all" | "on-time" | "delayed";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';





const COLORS = {
    prod: ["#3b82f6", "#93c5fd"],
    dev: ["#10b981", "#6ee7b7"],
    error: ["#ef4444", "#fca5a5"],
    success: ["#22c55e", "#86efac"],
    bl1: ["#3b82f6", "#93c5fd"]
};

export default function Dashboard() {
    // All hooks at the top (no conditional calls)
    // const loading = useAuthRedirect()

    // if (loading) return <Loading /> // ✅ Show spinner while checking token

    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [viewMode, setViewMode] = useState<"development" | "production" | "both">("both");
    const [selectedSprint, setSelectedSprint] = useState<string>("All");
    const [selectedDeveloper, setSelectedDeveloper] = useState<string>("All");
    const [dateRange, setDateRange] = useState<DateRange>();
    const [showAllReleases, setShowAllReleases] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(8);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    // Data hooks
    const hasFullDateRange = dateRange?.from && dateRange?.to;
    let startDateStr: string | undefined;
    let endDateStr: string | undefined;

    if (dateRange?.from && dateRange?.to && dateRange.from.getTime() !== dateRange.to.getTime()) {
        startDateStr = format(dateRange.from, "yyyy-MM-dd");
        endDateStr = format(dateRange.to, "yyyy-MM-dd");
    }

    const { data, loading, error } = useDonutData({
        sprint: selectedSprint,
        startDate: startDateStr,
        endDate: endDateStr,
    });

    // const {
    //     data,
    //     loading: donutLoading, // ✅ rename this
    //     error: donutError
    // } = useDonutData({
    //     sprint: selectedSprint,
    //     startDate: startDateStr,
    //     endDate: endDateStr,
    // });


    const todayStr = format(new Date(), "yyyy-MM-dd");
    const { summary, loading: summaryLoading, error: summaryError } = useSummary(
        viewMode,
        startDateStr || "2025-01-01",
        endDateStr || todayStr,
        selectedSprint
    );

    // const { sprints, loading: sprintLoading, error: sprintError } = useSprintErrorComparison(
    //     startDateStr || "2025-01-01",
    //     endDateStr || todayStr
    // );

    const {
        sprints,
        sprintLoading,  // Use the actual property name
        sprintError     // Use the actual property name
    } = useSprintErrorComparison(
        startDateStr || "2025-01-01",
        endDateStr || todayStr
    );

    const { releases, loading: releaseLoading, error: releaseError, hasMore, loadMore } =
        useReleaseData({ statusFilter });

    // Memoized values
    const sortedSprints = useMemo(() => [...sprints].sort((a, b) => Number(a.name) - Number(b.name)), [sprints]);
    const parsedStartDate = useMemo(() => startDateStr ? new Date(startDateStr) : new Date("2025-01-01"), [startDateStr]);
    const parsedEndDate = useMemo(() => endDateStr ? new Date(endDateStr) : new Date(), [endDateStr]);
    const sortedReleases = useMemo(() => [...releases].sort((a, b) => {
        const dateA = new Date(a.closeDate || a.releaseDate || 0).getTime();
        const dateB = new Date(b.closeDate || b.releaseDate || 0).getTime();
        return dateB - dateA;
    }), [releases]);

    const visibleReleases = useMemo(() => sortedReleases.slice(0, visibleCount), [sortedReleases, visibleCount]);
    const developers = data || [];

    // Effects
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Early return only after all hooks are called
    // if (loading) return <SpinnerWithText />;
    // if (error) return <div>Error: {error}</div>;
    if (sprintLoading) return <SpinnerWithText />;
    if (sprintError) return <div>Error: {sprintError}</div>;
    if (hasFullDateRange && !developers.length) return <div>No developer data available</div>;
    if (summaryLoading) return <SpinnerWithText size="lg" text="Loading summary data..." />;
    if (summaryError) return <div>Error loading summary: {summaryError}</div>;

    // Helper functions
    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const navigateToTable = () => router.push('/table');

    const calculatePercentage = (value: number, total: number): number => {
        const sum = value + total;
        return sum > 0 ? Math.round((value / sum) * 100) : 0;
    };

    const filteredDevelopers = developers.filter((dev) => {
        const nameMatch = selectedDeveloper === "All" || dev.name === selectedDeveloper;
        const envMatch = viewMode === "both" ||
            (viewMode === "development" && dev.devSuccess + dev.devError > 0) ||
            (viewMode === "production" && dev.prodSuccess + dev.prodError > 0);
        return nameMatch && envMatch;
    }).map((dev) => ({
        ...dev,
        avatarUrl: getAvatarUrl(dev.name)
    }));

    if (isLoading) {
        return (
            // <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
            <div className="flex-1 flex items-center justify-center h-full">
                {/* <Spinner className="w-8 h-8" /> */}
                <SpinnerWithText className="w-8 h-8" size="lg" text="Loading..." />;
            </div>
        );
    }


    return (
        <Suspense fallback={<Loading />}>

            <div className="flex h-screen bg-gray-50">

                {/* Main */}
                < div className="flex-1 overflow-auto p-8" >
                    {/* Header Filters */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Dashboard</h1>

                        <div className="flex space-x-4">
                            <SprintComboBox
                                selectedSprint={selectedSprint}
                                setSelectedSprint={setSelectedSprint}
                                dateRange={dateRange}
                                setDateRange={setDateRange}
                            />
                            <DeveloperComboBox
                                selectedDeveloper={selectedDeveloper}
                                setSelectedDeveloper={setSelectedDeveloper}
                            />
                            {/* Future: Add date filters */}
                            {/* <input type="date" className="p-2 border rounded-md" /> */}
                        </div>
                    </div >

                    {/* Environment Toggle */}
                    < div className="flex justify-center mb-8" >
                        <div className="inline-flex rounded-md shadow-sm">
                            <button onClick={() => setViewMode("development")} className={`px-4 py-2 text-sm font-medium ${viewMode === "development" ? "bg-green-500 text-white" : "bg-white text-gray-700"}`}>
                                Development
                            </button>
                            <button onClick={() => setViewMode("production")} className={`px-4 py-2 text-sm font-medium ${viewMode === "production" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}>
                                Production
                            </button>
                            <button onClick={() => setViewMode("both")} className={`px-4 py-2 text-sm font-medium ${viewMode === "both" ? "bg-purple-500 text-white" : "bg-white text-gray-700"}`}>
                                Both
                            </button>
                        </div>
                    </div >

                    {/* Summary Section */}
                    < div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
                        {(viewMode === "development" || viewMode === "both") && (
                            <div className="bg-white p-4 border rounded-lg">
                                <h3 className="font-semibold text-lg mb-2 flex items-center">
                                    <Badge className="bg-[#22c55e] text-white">Dev</Badge>
                                    <span className="mr-2"></span> Dev Summary
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><p className="text-sm text-gray-500">Total Bugs</p><p className="text-2xl font-bold">{summary.dev.totalBugs}</p></div>
                                    <div><p className="text-sm text-gray-500">Success Rate</p><p className="text-2xl font-bold">{summary.dev.successRate}%</p></div>
                                    <div><p className="text-sm text-gray-500">Error Rate</p><p className="text-2xl font-bold">{summary.dev.errorRate}%</p></div>
                                    <div><p className="text-sm text-gray-500">Delays</p><p className="text-2xl font-bold">{summary.dev.delays}</p></div>
                                </div>
                            </div>
                        )
                        }
                        {
                            (viewMode === "production" || viewMode === "both") && (
                                <div className="bg-white p-4 border rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2 flex items-center">
                                        <Badge className="bg-[#3b82f6] text-white">Prod</Badge>
                                        <span className="mr-2"></span> Prod Summary
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><p className="text-sm text-gray-500">Total Bugs</p><p className="text-2xl font-bold">{summary.prod.totalBugs}</p></div>
                                        <div><p className="text-sm text-gray-500">Success Rate</p><p className="text-2xl font-bold">{summary.prod.successRate}%</p></div>
                                        <div><p className="text-sm text-gray-500">Error Rate</p><p className="text-2xl font-bold">{summary.prod.errorRate}%</p></div>
                                        <div><p className="text-sm text-gray-500">Delays</p><p className="text-2xl font-bold">{summary.prod.delays}</p></div>
                                    </div>
                                </div>
                            )
                        }
                    </div >

                    {/* Bug Status Charts */}
                    < div className="mb-8" >
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="mr-2">📊</span> Developers performance
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredDevelopers.map((dev) => (
                                <div key={dev.name} className="grid grid-cols-2 gap-4">
                                    {(viewMode === "development" || viewMode === "both") && (
                                        <DonutChart
                                            title={dev.name}
                                            environment="dev"
                                            successRate={calculatePercentage(dev.devSuccess, dev.devError)}
                                            errorRate={calculatePercentage(dev.devError, dev.devSuccess)}
                                            colors={COLORS.success}
                                            avatarUrl={dev.avatarUrl} // pass avatar
                                        />
                                    )}
                                    {(viewMode === "production" || viewMode === "both") && (
                                        <DonutChart
                                            title={dev.name}
                                            environment="prod"
                                            successRate={calculatePercentage(dev.prodSuccess, dev.prodError)}
                                            errorRate={calculatePercentage(dev.prodError, dev.prodSuccess)}
                                            colors={COLORS.bl1}
                                            avatarUrl={dev.avatarUrl} // pass avatar
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div >

                    {/* Sprint Comparison */}
                    < div className="mb-8" >
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="mr-2">📈</span> Sprint error
                        </h2>
                        <div className="bg-white p-4 rounded-lg border">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    {/* <LineChart data={sprints}> */}
                                    <LineChart data={sortedSprints}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        {(viewMode === "development" || viewMode === "both") && (
                                            <Line type="monotone" dataKey="devError" stroke="#10b981" name="Development" strokeWidth={2} />
                                        )}
                                        {(viewMode === "production" || viewMode === "both") && (
                                            <Line type="monotone" dataKey="prodError" stroke="#3b82f6" name="Production" strokeWidth={2} />
                                        )}
                                    </LineChart>
                                </ResponsiveContainer >
                            </div>
                        </div>
                    </div >


                    {/* Release Tracking */}
                    < div className="mb-8" >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                            <h2 className="text-xl font-semibold flex items-center">
                                <span className="mr-2">📋</span> Release tracking
                            </h2>
                            {/* ShadCN Dropdown for Status Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full md:w-auto">
                                        Filter: {statusFilter === "all" ? "All Releases" : statusFilter === "delayed" ? "Delayed" : "On Time"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter("on-time")}>On Time</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter("delayed")}>Delayed</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="overflow-x-auto border rounded-lg">

                            {releaseLoading && releases.length === 0 ? (
                                <SpinnerWithText />
                            ) : releases.length === 0 ? (
                                <p className="text-center text-gray-500 py-6">🚫 No release data found.</p>
                            ) : (

                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Version</th>
                                            <th className="px-4 py-2 text-left">Env</th>
                                            <th className="px-4 py-2 text-left">Release Date</th>
                                            <th className="px-4 py-2 text-left">Close Date</th>
                                            <th className="px-4 py-2 text-left">Duration</th>
                                            <th className="px-4 py-2 text-left">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {releases
                                            .filter(release =>
                                                viewMode === "both" ||
                                                (viewMode === "production" && release.env === "production") ||
                                                (viewMode === "development" && release.env === "development")
                                            )
                                            .map((release, index) => {
                                                const releaseDate = release.releaseDate ? new Date(release.releaseDate) : null;
                                                const closeDate = release.closeDate ? new Date(release.closeDate) : null;
                                                const duration =
                                                    releaseDate && closeDate
                                                        ? Math.ceil((closeDate.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24))
                                                        : "-";

                                                return (
                                                    <tr key={index} className="border-t hover:bg-gray-50">
                                                        <td className="px-4 py-2">{release.version}</td>
                                                        <td className="px-4 py-2">
                                                            {release.env === "production" ? (
                                                                <Badge className="bg-[#3b82f6] text-white">Prod</Badge>
                                                            ) : (
                                                                <Badge className="bg-[#22c55e] text-white">Dev</Badge>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2">{release.releaseDate || "N/A"}</td>
                                                        <td className="px-4 py-2">{release.closeDate || "N/A"}</td>
                                                        <td className="px-4 py-2">
                                                            {duration !== "-" ? `${duration} Day${duration !== 1 ? "s" : ""}` : "N/A"}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {release.status === "delayed" ? (
                                                                <span className="text-red-500 flex items-center">
                                                                    <CircleAlert className="mr-1" size={16} /> Delayed
                                                                </span>
                                                            ) : (
                                                                <span className="text-green-500 flex items-center">
                                                                    <CircleCheck className="mr-1" size={16} /> On Time
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {
                            hasMore ? (
                                <div className="mt-4 text-center">
                                    <Button onClick={loadMore} className="w-full max-w-xs">
                                        {releaseLoading && <Spinner className="w-4 h-4" />}
                                        {releaseLoading ? "Loading..." : "View More"}
                                    </Button>
                                </div>
                            ) : (
                                visibleReleases.length > 0 && (
                                    <p className="text-center text-gray-500 mt-4">🎉 All releases are shown.</p>
                                )
                            )
                        }
                        {
                            visibleReleases.length === 0 && !loading && (
                                <p className="text-center text-gray-500 mt-4">🚫 No release data found.</p>
                            )
                        }

                        {
                            releaseLoading && (
                                <div className="animate-spin text-muted-foreground">
                                    <Spinner className="w-5 h-5" />
                                </div>
                            )
                        }

                        {releaseLoading && <p className="text-center mt-2 text-sm text-muted-foreground">Loading...</p>}
                        {releaseError && <p className="text-center mt-2 text-sm text-red-500">{error}</p>}







                    </div >

                </div >

            </div >
        </Suspense >


    )
}

// Helper function outside component
function getAvatarUrl(name: string): string {
    switch (name.toLowerCase()) {
        case "ashi": return "https://github.com/shadcn.png";
        case "vaishnav": return "https://github.com/evilrabbit.png";
        default: return "https://github.com/evilrabbit.png";
    }
}
