"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useRouter } from 'next/navigation'; // for Next.js 13+ App Router
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/dateRangePicker";
import { handleEditFormSubmit, handleCancelClick } from "@/lib/submitHandlers";
import { Suspense } from "react";
import Loading from "../loading";
import { Spinner } from "@/components/ui/spinner";
import { SpinnerWithText } from "@/components/ui/spinnerwithtext";
import { useAuthRedirect } from "@/hooks/auth-redirect"


// Developer type
interface Developer {
    name: string;
    passed: number;
    failed: number;
}

// Sprint data structure
interface SprintData {
    _id: string;
    sprint: string;
    version: string;
    totalTestCases: number;
    totalBugs: number;
    developers: Developer[];
    environment?: string;
    dueDate?: string;     // <-- add this
    closeDate?: string;   // <-- add this
}

// Reusable form input component
const FormInput = ({
    label,
    type = "text",
    name,
    value,
    onChange
}: {
    label: string;
    type?: string;
    name?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
    <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300"
        />
    </div>
);

// Main Component
const SprintDashboard = () => {
    useAuthRedirect()
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabFromURL = searchParams.get("tab");
    // ✅ only declare once
    const [activeTab, setActiveTab] = useState<"dev" | "prod">(
        tabFromURL === "prod" ? "prod" : "dev"
    );
    const [isRedirecting, setIsRedirecting] = useState(false);
    // State setup
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDate, setFilterDate] = useState(""); // expected format: "YYYY-MM-DD"
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingEnv, setEditingEnv] = useState<"dev" | "prod" | null>(null);
    const [editFormData, setEditFormData] = useState<SprintData>({
        _id: "",
        sprint: "",
        version: "",
        totalTestCases: 0,
        totalBugs: 0,
        developers: []
    });

    const [originalRawData, setOriginalRawData] = useState<any[]>([]);
    const [searchSprint, setSearchSprint] = useState("");
    const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
        from: null,
        to: null,
    });
    const [devData, setDevData] = useState<any[]>([]);
    const [prodData, setProdData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);




    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1//api/v1/reports`);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reports`);
                if (!res.ok) throw new Error("Failed to fetch data");
                const data = await res.json();

                setOriginalRawData(data); // store unfiltered original data
                processFetchedData(data, searchSprint, dateRange); // apply initial filters
            } catch (err) {
                setError("Failed to load data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (originalRawData.length > 0) {
            processFetchedData(originalRawData, searchSprint, dateRange);
        }
    }, [searchSprint, dateRange, originalRawData]);

    useEffect(() => {
        console.log("Dev Data:", devData);
        console.log("Prod Data:", prodData);
    }, [devData, prodData]);


    // Create developer object from raw input
    const createDeveloper = (
        name: string,
        passed: string,
        failed: string
    ): Developer => ({
        name: name || "Unnamed Developer",
        passed: parseInt(passed) || 0,
        failed: parseInt(failed) || 0
    });






    const processFetchedData = (




        rawData: any[],
        searchSprint: string,
        dateRange: { from: Date | null; to: Date | null }


    ) => {
        console.log("Raw Fetched Data:", rawData);

        const filterBySprint = (item: any, sprintField: string) =>
            searchSprint === "" || item[sprintField]?.toString().includes(searchSprint);



        const filterByDateRange = (item: any) => {
            if (!dateRange.from || !dateRange.to) return true;

            const filterStart = new Date(dateRange.from);
            const filterEnd = new Date(dateRange.to);
            filterEnd.setHours(23, 59, 59, 999); // include full end day

            let itemStart: Date, itemEnd: Date;

            if (item.environment === "development") {
                itemStart = new Date(item.dueDate);
                itemEnd = new Date(item.closeDate);
            } else if (item.environment === "production") {
                itemStart = new Date(item.P_dueDate);
                itemEnd = new Date(item.P_closeDate);
            } else {
                return false; // Unknown environment
            }

            // Ignore invalid dates like 0001-01-01
            if (itemStart.getFullYear() <= 1 || itemEnd.getFullYear() <= 1) return false;

            const isInRange = itemStart <= filterEnd && itemEnd >= filterStart;
            console.log("Checking date range:", { itemStart, itemEnd, filterStart, filterEnd, isInRange });

            return isInRange;
        };




        const dev = rawData
            .filter((item) => item.environment === "development")
            .filter(
                (item) =>
                    filterBySprint(item, "Sprint") &&
                    filterByDateRange(item)
            )
            .map((item) => ({
                _id: item._id,
                sprint: item.sprint,
                version: item.version,
                totalTestCases: parseInt(item.totalTestCases) || 0,
                totalBugs: parseInt(item.totalBugs) || 0,
                developers: [
                    createDeveloper(item.developer1, item.d1Passed, item.d1Failed),
                    createDeveloper(item.developer2, item.d2Passed, item.d2Failed),
                ].filter((dev) => dev.name && dev.name !== "Unnamed Developer"),
                environment: "development",
                dueDate: item.dueDate, // ✅ Keep this temporarily for sorting
            }))
            .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()) // ✅ Sort newest to oldest
            .map(({ dueDate, ...rest }) => rest); // ✅ Remove dueDate from final state if not needed


        const prod = rawData
            .filter((item) => item.environment === "production")
            .filter(
                (item) =>
                    filterBySprint(item, "Sprint") &&
                    filterByDateRange(item)
            )
            .map((item) => ({
                _id: item._id || item.id,
                sprint: item.sprint,
                version: item.version,
                totalTestCases: parseInt(item.totalTestCases) || 0,
                totalBugs: parseInt(item.totalBugs) || 0,
                developers: [
                    createDeveloper(item.developer1, item.d1Passed, item.d1Failed),
                    createDeveloper(item.developer2, item.d2Passed, item.d2Failed),
                ].filter((dev) => dev.name && dev.name !== "Unnamed Developer"),
                environment: "production",
                dueDate: item.dueDate, // ✅ Include temporarily for sorting
            }))
            .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
            .map(({ dueDate, ...rest }) => rest); // ✅ Remove after sorting


        setDevData(dev);
        setProdData(prod);
        console.log("Filtering by:", searchSprint, dateRange);

    };







    // Handle clicking "Edit"
    // const handleEditClick = (item: SprintData, env: "dev" | "prod") => {
    //     setEditingId(item._id);
    //     setEditingEnv(env);
    //     setEditFormData({ ...item });
    // };

    const handleEditClick = (item: SprintData, env: "dev" | "prod") => {
        setEditingId(item._id);
        setEditingEnv(env);
        setEditFormData({
            ...item,
            dueDate: item.dueDate || "",       // ensure present even if undefined
            closeDate: item.closeDate || ""
        });
    };


    // Handle change in edit form
    // const handleEditFormChange = (
    //     e: React.ChangeEvent<HTMLInputElement>,
    //     devIndex?: number,
    //     field?: keyof Developer
    // ) => {
    //     const value = e.target.value;

    //     if (devIndex !== undefined && field) {
    //         const updatedDevelopers = [...editFormData.developers];
    //         updatedDevelopers[devIndex] = {
    //             ...updatedDevelopers[devIndex],
    //             [field]: field === "passed" || field === "failed" ? parseInt(value) || 0 : value
    //         };
    //         setEditFormData({ ...editFormData, developers: updatedDevelopers });
    //     } else {
    //         setEditFormData({
    //             ...editFormData,
    //             [e.target.name]: value
    //         });
    //     }
    // };


    // Handle change in edit form
    const handleEditFormChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        devIndex?: number,
        field?: keyof Developer
    ) => {
        const value = e.target.value;

        if (devIndex !== undefined && field) {
            const updatedDevelopers = [...editFormData.developers];
            updatedDevelopers[devIndex] = {
                ...updatedDevelopers[devIndex],
                [field]: field === "passed" || field === "failed" ? parseInt(value) || 0 : value
            };
            setEditFormData({ ...editFormData, developers: updatedDevelopers });
        } else {
            const fieldName = e.target.name;
            const updatedValue = e.target.type === "date" ? value : value;

            setEditFormData({
                ...editFormData,
                [fieldName]: updatedValue
            });
        }
    };




    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this report?");
        console.log("Deleting ID:", id);
        if (!confirmDelete) return;

        // const response = await fetch(`http://localhost:3001/api/v1/reports/${id}`, {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reports/${id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                alert("Report deleted successfully!");
                // setIsRedirecting(true); // Step 2: show loading UI
                setTimeout(() => {
                    router.push(`/main/table?tab=${activeTab}`);
                }, 200); // small delay to show animation (optional)

                if (activeTab === "dev") {
                    setDevData((prev) => prev.filter((s) => s._id !== id));
                } else {
                    setProdData((prev) => prev.filter((s) => s._id !== id));
                }
            } else {
                const errorText = await response.text();
                alert("Delete failed: " + errorText);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert("Something went wrong: " + error.message);
            } else {
                alert("An unknown error occurred.");
            }
        }
    };



    // Render sprint table for an environment
    const renderTable = (data: SprintData[], env: "dev" | "prod") => {

        if (data.length === 0) {
            return (
                <div className="text-center text-gray-500 py-4">
                    No {env === "dev" ? "development" : "production"} data available.
                </div>
            );
        }




        return (


            // <div className="overflow-x-auto">


            <div className="overflow-x-auto max-h-[500px] overflow-y-scroll border rounded">

                {/* {isRedirecting && (
                    <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
                        <div className="text-center">
                            <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            <p className="mt-4 text-gray-700 font-medium text-sm">Redirecting to table...</p>
                        </div>
                    </div>
                )} */}

                {isRedirecting && (
                    <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
                        <SpinnerWithText
                            text="Redirecting to form..."
                            size="lg"
                            className="text-gray-700"
                        />
                    </div>
                )}

                <table className="min-w-full text-sm text-left">
                    <thead className="sticky top-0 bg-gray-100 z-10">
                        <tr>
                            <th className="border px-4 py-2">Sprint</th>
                            <th className="border px-4 py-2">Version</th>
                            <th className="border px-4 py-2">Total Test Cases</th>
                            <th className="border px-4 py-2">Total Bugs</th>
                            <th className="border px-4 py-2">Developer</th>
                            <th className="border px-4 py-2">Total</th>
                            <th className="border px-4 py-2">Passed</th>
                            <th className="border px-4 py-2">Failed</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) =>
                            editingId === item._id && editingEnv === env ? (
                                <tr key={`edit-${item._id}`}>
                                    <td colSpan={9} className="bg-gray-50 p-4 border">
                                        {/* <form onSubmit={handleEditFormSubmit}> */}
                                        <form onSubmit={(e) =>
                                            handleEditFormSubmit(
                                                e,
                                                editFormData,
                                                editingEnv,
                                                setDevData,
                                                setProdData,
                                                setEditingId,
                                                setEditingEnv
                                            )
                                        }>
                                            <div className="grid grid-cols-4 gap-4 mb-4">
                                                <FormInput
                                                    label="Sprint"
                                                    name="sprint"
                                                    value={editFormData.sprint}
                                                    onChange={handleEditFormChange}
                                                />
                                                <FormInput
                                                    label="Version"
                                                    name="version"
                                                    value={editFormData.version}
                                                    onChange={handleEditFormChange}
                                                />
                                                {/* //dateupdate */}
                                                <FormInput
                                                    label="Due Date"
                                                    type="date"
                                                    name="dueDate"
                                                    value={editFormData.dueDate?.slice(0, 10) || ""}
                                                    onChange={handleEditFormChange}
                                                />
                                                <FormInput
                                                    label="Close Date"
                                                    type="date"
                                                    name="closeDate"
                                                    value={editFormData.closeDate?.slice(0, 10) || ""}
                                                    onChange={handleEditFormChange}
                                                />
                                                <FormInput
                                                    label="Total Test Cases"
                                                    type="number"
                                                    name="totalTestCases"
                                                    value={editFormData.totalTestCases}
                                                    onChange={handleEditFormChange}
                                                />
                                                <FormInput
                                                    label="Total Bugs"
                                                    type="number"
                                                    name="totalBugs"
                                                    value={editFormData.totalBugs}
                                                    onChange={handleEditFormChange}
                                                />
                                            </div>

                                            {editFormData.developers.map((dev, index) => (
                                                <div
                                                    key={index}
                                                    className="grid grid-cols-3 gap-4 mb-2 bg-gray-100 p-3 rounded"
                                                >
                                                    <FormInput
                                                        label={`Developer ${index + 1}`}
                                                        value={dev.name}
                                                        onChange={(e) =>
                                                            handleEditFormChange(e, index, "name")
                                                        }
                                                    />
                                                    <FormInput
                                                        label="Passed"
                                                        type="number"
                                                        value={dev.passed}
                                                        onChange={(e) =>
                                                            handleEditFormChange(e, index, "passed")
                                                        }
                                                    />
                                                    <FormInput
                                                        label="Failed"
                                                        type="number"
                                                        value={dev.failed}
                                                        onChange={(e) =>
                                                            handleEditFormChange(e, index, "failed")
                                                        }
                                                    />
                                                </div>
                                            ))}

                                            <div className="flex justify-end gap-2 mt-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCancelClick(setEditingId, setEditingEnv) // ✅ pass the actual useState functions
                                                    }
                                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </form>
                                    </td>
                                </tr>
                            ) : (
                                item.developers.map((dev, index) => (
                                    <tr key={`${item._id}-${index}`}>
                                        {index === 0 && (
                                            <td rowSpan={item.developers.length} className="border text-center">{item.sprint}</td>
                                        )}
                                        {index === 0 && (
                                            <td rowSpan={item.developers.length} className="border text-center">{item.version}</td>
                                        )}
                                        {index === 0 && (
                                            <td rowSpan={item.developers.length} className="border text-center">{item.totalTestCases}</td>
                                        )}
                                        {index === 0 && (
                                            <td rowSpan={item.developers.length} className="border text-center">{item.totalBugs}</td>
                                        )}

                                        <td className="border">{dev.name}</td>
                                        <td className="border px-4 py-2 text-center">{dev.passed + dev.failed}</td>
                                        <td className="border">{dev.passed}</td>
                                        <td className="border">{dev.failed}</td>

                                        {index === 0 && (
                                            <td rowSpan={item.developers.length} className="border text-center space-x-2">
                                                <button
                                                    onClick={() => handleEditClick(item, env)}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )
                        )}
                    </tbody>
                </table>
            </div >
        );

    };


    // UI feedback
    if (loading)
        return < div className="flex items-center justify-center h-screen" >
            <SpinnerWithText size="lg" text="Loading sprint data..." />;
        </div >
    // return <div className="p-4 text-center">Loading sprint data...</div>;
    // return <SpinnerWithText size="lg" text="Loading sprint data..." />;
    if (error)
        return <div className="p-4 text-red-500 font-medium">{error}</div>;

    return (

        <Suspense fallback={<Loading />}>


            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Sprint Table</h1>

                <div className="flex justify-between items-center mb-4 gap-4">

                    <div className="flex w-full max-w-sm items-center gap-2">
                        <Input
                            placeholder="Search sprint"
                            value={searchSprint}
                            onChange={(e) => setSearchSprint(e.target.value)}
                        />
                        <Button type="submit" variant="outline">
                            Search
                        </Button>
                    </div>


                    <div className="flex items-center gap-2">
                        <DateRangePicker date={dateRange} setDate={setDateRange} />
                        <Button type="submit" variant="outline">
                            Submit
                        </Button>
                    </div>

                    {/* <div>
                        <button
                            disabled={isRedirecting}
                            onClick={() => {
                                setIsRedirecting(true); // show loading state
                                // const path = activeTab === "dev" ? "/devform" : "/prodform";
                                const path = activeTab === "dev" ? "/main/devform" : "/main/prodform"; // Updated paths
                                router.push(path); // 🔁 go to the correct page
                            }}
                            className={`px-4 py-2 rounded transition text-white ${isRedirecting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {/* {isRedirecting ? "Redirecting..." : `Go to ${activeTab === "dev" ? "Development" : "Production"} Report Form`} */}
                    {/* {isRedirecting ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8z"
                                        />
                                    </svg>
                                    Redirecting...
                                </span>
                            ) : (
                                `Go to ${activeTab === "dev" ? "Development" : "Production"} Report Form`
                            )}

                        </button>

                    </div> */}

                    <div>
                        <button
                            disabled={isRedirecting}
                            onClick={() => {
                                setIsRedirecting(false);
                                const path = activeTab === "dev" ? "/main/devform" : "/main/prodform";
                                router.push(path);
                            }}
                            className={`px-4 py-2 rounded transition text-white ${isRedirecting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {isRedirecting ? (
                                <SpinnerWithText
                                    text="Redirecting..."
                                    className="text-white"
                                    size="sm"
                                />
                            ) : (
                                `Go to ${activeTab === "dev" ? "Development" : "Production"} Report Form`
                            )}
                        </button>
                    </div>


                </div>

                <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "dev" | "prod")}>


                    <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="dev">Development</TabsTrigger>
                        <TabsTrigger value="prod">Production</TabsTrigger>
                    </TabsList>
                    {/* <TabsContent value="dev">{renderTable(devData, "dev")}</TabsContent> */}
                    <TabsContent value="dev">
                        {renderTable(devData, "dev")}
                        <div id="report-form" className="mt-6">
                            {/* your dev form goes here */}
                        </div>
                    </TabsContent>

                    {/* <TabsContent value="prod">{renderTable(prodData, "prod")}</TabsContent> */}
                    <TabsContent value="prod">
                        {renderTable(prodData, "prod")}
                        <div id="report-form" className="mt-6">
                            {/* your dev form goes here */}
                        </div>
                    </TabsContent>

                </Tabs>


            </div >
        </Suspense >
    );

};


export default SprintDashboard;

