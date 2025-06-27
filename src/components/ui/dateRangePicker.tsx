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

