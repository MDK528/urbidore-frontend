import * as React from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerTime({ form, setForm }) {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState(form.scheduledAt ? new Date(form.scheduledAt) : undefined)

    const [time, setTime] = React.useState(() => {
        if (!form.scheduledAt) return "10:30:00"

        const d = new Date(form.scheduledAt)

        return `${String(d.getHours()).padStart(2, "0")}:${String(
            d.getMinutes()
        ).padStart(2, "0")}`
    })

    React.useEffect(() => {
        if (!date || !time) return

        const [hours, minutes] = time.split(":")

        const combinedDate = new Date(date)

        combinedDate.setHours(hours)
        combinedDate.setMinutes(minutes)

        setForm((prev) => ({
            ...prev,
            scheduledAt: combinedDate.toISOString(),
        }))
    }, [date, time])

  return (
    <FieldGroup className="w-full flex flex-row ">
      <Field>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild >
            <Button
              variant="outline"
              id="date-picker-optional"
              className="w-32 justify-between font-normal bg-zinc-900 border-white/10 text-white h-9 rounded-xl cursor-point hover:bg-zinc-900 hover:text-whi active:bg-zinc-900 active:text-whi focus:bg-zinc-900 focus:text-whit data-[state=open]:bg-zinc-900 data-[state=open]:text-white"
            >
              {date ? format(date, "PPP") : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              defaultMonth={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <Field className="w-32">
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          id="time-picker-optional"
          step="1"
          className="appearance-none rounded-xl h-9 bg-zinc-900 border-white/10  focus-visible:ring-amber-400/30 focus-visible:border-amber-400/40 cursor-pointer text-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  )
}
