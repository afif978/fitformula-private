
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
          <CalendarIcon className="h-4 w-4 mr-2" />
          {format(selectedDate, 'PPP')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateChange(date)}
          initialFocus
          className="bg-gray-800 text-white"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateSelector;
