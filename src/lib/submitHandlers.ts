"use client";
// import { prodSchema } from "@/lib/schema";
import { z } from "zod";
// import { prodDefaultValues } from "@/lib/form";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from 'react';
import { useState } from 'react';
// import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


// // Utility
// function fixDateToMidday(dateStr: string): string {
//     const date = new Date(dateStr);

//     if (isNaN(date.getTime())) {
//         console.error(" Invalid date passed to fixDateToMidday:", dateStr);
//         throw new Error("Invalid date");
//     }

//     date.setHours(12, 0, 0, 0);
//     return date.toISOString();
// }




// Prod submitHandlers.ts
// export async function onSubmitProd(values: any, resetForm: () => void, router: any, setIsRedirecting: (loading: boolean) => void) {

//     console.log('Submitting prod form:', values);
//     try {
//         const response = await fetch('http://localhost:3001/api/reports', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 environment: "production",
//                 P_sprint: values.P_sprint,
//                 P_version: values.P_version,
//                 P_dueDate: fixDateToMidday(values.P_dueDate),
//                 P_totaltestcase: parseInt(values.P_totaltestcase),
//                 P_totalbugs: parseInt(values.P_totalbugs),
//                 P_developer1: values.P_developer1,
//                 P_d1_passed: parseInt(values.P_d1_passed),
//                 P_d1_failed: parseInt(values.P_d1_failed),
//                 P_developer2: values.P_developer2,
//                 P_d2_passed: parseInt(values.P_d2_passed),
//                 P_d2_failed: parseInt(values.P_d2_failed),
//                 P_closeDate: fixDateToMidday(values.P_closeDate)
//             }),
//         });

//         const data = await response.json();
//         if (response.ok) {
//             alert("Report saved with ID: " + data.id);
//             resetForm();
//             setIsRedirecting(true); // Step 2: show loading UI
//             setTimeout(() => {
//                 router.push('/table?tab=prod');
//             }, 200); // small delay to show animation (optional)
//         } else {
//             alert(data.error || 'Failed to save report');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         alert('Network error - please try again');
//     }
// }

// // "use client";
import { devSchema, prodSchema } from "@/lib/schema";
import { devDefaultValues, prodDefaultValues } from "@/lib/form";
import { useRouter } from "next/navigation";

// Utility
function fixDateToMidday(date: string | Date): string {
    const d = typeof date === "string" ? new Date(date) : date;

    if (isNaN(d.getTime())) {
        console.error("❌ Invalid date passed to fixDateToMidday:", date);
        throw new Error("Invalid date");
    }

    d.setHours(12, 0, 0, 0);
    return d.toISOString();
}

// ✅ Dev Form Submit Handler
export async function onSubmitDev(
    values: z.infer<typeof devSchema>,
    resetForm: () => void,
    router: any,
    setIsRedirecting: (loading: boolean) => void
) {
    console.log("📤 Submitting Dev Form:", values);

    try {
        // const response = await fetch("http://localhost:3001/api/devform", {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/devform`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                environment: "development",
                sprint: values.Sprint,
                version: values.version,
                dueDate: fixDateToMidday(values.dueDate),
                totalTestCases: parseInt(values.Totaltestcase),
                totalBugs: parseInt(values.totalbugs),
                developer1: values.developer1,
                d1Passed: parseInt(values.d1_passed),
                d1Failed: parseInt(values.d1_failed),
                developer2: values.developer2,
                d2Passed: parseInt(values.d2_passed),
                d2Failed: parseInt(values.d2_failed),
                closeDate: fixDateToMidday(values.closeDate),
                feature: values.feature ?? false,

            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Report saved with ID: " + data.id);
            resetForm();
            setIsRedirecting(true);
            setTimeout(() => router.push("/main/table?tab=dev"), 200);
        } else {
            alert(data.error || "Failed to save dev report.");
        }
    } catch (error) {
        console.error("❌ Dev Submit Error:", error);
        alert("Network error - please try again");
    }
}

// "use client";

// import { z } from "zod";
// import { devSchema, prodSchema } from "@/lib/schema";
// import { useRouter } from "next/navigation";

// // Enhanced date utility with better error handling
// function fixDateToMidday(date: string | Date): string {
//     try {
//         const d = typeof date === "string" ? new Date(date) : new Date(date);

