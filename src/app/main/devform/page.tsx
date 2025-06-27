"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { prodSchema } from "@/lib/schema";
import { devSchema } from "@/lib/schema";
import { prodDefaultValues } from "@/lib/form";
import { devDefaultValues } from "@/lib/form";
import { onSubmitProd } from "@/lib/submitHandlers";
import { onSubmitDev } from "@/lib/submitHandlers";
import {
    setupBugCalculation,
    devFieldMap,
    prodFieldMap
} from "@/lib/calculation";
import Loading from "../loading";
import { useAuthRedirect } from "@/hooks/auth-redirect"



export default function NewReportPage() {
    // const loading = useAuthRedirect()

    // if (loading) return <Loading /> // ✅ Show spinner while checking token

    const [activeTab, setActiveTab] = useState("dev");
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);


    const devForm = useForm<z.infer<typeof devSchema>>({
        resolver: zodResolver(devSchema),
        defaultValues: devDefaultValues,
    });

    const prodForm = useForm<z.infer<typeof prodSchema>>({
        resolver: zodResolver(prodSchema),
        defaultValues: prodDefaultValues,
    });

    const { calculateTotals: calculateDevTotals } = setupBugCalculation(devForm, devFieldMap);




    // Date picker component
    const DatePicker = ({ field, label }: { field: any, label: string }) => {
        const [isOpen, setIsOpen] = React.useState(false);

        return (
            <FormItem className="flex flex-col">
                <FormLabel>{label}*</FormLabel>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                            >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                                field.onChange(date);
                                setIsOpen(false);
                            }}
                            disabled={(date: Date) => date > new Date()}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <FormMessage />
            </FormItem>
        );
    };

    // Developer select component
    const DeveloperSelect = ({ control, name, label }: { control: any, name: string, label: string }) => (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Ashi">Ashi</SelectItem>
                            <SelectItem value="Vaishnav">Vaishnav</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">New QA Report</h1>

            <Tabs defaultValue="dev" className="w-full">
                <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="dev" disabled>
                        Development
                    </TabsTrigger>
                </TabsList>


                {/* Ui animation */}
                {isRedirecting && (
                    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
                        <div className="text-center">
                            <svg className="animate-spin h-8 w-8 mx-auto text-blue-600" viewBox="0 0 24 24">
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
                            <p className="mt-4 text-sm font-medium text-gray-700">Redirecting to table page...</p>
                        </div>
                    </div>
                )}



                {/* Development Form */}
                <TabsContent value="dev">
                    <Form {...devForm}>
                        <form
                            onSubmit={devForm.handleSubmit((values) =>
                                onSubmitDev(values, devForm.reset, router, setIsRedirecting)
                            )}
                            className="space-y-6"
                        >
                            {/* Sprint and Version */}
                            <div className="flex gap-4">
                                <FormField
                                    control={devForm.control}
                                    name="version"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Version*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter version" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={devForm.control}
                                    name="Sprint"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Sprint number*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter sprint number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex gap-4">
                                {/* Due Date */}
                                <FormField

                                    control={devForm.control}
                                    name="dueDate"
                                    render={({ field }) => (
                                        <DatePicker field={field} label="Release date" />
                                    )}
                                />
                                <FormField
                                    control={devForm.control}
                                    name="closeDate"
                                    render={({ field }) => (
                                        <DatePicker field={field} label="Close date" />
                                    )}
                                />
                                <FormField
                                    control={devForm.control}
                                    name="feature"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-2 mt-4">
                                            <FormControl>
                                                <input
                                                    type="checkbox"
                                                    checked={field.value}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                />
                                            </FormControl>
                                            <FormLabel>Feature</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Developer 1 Section */}
                            <DeveloperSelect
                                control={devForm.control}
                                name="developer1"
                                label="Developer"
                            />
                            <div className="flex gap-4">
                                <FormField
                                    control={devForm.control}
                                    name="d1_passed"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Passed*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Passed bugs count"
                                                    {...field}
                                                    type="number"
                                                    min="0"
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        // Trigger calculation on change
                                                        calculateDevTotals(); // Changed from calculateTotalBugs
                                                        // Ensure we have a valid number
                                                        if (!e.target.value) devForm.setValue("d1_passed", "0");
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={devForm.control}
                                    name="d1_failed"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Failed*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Failed bugs count"
                                                    {...field}
                                                    type="number"
                                                    min="0"
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        calculateDevTotals(); // Changed from calculateTotalBugs
                                                        if (!e.target.value) devForm.setValue("d1_failed", "0");
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Developer 2 Section */}
                            <DeveloperSelect
                                control={devForm.control}
                                name="developer2"
                                label="Developer"
                            />
                            <div className="flex gap-4">
                                <FormField
                                    control={devForm.control}
                                    name="d2_passed"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Passed*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Passed bugs count"
                                                    {...field}
                                                    type="number"
                                                    min="0"
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        calculateDevTotals(); // Changed from calculateTotalBugs
                                                        if (!e.target.value) devForm.setValue("d2_passed", "0");
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={devForm.control}
                                    name="d2_failed"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Failed*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Failed bugs count"
                                                    {...field}
                                                    type="number"
                                                    min="0"
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        calculateDevTotals(); // Changed from calculateTotalBugs
                                                        if (!e.target.value) devForm.setValue("d2_failed", "0");
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Test Case and Bugs */}
                            <div className="flex gap-4">
                                <FormField
                                    control={devForm.control}
                                    name="Totaltestcase"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Total testcase*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter total testcase"
                                                    {...field}
                                                    type="number"
                                                    min="0"
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        // Ensure we have a valid number
                                                        if (!e.target.value) devForm.setValue("Totaltestcase", "0");
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={devForm.control}
                                    name="totalbugs"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Total bugs*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Calculated automatically"
                                                    {...field}
                                                    readOnly
                                                    className="bg-gray-100"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Form submission and error handling */}
                            {devForm.formState.errors.root && (
                                <div className="text-red-500 text-sm">
                                    {devForm.formState.errors.root.message}
                                </div>
                            )}

                            <Button type="submit" className="w-full">
                                Submit Development Report
                            </Button>
                        </form>
                    </Form>
                </TabsContent>

                {/* Production Form */}
                <TabsContent value="prod">
                    <Form {...prodForm}>
                        <form
                            onSubmit={prodForm.handleSubmit((values) =>
                                onSubmitProd(values, prodForm.reset, router, setIsRedirecting)
                            )}
                            className="space-y-6"
                        >
                            {/* Sprint and Version */}
                            <div className="flex gap-4">
                                <FormField
                                    control={prodForm.control}
                                    name="P_sprint"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Sprint number*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter sprint number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={prodForm.control}
                                    name="P_version"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Version*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter version" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Due Date */}
                            <FormField
                                control={prodForm.control}
                                name="P_dueDate"
                                render={({ field }) => (
                                    <DatePicker field={field} label="Release date" />
                                )}
                            />

                            {/* Test Case and Bugs */}
                            <div className="flex gap-4">
                                <FormField
                                    control={prodForm.control}
                                    name="P_totaltestcase"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Total testcase*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter total testcase" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={prodForm.control}
                                    name="P_totalbugs"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Total bugs*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter total bugs" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Developer 1 Section */}
                            <DeveloperSelect
                                control={prodForm.control}
                                name="P_developer1"
                                label="Developer"
                            />
                            <div className="flex gap-4">
                                <FormField
                                    control={prodForm.control}
                                    name="P_d1_passed"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Passed*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Passed bugs count" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={prodForm.control}
                                    name="P_d1_failed"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Failed*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Failed bugs count" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Developer 2 Section */}
                            <DeveloperSelect
                                control={prodForm.control}
                                name="P_developer2"
                                label="Developer"
                            />
                            <div className="flex gap-4">
                                <FormField
                                    control={prodForm.control}
                                    name="P_d2_passed"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Passed*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Passed bugs count" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={prodForm.control}
                                    name="P_d2_failed"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Failed*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Failed bugs count" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Close Date */}
                            <FormField
                                control={prodForm.control}
                                name="P_closeDate"
                                render={({ field }) => (
                                    <DatePicker field={field} label="Closing date" />
                                )}
                            />

                            <Button type="submit" className="w-full">
                                Submit Production Report
                            </Button>
                        </form>
                    </Form>
                </TabsContent>
            </Tabs>
        </div>
    );
}