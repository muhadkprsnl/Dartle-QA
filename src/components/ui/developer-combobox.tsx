// components/ui/developer-combobox.tsx
"use client"

import * as React from "react"
import { useMediaQuery } from 'react-responsive'
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Developer = {
  value: string
  label: string
}

const developers: Developer[] = [
  {
    value: "All",
    label: "All Developers",
  },
  {
    value: "Ashi",
    label: "Ashi",
  },
  {
    value: "Vaishnav",
    label: "Vaishnav",
  },
]

export function DeveloperComboBox({ selectedDeveloper, setSelectedDeveloper }: {
  selectedDeveloper: string,
  setSelectedDeveloper: (developer: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' })

  const selectedDeveloperData = developers.find(dev => dev.value === selectedDeveloper) || null

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedDeveloperData ? <>{selectedDeveloperData.label}</> : <>Select Developer</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <DeveloperList setOpen={setOpen} setSelectedDeveloper={setSelectedDeveloper} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedDeveloperData ? <>{selectedDeveloperData.label}</> : <>Select Developer</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <DeveloperList setOpen={setOpen} setSelectedDeveloper={setSelectedDeveloper} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function DeveloperList({
  setOpen,
  setSelectedDeveloper,
}: {
  setOpen: (open: boolean) => void
  setSelectedDeveloper: (developer: string) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter developers..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {developers.map((developer) => (
            <CommandItem
              key={developer.value}
              value={developer.value}
              onSelect={(value) => {
                setSelectedDeveloper(value)
                setOpen(false)
              }}
            >
              {developer.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}