//         if (isNaN(d.getTime())) {
//             throw new Error(`Invalid date: ${ date }`);
//         }

//         // Clone to avoid mutating original date
//         const adjustedDate = new Date(d);
//         adjustedDate.setHours(12, 0, 0, 0);
//         return adjustedDate.toISOString();
//     } catch (error) {
//         console.error("Date processing error:", error);
//         throw new Error("Invalid date format");
//     }
// }

// // Safe number conversion with validation
// const safeParseNumber = (value: string | number, fieldName: string): number => {
//     const num = typeof value === 'string' ? parseInt(value, 10) : value;
//     if (isNaN(num)) {
//         throw new Error(`Invalid number for ${ fieldName }`);
//     }
//     return num;
// };

// // ✅ Enhanced Dev Form Submit Handler
// export async function onSubmitDev(
//     values: z.infer<typeof devSchema>,
//     resetForm: () => void,
//     router: ReturnType<typeof useRouter>,
//     setIsRedirecting: (loading: boolean) => void
// ): Promise<void> {
//     console.log("📤 Submitting Dev Form:", values);

//     try {
//         // Validate all numbers before submission
//         const submissionData = {
//             environment: "development" as const,
//             sprint: values.Sprint,
//             version: values.version,
//             dueDate: fixDateToMidday(values.dueDate),
//             totalTestCases: safeParseNumber(values.Totaltestcase, "totalTestCases"),
//             totalBugs: safeParseNumber(values.totalbugs, "totalBugs"),
//             developer1: values.developer1,
//             d1Passed: safeParseNumber(values.d1_passed, "d1Passed"),
//             d1Failed: safeParseNumber(values.d1_failed, "d1Failed"),
//             developer2: values.developer2,
//             d2Passed: safeParseNumber(values.d2_passed, "d2Passed"),
//             d2Failed: safeParseNumber(values.d2_failed, "d2Failed"),
//             closeDate: fixDateToMidday(values.closeDate),
//         };

//         // Verify calculated total matches sum
//         const calculatedTotal = submissionData.d1Passed + submissionData.d1Failed +
//             submissionData.d2Passed + submissionData.d2Failed;

//         if (calculatedTotal !== submissionData.totalBugs) {
//             throw new Error("Bug count mismatch - please recalculate totals");
//         }

//         const response = await fetch("http://localhost:3001/api/devform", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "X-Requested-With": "XMLHttpRequest"
//             },
//             body: JSON.stringify(submissionData),
//         });

//         if (!response.ok) {
//             const errorData = await response.json().catch(() => ({}));
//             throw new Error(errorData.message || `HTTP error! status: ${ response.status } `);
//         }

//         const data = await response.json();

//         // Success handling
//         console.log("✅ Report saved:", data);
//         resetForm();
//         setIsRedirecting(true);

//         // Optional: Add success notification instead of alert
//         setTimeout(() => {
//             router.push("/table?tab=dev");
//             // Consider using Next.js navigation events instead of timeout
//         }, 200);

//     } catch (error) {
//         console.error("❌ Submission Error:", error);

//         // Enhanced error handling
//         const errorMessage = error instanceof Error
//             ? error.message
//             : "An unexpected error occurred";

//         // Consider using a toast notification instead of alert
//         alert(`Submission failed: ${ errorMessage } `);

//         // Re-throw for additional error handling if needed
//         throw error;
//     }
// }

