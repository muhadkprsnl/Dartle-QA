// "use client";
import { z } from "zod";

// Form schemas
export const devSchema = z.object({
    Sprint: z.string().min(2, { message: "Sprint number must be at least 2 characters." }),
    version: z.string().min(1, { message: "Version is required" }),
    dueDate: z.date(),
    Totaltestcase: z.string().min(1, { message: "Testcase is required" }),
    totalbugs: z.string().min(1, { message: "Total bugs is required" }),
    developer1: z.enum(["Ashi", "Vaishnav"]),
    d1_passed: z.string().min(1, { message: "Passed count is required" }),
    d1_failed: z.string().min(1, { message: "Failed count is required" }),
    developer2: z.enum(["Ashi", "Vaishnav"]),
    d2_passed: z.string().min(1, { message: "Passed count is required" }),
    d2_failed: z.string().min(1, { message: "Failed count is required" }),
    closeDate: z.date(),
    feature: z.boolean(),

})

export const prodSchema = z.object({
    P_sprint: z.string().min(2, { message: "Sprint number must be at least 2 characters." }),
    P_version: z.string().min(1, { message: "Version is required" }),
    P_dueDate: z.date(),
    P_totaltestcase: z.string().min(1, { message: "Testcase is required" }),
    P_totalbugs: z.string().min(1, { message: "Total bugs is required" }),
    P_developer1: z.enum(["Ashi", "Vaishnav"]),
    P_d1_passed: z.string().min(1, { message: "Passed count is required" }),
    P_d1_failed: z.string().min(1, { message: "Failed count is required" }),
    P_developer2: z.enum(["Ashi", "Vaishnav"]),
    P_d2_passed: z.string().min(1, { message: "Passed count is required" }),
    P_d2_failed: z.string().min(1, { message: "Failed count is required" }),
    P_closeDate: z.date(),
    P_feature: z.boolean(),
});