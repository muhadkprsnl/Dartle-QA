// "use client";
import { prodSchema } from "@/lib/schema";
import { z } from "zod";

// Production form
// form.ts
export const prodDefaultValues: z.infer<typeof prodSchema> = {
    P_sprint: "",
    P_version: "",
    P_dueDate: new Date(),
    P_totaltestcase: "",
    P_totalbugs: "",
    P_developer1: "Ashi",      // ✅ valid enum
    P_d1_passed: "",
    P_d1_failed: "",
    P_developer2: "Vaishnav",  // ✅ valid enum
    P_d2_passed: "",
    P_d2_failed: "",
    P_closeDate: new Date(),
    P_feature: false,
};


//dev schema
import { devSchema } from "@/lib/schema";

// Development form
export const devDefaultValues: z.infer<typeof devSchema> = {
    Sprint: "",
    version: "",
    dueDate: new Date(),
    Totaltestcase: "",
    totalbugs: "",
    developer1: "Ashi",      // ✅ must match enum exactly
    d1_passed: "",
    d1_failed: "",
    developer2: "Vaishnav",  // ✅ must match enum exactly
    d2_passed: "",
    d2_failed: "",
    closeDate: new Date(),
    feature: false,
};



