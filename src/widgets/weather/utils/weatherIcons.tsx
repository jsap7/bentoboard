import React from 'react';

interface WeatherIconProps {
  className?: string;
}

const iconStyle = {
  width: '100%',
  height: '100%',
};

export const WeatherIcons = {
  Clear: ({ className }: WeatherIconProps) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle} className={className}>
      <circle cx="8" cy="8" r="3" />
      <line x1="8" y1="1" x2="8" y2="2" />
      <line x1="8" y1="14" x2="8" y2="15" />
      <line x1="2.8" y1="2.8" x2="3.8" y2="3.8" />
      <line x1="12.2" y1="12.2" x2="13.2" y2="13.2" />
      <line x1="1" y1="8" x2="2" y2="8" />
      <line x1="14" y1="8" x2="15" y2="8" />
      <line x1="2.8" y1="13.2" x2="3.8" y2="12.2" />
      <line x1="12.2" y1="3.8" x2="13.2" y2="2.8" />
    </svg>
  ),
  
  Cloudy: ({ className }: WeatherIconProps) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle} className={className}>
      <path d="M12 7h-1A5 5 0 1 0 6 13h6a3 3 0 0 0 0-6z" />
    </svg>
  ),

  PartlyCloudy: ({ className }: WeatherIconProps) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle} className={className}>
      <path d="M10 8A2.5 2.5 0 0 0 8 5.5" />
      <path d="M10 5.5a2.5 2.5 0 0 0-5 0" />
      <path d="M8 3V2" />
      <path d="M5 5L4 4" />
      <path d="M3 8H2" />
      <path d="M12 7h-1A5 5 0 1 0 6 13h6a3 3 0 0 0 0-6z" />
    </svg>
  ),

  Rain: ({ className }: WeatherIconProps) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle} className={className}>
      <path d="M10 9v4" />
      <path d="M6 9v4" />
      <path d="M8 10v4" />
      <path d="M12 10.5A3 3 0 0 0 11 5h-1A5 5 0 1 0 4 9.5" />
    </svg>
  ),

  Snow: ({ className }: WeatherIconProps) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle} className={className}>
      <path d="M12 11A3 3 0 0 0 11 6h-1A5 5 0 1 0 4 10" />
      <line x1="6" y1="11" x2="6" y2="11.01" />
      <line x1="6" y1="13" x2="6" y2="13.01" />
      <line x1="8" y1="12" x2="8" y2="12.01" />
      <line x1="8" y1="14" x2="8" y2="14.01" />
      <line x1="10" y1="11" x2="10" y2="11.01" />
      <line x1="10" y1="13" x2="10" y2="13.01" />
    </svg>
  ),

  Storm: ({ className }: WeatherIconProps) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle} className={className}>
      <path d="M12 11A3 3 0 0 0 11 6h-1A5 5 0 1 0 4 10" />
      <polyline points="9 8 6 11 9 11 7 14" />
    </svg>
  ),

  Fog: ({ className }: WeatherIconProps) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle} className={className}>
      <path d="M12 7h-1A5 5 0 1 0 6 13h6a3 3 0 0 0 0-6z" />
      <line x1="4" y1="8" x2="12" y2="8" />
      <line x1="5" y1="10" x2="11" y2="10" />
    </svg>
  ),

  Night: ({ className }: WeatherIconProps) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle} className={className}>
      <path d="M13 8.5A5.5 5.5 0 1 1 7.5 3 4 4 0 0 0 13 8.5z" />
    </svg>
  ),

  Wind: ({ className }: WeatherIconProps) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle} className={className}>
      <path d="M7 4a1.5 1.5 0 1 1 1 2.5H2m6 4a1.5 1.5 0 1 0 1-2.5H2m9-2a2 2 0 1 1 1.5 2H2" />
    </svg>
  )
};

export const getIconForCondition = (description: string): React.ComponentType<WeatherIconProps> => {
  const desc = description.toLowerCase();
  
  if (desc.includes('clear') || desc.includes('sunny')) return WeatherIcons.Clear;
  if (desc.includes('partly cloudy')) return WeatherIcons.PartlyCloudy;
  if (desc.includes('cloudy') || desc.includes('overcast')) return WeatherIcons.Cloudy;
  if (desc.includes('rain') || desc.includes('shower')) return WeatherIcons.Rain;
  if (desc.includes('snow') || desc.includes('flurr')) return WeatherIcons.Snow;
  if (desc.includes('thunder') || desc.includes('storm')) return WeatherIcons.Storm;
  if (desc.includes('fog') || desc.includes('haz')) return WeatherIcons.Fog;
  if (desc.includes('wind')) return WeatherIcons.Wind;
  if (desc.includes('night')) return WeatherIcons.Night;
  
  // Default to partly cloudy if we can't determine the condition
  return WeatherIcons.PartlyCloudy;
}; 