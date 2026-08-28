'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
    id?: string;
    /** Date value as an ISO string (yyyy-MM-dd), matching native <input type="date"> format. */
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    /** Dates strictly after this one are disabled. Defaults to today (useful for birthdates). */
    maxDate?: Date;
}

/**
 * Calendar-based date picker with a text-formatted trigger button.
 * Stores/emits dates as "yyyy-MM-dd" strings to stay compatible with
 * existing Zod string schemas and native <input type="date"> call sites.
 */
export function DatePicker({
    id,
    value,
    onChange,
    placeholder = 'jj/mm/aaaa',
    error,
    disabled,
    maxDate,
}: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const selected = value ? parseISO(value) : undefined;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        'w-full justify-start font-normal',
                        !value && 'text-muted-foreground',
                        error && 'border-destructive'
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    {selected ? format(selected, 'dd/MM/yyyy', { locale: fr }) : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    locale={fr}
                    selected={selected}
                    onSelect={(date) => {
                        if (date) onChange(format(date, 'yyyy-MM-dd'));
                        setOpen(false);
                    }}
                    captionLayout="dropdown"
                    disabled={maxDate ? { after: maxDate } : undefined}
                    defaultMonth={selected ?? maxDate}
                />
            </PopoverContent>
        </Popover>
    );
}
