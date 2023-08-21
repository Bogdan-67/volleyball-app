import { FC } from 'react';
import Calendar from 'react-calendar';
import './calendar.scss';

type MyCalendarProps = {
  value: string;
  dates?: string[];
  disableTiles: boolean;
  selectRange: boolean;
  onChange: (value) => void;
};

const MyCalendar = ({ value, dates, disableTiles, selectRange, onChange }) => {
  function tileDisabled({ date, view }) {
    // Проверяем дату на возможность выбора
    if (disableTiles) {
      if (view === 'month') return !dates.includes(date.toISOString());
      else if (view === 'year') {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const monthDays = Array.from(
          { length: lastDayOfMonth.getDate() - firstDayOfMonth.getDate() },
          (_, i) => new Date(date.getFullYear(), date.getMonth(), firstDayOfMonth.getDate() + i),
        );
        for (let i = 0; i < monthDays.length; i++) {
          if (dates.includes(monthDays[i].toISOString())) return false;
        }
        return true;
      } else return false;
    } else return false;
  }

  return (
    <Calendar
      maxDate={new Date()}
      tileDisabled={tileDisabled}
      selectRange={selectRange}
      onChange={(value, event) => onChange(value)}
      value={value}
    />
  );
};

export default MyCalendar;
