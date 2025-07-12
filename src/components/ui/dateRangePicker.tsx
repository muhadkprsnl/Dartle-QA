import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

// type DateRange = {
//   from: Date | null;
//   to: Date | null;
// };

// This describes what a report item looks like
type ReportItem = {
  [key: string]: any; // This means it can have any other properties
  created_at?: string | { $date: string }; // created_at can be a string or an object with $date
};

// This describes the date range you use for filtering
type DateRange = { from: Date | null; to: Date | null };


interface Props {
  date: DateRange;
  setDate: React.Dispatch<React.SetStateAction<DateRange>>;
}

export const DateRangePicker: React.FC<Props> = ({ date, setDate }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[260px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={{
            from: date.from ?? undefined,
            to: date.to ?? undefined,
          }}
          onSelect={(range) => {
            setDate({
              from: range?.from ?? null,
              to: range?.to ?? null,
            });
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

// import * as React from "react";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// export type DateRange = {
//   from: Date | null;
//   to: Date | null;
// };

// interface DateRangePickerProps {
//   date?: DateRange;
//   onDateChange?: (range: DateRange) => void;
//   className?: string;
//   align?: "start" | "end" | "center";
//   disabled?: boolean;
//   placeholder?: string;
// }

// export const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
//   (
//     {
//       date = { from: null, to: null },
//       onDateChange,
//       className,
//       align = "start",
//       disabled = false,
//       placeholder = "Pick a date range",
//     },
//     ref
//   ) => {
//     const [isOpen, setIsOpen] = React.useState(false);
//     const [internalDate, setInternalDate] = React.useState<DateRange>(date);

//     React.useEffect(() => {
//       setInternalDate(date);
//     }, [date]);

//     const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
//       const newRange = {
//         from: range?.from ?? null,
//         to: range?.to ?? null,
//       };
//       setInternalDate(newRange);
//       onDateChange?.(newRange);
//     };

//     const displayText = React.useMemo(() => {
//       if (!internalDate.from) {
//         return placeholder;
//       }
//       if (!internalDate.to) {
//         return format(internalDate.from, "MMM dd, yyyy");
//       }
//       return `${format(internalDate.from, "MMM dd, yyyy")} - ${format(internalDate.to, "MMM dd, yyyy")}`;
//     }, [internalDate, placeholder]);

//     return (
//       <Popover open={isOpen} onOpenChange={setIsOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             disabled={disabled}
//             className={cn(
//               "w-[260px] justify-start text-left font-normal",
//               !internalDate.from && "text-muted-foreground",
//               className
//             )}
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {displayText}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align={align} ref={ref}>
//           <Calendar
//             mode="range"
//             selected={{
//               from: internalDate.from ?? undefined,
//               to: internalDate.to ?? undefined,
//             }}
//             onSelect={handleSelect}
//             numberOfMonths={2}
//             defaultMonth={internalDate.from ?? new Date()}
//             initialFocus
//             disabled={disabled}
//           />
//         </PopoverContent>
//       </Popover>
//     );
//   }
// );

// DateRangePicker.displayName = "DateRangePicker";