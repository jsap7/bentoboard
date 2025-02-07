interface TimeFormatOptions {
  showSeconds: boolean;
  use24Hour: boolean;
}

interface DateFormatOptions {
  weekday: 'long' | 'short' | 'narrow';
  year: 'numeric' | '2-digit';
  month: 'long' | 'short' | 'narrow' | 'numeric' | '2-digit';
  day: 'numeric' | '2-digit';
}

export const formatTime = (date: Date, options: TimeFormatOptions): string => {
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(options.showSeconds && { second: '2-digit' }),
    hour12: !options.use24Hour
  };

  return date.toLocaleTimeString(undefined, timeOptions);
};

export const formatDate = (date: Date, options: DateFormatOptions): string => {
  return date.toLocaleDateString(undefined, options);
};

export const getDefaultDateFormatOptions = (): DateFormatOptions => ({
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

export const getDefaultClockSettings = () => ({
  showSeconds: true,
  showDate: true,
  use24Hour: false
}); 