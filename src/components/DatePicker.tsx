import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  parseISO,
} from 'date-fns';

interface DatePickerProps {
  value: string; // ISO date string
  onChange: (date: string) => void;
  minDate?: string;
  placeholder?: string;
  label?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minDate,
  placeholder = 'Select date',
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    value ? parseISO(value) : new Date()
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? parseISO(value) : null;
  const minDateParsed = minDate ? parseISO(minDate) : null;

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days: Date[] = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  const handleDateClick = (date: Date) => {
    if (minDateParsed && isBefore(date, minDateParsed)) return;
    onChange(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const isDateDisabled = (date: Date) => {
    if (minDateParsed && isBefore(date, minDateParsed)) return true;
    return false;
  };

  const days = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div ref={containerRef} className="relative">
      {/* Input Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="input-field flex items-center gap-3 cursor-pointer hover:border-white/30 transition-colors"
      >
        <CalendarIcon className="w-5 h-5 text-white/40" />
        <span className={selectedDate ? 'text-white' : 'text-white/40'}>
          {selectedDate ? format(selectedDate, 'MMM d, yyyy') : placeholder}
        </span>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 w-[300px] animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentMonth(subMonths(currentMonth, 1));
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white/60" />
            </button>
            <span className="font-semibold text-white">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentMonth(addMonths(currentMonth, 1));
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs text-white/40 font-medium py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isTodayDate = isToday(day);
              const disabled = isDateDisabled(day);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!disabled) handleDateClick(day);
                  }}
                  disabled={disabled}
                  className={`
                    w-9 h-9 rounded-lg text-sm font-medium transition-all
                    ${!isCurrentMonth ? 'text-white/20' : 'text-white/70'}
                    ${isSelected ? 'bg-white text-black' : ''}
                    ${isTodayDate && !isSelected ? 'border border-white/30' : ''}
                    ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'}
                    ${isCurrentMonth && !isSelected && !disabled ? 'text-white' : ''}
                  `}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-3 border-t border-white/10 flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const today = new Date();
                if (!minDateParsed || !isBefore(today, minDateParsed)) {
                  onChange(format(today, 'yyyy-MM-dd'));
                  setIsOpen(false);
                }
              }}
              className="flex-1 py-2 text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const nextWeek = addDays(new Date(), 7);
                if (!minDateParsed || !isBefore(nextWeek, minDateParsed)) {
                  onChange(format(nextWeek, 'yyyy-MM-dd'));
                  setIsOpen(false);
                }
              }}
              className="flex-1 py-2 text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Next Week
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const nextMonth = addMonths(new Date(), 1);
                if (!minDateParsed || !isBefore(nextMonth, minDateParsed)) {
                  onChange(format(nextMonth, 'yyyy-MM-dd'));
                  setIsOpen(false);
                }
              }}
              className="flex-1 py-2 text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Next Month
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