// ✅ Prod Form Submit Handler
export async function onSubmitProd(
    values: z.infer<typeof prodSchema>,
    resetForm: () => void,
    router: any,
    setIsRedirecting: (loading: boolean) => void
) {
    console.log("📤 Submitting Prod Form:", values);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prodform`, {
            // const response = await fetch("http://localhost:3001/api/prodform", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                environment: "production",
                sprint: values.P_sprint,
                version: values.P_version,
                dueDate: fixDateToMidday(values.P_dueDate),
                totalTestCases: parseInt(values.P_totaltestcase),
                totalBugs: parseInt(values.P_totalbugs),
                developer1: values.P_developer1,
                d1Passed: parseInt(values.P_d1_passed),
                d1Failed: parseInt(values.P_d1_failed),
                developer2: values.P_developer2,
                d2Passed: parseInt(values.P_d2_passed),
                d2Failed: parseInt(values.P_d2_failed),
                closeDate: fixDateToMidday(values.P_closeDate),
                feature: values.P_feature ?? false,// ✅ Add this
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Report saved with ID: " + data.id);
            resetForm();
            setIsRedirecting(true);
            setTimeout(() => router.push("/main/table?tab=prod"), 200);
        } else {
            alert(data.error || "Failed to save prod report.");
        }
    } catch (error) {
        console.error("❌ Prod Submit Error:", error);
        alert("Network error - please try again");
    }
}



import { Dispatch, SetStateAction } from "react";

// Developer type
interface Developer {
    name: string;
    passed: number;
    failed: number;
}

// Optional: re-declare if not shared from types.ts
interface SprintData {
    _id: string;
    sprint: string;
    version: string;
    totalTestCases: number;
    totalBugs: number;
    developers: Developer[];
    environment?: string;
    dueDate?: string | Date;
    closeDate?: string | Date;
    createdAt?: string | Date;
}

export async function handleEditFormSubmit(
    e: React.FormEvent,
    editFormData: SprintData,
    editingEnv: "dev" | "prod" | null,
    setDevData: Dispatch<SetStateAction<SprintData[]>>,
    setProdData: Dispatch<SetStateAction<SprintData[]>>,
    setEditingId: (id: string | null) => void,
    setEditingEnv: (env: "dev" | "prod" | null) => void
) {
    e.preventDefault();

    // Coerce all fields to correct types
    const updatedSprint: SprintData = {
        ...editFormData,
        totalTestCases: parseInt(editFormData.totalTestCases.toString()),
        totalBugs: parseInt(editFormData.totalBugs.toString()),
        developers: editFormData.developers.map((dev) => ({
            ...dev,
            passed: parseInt(dev.passed.toString()),
            failed: parseInt(dev.failed.toString())
        }))
    };

    // Extract developers back to individual fields for Go backend compatibility
    const payload = {
        sprint: updatedSprint.sprint,
        version: updatedSprint.version,
        totalTestCases: updatedSprint.totalTestCases,
        totalBugs: updatedSprint.totalBugs,
        environment: updatedSprint.environment,
        dueDate: updatedSprint.dueDate,
        closeDate: updatedSprint.closeDate,
        createdAt: updatedSprint.createdAt || new Date().toISOString(),

        developer1: updatedSprint.developers[0]?.name || "",
        d1Passed: updatedSprint.developers[0]?.passed || 0,
        d1Failed: updatedSprint.developers[0]?.failed || 0,

        developer2: updatedSprint.developers[1]?.name || "",
        d2Passed: updatedSprint.developers[1]?.passed || 0,
        d2Failed: updatedSprint.developers[1]?.failed || 0
    };

    try {
        // const response = await fetch(
        //     `http://localhost:3001/api/v1/reports/${updatedSprint._id}`,
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reports/${updatedSprint._id}`,

            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }
        );

        const result = await response.text();

        if (response.ok) {
            alert("✅ Update successful!");

            const mergedSprint: SprintData = {
                ...updatedSprint,
                developers: [
                    {
                        name: payload.developer1,
                        passed: payload.d1Passed,
                        failed: payload.d1Failed
                    },
                    {
                        name: payload.developer2,
                        passed: payload.d2Passed,
                        failed: payload.d2Failed
                    }
                ]
            };

            // Update UI state
            if (editingEnv === "dev") {
                setDevData((prev) =>
                    prev.map((s) => (s._id === updatedSprint._id ? mergedSprint : s))
                );
            } else {
                setProdData((prev) =>
                    prev.map((s) => (s._id === updatedSprint._id ? mergedSprint : s))
                );
            }

            setEditingId(null);
            setEditingEnv(null);
        } else {
            alert("❌ Update failed: " + result);
        }
    } catch (err) {
        console.error("❌ Network Error updating report:", err);
        alert("Network error.");
    }
}



export function handleCancelClick(
    setEditingId: (id: string | null) => void,
    setEditingEnv: (env: "dev" | "prod" | null) => void
) {
    setEditingId(null);
    setEditingEnv(null);
}
