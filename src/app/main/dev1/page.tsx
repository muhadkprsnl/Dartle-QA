
"use client";
import { useState } from "react";
import {
    LayoutDashboard,
    Table,
    FileText,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Mock data based on your requirements
const devData = {
    environment: "development",
    Sprint: "dev 5",
    version: "1",
    dueDate: "2025-05-31",
    Totaltestcase: 1,
    totalbugs: 11,
    developer1: "Ashi",
    d1_passed: 1,
    d1_failed: 1,
    developer2: "Vaishnav",
    d2_passed: 1,
    d2_failed: 1,
    closeDate: "2025-06-03",
};

const prodData = {
    environment: "production",
    Sprint: "apr 3",
    version: "3",
    dueDate: "2025-04-03",
    Totaltestcase: 3,
    totalbugs: 3,
    developer1: "Ashi",
    d1_passed: 3,
    d1_failed: 3,
    developer2: "Vaishnav",
    d2_passed: 3,
    d2_failed: 3,
    closeDate: "2025-04-04",
};

const combinedChartData = [
    {
        name: "Test Cases",
        production: prodData.Totaltestcase,
        development: devData.Totaltestcase,
    },
    {
        name: "Bugs",
        production: prodData.totalbugs,
        development: devData.totalbugs,
    },
    {
        name: "Passed",
        production: prodData.d1_passed + prodData.d2_passed,
        development: devData.d1_passed + devData.d2_passed,
    },
    {
        name: "Failed",
        production: prodData.d1_failed + prodData.d2_failed,
        development: devData.d1_failed + devData.d2_failed,
    },
];

export default function Dashboard() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [viewMode, setViewMode] = useState<"production" | "development" | "both">("production");
    const pathname = usePathname();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div
                className={`bg-white border-r transition-all duration-300 ease-in-out ${isCollapsed ? "w-16" : "w-64"
                    }`}
            >
                <div className="flex flex-col h-full p-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto mb-4"
                        onClick={toggleSidebar}
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </Button>

                    <nav className="flex-1">
                        <ul className="space-y-2">
                            <li>
                                <Button
                                    variant={activeTab === "dashboard" ? "secondary" : "ghost"}
                                    className={`w-full justify-start ${isCollapsed ? "justify-center" : ""}`}
                                    onClick={() => setActiveTab("dashboard")}
                                >
                                    <LayoutDashboard className={`${isCollapsed ? "mr-0" : "mr-2"}`} />
                                    {!isCollapsed && "Dashboard"}
                                </Button>
                            </li>
                            {/* <li>
                                <Button
                                    variant={activeTab === "table" ? "secondary" : "ghost"}
                                    className={`w-full justify-start ${isCollapsed ? "justify-center" : ""}`}
                                    onClick={() => setActiveTab("table")}
                                >
                                    <Table className={`${isCollapsed ? "mr-0" : "mr-2"}`} />
                                    {!isCollapsed && "Table View"}
                                </Button>
                            </li> */}

                            < li >
                                <Link href="/table" passHref>
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start ${isCollapsed ? "justify-center" : ""}`}
                                    >
                                        <Table className={`${isCollapsed ? "mr-0" : "mr-2"}`} />
                                        {!isCollapsed && "Table View"}
                                    </Button>
                                </Link>
                            </li>

                            <li>
                                <Link href="/report" passHref>
                                    <Button
                                        variant={pathname === "/report" ? "secondary" : "ghost"}
                                        className={`w-full justify-start ${isCollapsed ? "justify-center" : ""}`}
                                    >
                                        <FileText className={`${isCollapsed ? "mr-0" : "mr-2"}`} />
                                        {!isCollapsed && "Report Form"}
                                    </Button>
                                </Link>
                            </li>

                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8">
                <h1 className="text-3xl font-bold mb-6">Development Dashboard</h1>

                {/* Environment Toggle */}
                <div className="flex items-center justify-between mb-6">
                    <Tabs
                        value={viewMode}
                        onValueChange={(value) => setViewMode(value as "production" | "development" | "both")}
                        className="w-[400px]"
                    >
                        <TabsList>
                            <TabsTrigger value="production">Production</TabsTrigger>
                            <TabsTrigger value="development">Development</TabsTrigger>
                            <TabsTrigger value="both">Compare</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Dashboard Content */}
                {activeTab === "dashboard" && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* KPI Cards */}
                        {(viewMode === "production" || viewMode === "both") && (
                            <>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Production Test Cases
                                        </CardTitle>
                                        <span className="text-xs text-blue-500">PROD</span>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{prodData.Totaltestcase}</div>
                                        <p className="text-xs text-muted-foreground">
                                            Version: {prodData.version}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Production Bugs
                                        </CardTitle>
                                        <span className="text-xs text-blue-500">PROD</span>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{prodData.totalbugs}</div>
                                        <p className="text-xs text-muted-foreground">
                                            Sprint: {prodData.Sprint}
                                        </p>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {(viewMode === "development" || viewMode === "both") && (
                            <>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Development Test Cases
                                        </CardTitle>
                                        <span className="text-xs text-green-500">DEV</span>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{devData.Totaltestcase}</div>
                                        <p className="text-xs text-muted-foreground">
                                            Version: {devData.version}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Development Bugs
                                        </CardTitle>
                                        <span className="text-xs text-green-500">DEV</span>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{devData.totalbugs}</div>
                                        <p className="text-xs text-muted-foreground">
                                            Sprint: {devData.Sprint}
                                        </p>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {/* Comparison Chart */}
                        {(viewMode === "both") && (
                            <div className="col-span-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Production vs Development</CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={combinedChartData}
                                                margin={{
                                                    top: 20,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="production" fill="#3b82f6" name="Production" />
                                                <Bar dataKey="development" fill="#10b981" name="Development" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Developer-specific stats */}
                        {viewMode !== "both" && (
                            <div className="col-span-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            {viewMode === "production" ? "Production" : "Development"} Developer Stats
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg">
                                                        {viewMode === "production" ? prodData.developer1 : devData.developer1}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Passed</p>
                                                            <p className="text-xl font-bold">
                                                                {viewMode === "production" ? prodData.d1_passed : devData.d1_passed}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Failed</p>
                                                            <p className="text-xl font-bold">
                                                                {viewMode === "production" ? prodData.d1_failed : devData.d1_failed}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg">
                                                        {viewMode === "production" ? prodData.developer2 : devData.developer2}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Passed</p>
                                                            <p className="text-xl font-bold">
                                                                {viewMode === "production" ? prodData.d2_passed : devData.d2_passed}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Failed</p>
                                                            <p className="text-xl font-bold">
                                                                {viewMode === "production" ? prodData.d2_failed : devData.d2_failed}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                )}

                {/* Table View */}
                {activeTab === "table" && (
                    <div className="border rounded-lg overflow-hidden">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Metric
                                        </th>
                                        {viewMode !== "development" && (
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Production
                                            </th>
                                        )}
                                        {viewMode !== "production" && (
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Development
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle">Sprint</td>
                                        {viewMode !== "development" && (
                                            <td className="p-4 align-middle">{prodData.Sprint}</td>
                                        )}
                                        {viewMode !== "production" && (
                                            <td className="p-4 align-middle">{devData.Sprint}</td>
                                        )}
                                    </tr>
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle">Version</td>
                                        {viewMode !== "development" && (
                                            <td className="p-4 align-middle">{prodData.version}</td>
                                        )}
                                        {viewMode !== "production" && (
                                            <td className="p-4 align-middle">{devData.version}</td>
                                        )}
                                    </tr>
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle">Total Test Cases</td>
                                        {viewMode !== "development" && (
                                            <td className="p-4 align-middle">{prodData.Totaltestcase}</td>
                                        )}
                                        {viewMode !== "production" && (
                                            <td className="p-4 align-middle">{devData.Totaltestcase}</td>
                                        )}
                                    </tr>
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle">Total Bugs</td>
                                        {viewMode !== "development" && (
                                            <td className="p-4 align-middle">{prodData.totalbugs}</td>
                                        )}
                                        {viewMode !== "production" && (
                                            <td className="p-4 align-middle">{devData.totalbugs}</td>
                                        )}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Report Form */}
                {activeTab === "report" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Generate Report</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Environment</label>
                                        <select className="w-full p-2 border rounded">
                                            <option value="production">Production</option>
                                            <option value="development">Development</option>
                                            <option value="both">Both</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Report Type</label>
                                        <select className="w-full p-2 border rounded">
                                            <option value="summary">Summary</option>
                                            <option value="detailed">Detailed</option>
                                            <option value="developer">Developer-wise</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Time Period</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="date" className="p-2 border rounded" />
                                        <input type="date" className="p-2 border rounded" />
                                    </div>
                                </div>
                                <Button className="w-fit">Generate Report</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div >
    );
}