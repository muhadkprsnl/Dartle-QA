"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"

type Sprint = {
  value: string
  label: string
}

export function SprintComboBox({
  selectedSprint,
  setSelectedSprint,
  dateRange,
  setDateRange
}: {
  selectedSprint: string,
  setSelectedSprint: (sprint: string) => void,
  dateRange?: DateRange,
  setDateRange: (range?: DateRange) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [calendarOpen, setCalendarOpen] = React.useState(false)
  const [sprints, setSprints] = React.useState<Sprint[]>([
    { value: "All", label: "All Sprints" }
  ])

  // 🔄 Fetch sprints from backend
  React.useEffect(() => {
    const fetchSprints = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/v1/sprints")
        if (!res.ok) throw new Error("Failed to fetch sprints")
        const sprintList: Sprint[] = await res.json()

        // Add "All Sprints" option at the beginning
        setSprints([{ value: "All", label: "All Sprints" }, ...sprintList])
      } catch (err) {
        console.error("Error loading sprints:", err)
      }
    }

    fetchSprints()
  }, [])

  const selectedSprintData = sprints.find(s => s.value === selectedSprint)

  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex items-center">
        {/* Sprint Dropdown */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start">
              {selectedSprintData?.label || "Select Sprint"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search sprints..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {sprints.map((sprint) => (
                    <CommandItem
                      key={sprint.value}
                      value={sprint.value}
                      onSelect={(value) => {
                        setSelectedSprint(value)
                        setOpen(false)
                      }}
                    >
                      {sprint.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Calendar Button */}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 h-8 w-8"
              // onClick={(e) => {
              //   e.preventDefault()
              //   e.stopPropagation()
              //   setCalendarOpen(!calendarOpen)
              // }}

              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault()
                e.stopPropagation()
                setCalendarOpen(!calendarOpen)
              }}

            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
            {dateRange?.from && dateRange.to && (
              <div className="p-2 text-sm text-center border-t">
                {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                {format(dateRange.to, "MMM dd, yyyy")}
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
