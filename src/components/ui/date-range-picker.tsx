// import * as React from "react";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { Button } from "@/components/ui/button";

// // type DateRange = {
// //   from: Date | null;
// //   to: Date | null;
// // };

// // This describes what a report item looks like
// type ReportItem = {
//   [key: string]: any; // This means it can have any other properties
//   created_at?: string | { $date: string }; // created_at can be a string or an object with $date
// };

// // This describes the date range you use for filtering
// type DateRange = { from: Date | null; to: Date | null };


// interface Props {
//   date: DateRange;
//   setDate: React.Dispatch<React.SetStateAction<DateRange>>;
// }

// export const DateRangePicker: React.FC<Props> = ({ date, setDate }) => {
//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button variant="outline" className="w-[260px] justify-start text-left font-normal">
//           <CalendarIcon className="mr-2 h-4 w-4" />
//           {date.from ? (
//             date.to ? (
//               <>
//                 {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
//               </>
//             ) : (
//               format(date.from, "LLL dd, y")
//             )
//           ) : (
//             <span>Pick a date range</span>
//           )}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-auto p-0" align="start">
//         <Calendar
//           mode="range"
//           selected={{
//             from: date.from ?? undefined,
//             to: date.to ?? undefined,
//           }}
//           onSelect={(range) => {
//             setDate({
//               from: range?.from ?? null,
//               to: range?.to ?? null,
//             });
//           }}
//           initialFocus
//         />
//       </PopoverContent>
//     </Popover>
//   );
// };

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DateRange = {
  from: Date | null;
  to: Date | null;
};

interface DateRangePickerProps {
  date?: DateRange;
  onDateChange?: (range: DateRange) => void;
  className?: string;
  align?: "start" | "end" | "center";
  disabled?: boolean;
  placeholder?: string;
}

export const DateRangePickers = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      date = { from: null, to: null },
      onDateChange,
      className,
      align = "start",
      disabled = false,
      placeholder = "Pick a date range",
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [internalDate, setInternalDate] = React.useState<DateRange>(date);
    const [isSelecting, setIsSelecting] = React.useState(false);
    const [initialDate, setInitialDate] = React.useState<Date | null>(null);

    React.useEffect(() => {
      setInternalDate(date);
    }, [date]);

    const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
      if (!range) return;

      // If we're just starting selection
      if (!isSelecting && range.from) {
        setIsSelecting(true);
        setInitialDate(range.from);
        setInternalDate({ from: range.from, to: null });
        return;
      }

      // If we have an initial date and are selecting the end date
      if (isSelecting && initialDate && range.to) {
        const newRange = {
          from: initialDate,
          to: range.to
        };

        setInternalDate(newRange);
        onDateChange?.(newRange);
        setIsOpen(false);
        setIsSelecting(false);
        setInitialDate(null);
      }
    };

    const displayText = React.useMemo(() => {
      if (!internalDate.from) {
        return placeholder;
      }
      if (!internalDate.to) {
        return `${format(internalDate.from, "MMM dd, yyyy")} - Select end date`;
      }
      return `${format(internalDate.from, "MMM dd, yyyy")} - ${format(internalDate.to, "MMM dd, yyyy")}`;
    }, [internalDate, placeholder]);

    const handleOpenChange = (open: boolean) => {
      if (!open && internalDate.from && !internalDate.to) {
        return;
      }
      setIsOpen(open);

      if (!open) {
        // Reset if closed without completing selection
        if (internalDate.from && !internalDate.to) {
          setInternalDate({ from: null, to: null });
        }
        setIsSelecting(false);
        setInitialDate(null);
      }
    };

    return (
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !internalDate.from && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayText}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align} ref={ref}>
          <Calendar
            mode="range"
            selected={{
              from: internalDate.from ?? undefined,
              to: internalDate.to ?? undefined,
            }}
            onSelect={handleSelect}
            numberOfMonths={2}
            defaultMonth={internalDate.from ?? new Date()}
            initialFocus
            disabled={disabled}
          />

          {isSelecting && (
            <div className="p-2 border-t flex justify-between">
              <div className="text-sm text-muted-foreground px-2">
                {internalDate.from && format(internalDate.from, "MMM dd, yyyy")}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInternalDate({ from: null, to: null });
                    setIsSelecting(false);
                    setInitialDate(null);
                  }}
                >
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  }
);

DateRangePickers.displayName = "DateRangePicker";