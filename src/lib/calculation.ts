"use client";

import { UseFormReturn, Path } from "react-hook-form";
import { z, ZodType } from "zod";
import { devSchema, prodSchema } from "./schema";

export type BugCountParams = {
    d1Passed: string | number;
    d1Failed: string | number;
    d2Passed: string | number;
    d2Failed: string | number;
};

export type FieldMap<T extends ZodType> = {
    d1Passed: Path<z.infer<T>>;
    d1Failed: Path<z.infer<T>>;
    d2Passed: Path<z.infer<T>>;
    d2Failed: Path<z.infer<T>>;
    totalBugs: Path<z.infer<T>>;
    totalTestCases: Path<z.infer<T>>; // Added this field
};

export type CalculationUtils<T extends ZodType> = {
    calculateTotals: () => void;
    getCurrentBugCounts: () => BugCountParams;
};

const safeToNumber = (value: string | number): number => {
    const num = typeof value === "string" ? parseInt(value, 10) : value;
    return isNaN(num) ? 0 : num;
};

export function setupBugCalculation<T extends ZodType>(
    form: UseFormReturn<z.infer<T>>,
    fieldMap: FieldMap<T>
): CalculationUtils<T> {
    const { watch, setValue, getValues } = form;

    const getCurrentValues = (): BugCountParams => {
        const values = getValues();
        return {
            d1Passed: values[fieldMap.d1Passed],
            d1Failed: values[fieldMap.d1Failed],
            d2Passed: values[fieldMap.d2Passed],
            d2Failed: values[fieldMap.d2Failed],
        };
    };

    const calculateTotals = () => {
        const { d1Passed, d1Failed, d2Passed, d2Failed } = getCurrentValues();
        const totalBugs = calculateTotalBugsFromParams({ d1Passed, d1Failed, d2Passed, d2Failed });
        const totalTestCases = totalBugs * 3; // Calculate test cases as bugs * 3

        setValue(fieldMap.totalBugs, totalBugs.toString() as never, { shouldValidate: true });
        setValue(fieldMap.totalTestCases, totalTestCases.toString() as never, { shouldValidate: true });
    };

    watch((_, { name }) => {
        if (name && [
            fieldMap.d1Passed,
            fieldMap.d1Failed,
            fieldMap.d2Passed,
            fieldMap.d2Failed
        ].includes(name as Path<z.infer<T>>)) {
            calculateTotals();
        }
    });

    return {
        calculateTotals,
        getCurrentBugCounts: getCurrentValues,
    };
}

export const calculateTotalBugsFromParams = (params: BugCountParams): number => {
    return (
        safeToNumber(params.d1Passed) +
        safeToNumber(params.d1Failed) +
        safeToNumber(params.d2Passed) +
        safeToNumber(params.d2Failed)
    );
};

export function prepareBugDataForSubmission<T extends ZodType>(
    values: z.infer<T>,
    fieldMap: FieldMap<T>
) {
    return {
        d1Passed: safeToNumber(values[fieldMap.d1Passed]),
        d1Failed: safeToNumber(values[fieldMap.d1Failed]),
        d2Passed: safeToNumber(values[fieldMap.d2Passed]),
        d2Failed: safeToNumber(values[fieldMap.d2Failed]),
        totalBugs: safeToNumber(values[fieldMap.totalBugs]),
        totalTestCases: safeToNumber(values[fieldMap.totalTestCases]), // Added this field
    };
}

export const validateBugCounts = (params: BugCountParams): boolean => {
    return [
        params.d1Passed,
        params.d1Failed,
        params.d2Passed,
        params.d2Failed,
    ].every((value) => {
        const num = safeToNumber(value);
        return !isNaN(num) && num >= 0;
    });
};

export const devFieldMap: FieldMap<typeof devSchema> = {
    d1Passed: "d1_passed",
    d1Failed: "d1_failed",
    d2Passed: "d2_passed",
    d2Failed: "d2_failed",
    totalBugs: "totalbugs",
    totalTestCases: "Totaltestcase" // Added this mapping
};

export const prodFieldMap: FieldMap<typeof prodSchema> = {
    d1Passed: "P_d1_passed",
    d1Failed: "P_d1_failed",
    d2Passed: "P_d2_passed",
    d2Failed: "P_d2_failed",
    totalBugs: "P_totalbugs",
    totalTestCases: "P_totaltestcase" // Added this mapping
};