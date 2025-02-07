import React, { useState } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

const defaultPresetColors = [
  // Row 1 - Blues & Purples
  '#6366f1', // Indigo
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#0ea5e9', // Sky
  '#8b5cf6', // Purple
  
  // Row 2 - Greens & Yellows
  '#10b981', // Emerald
  '#84cc16', // Lime
  '#22c55e', // Green
  '#eab308', // Yellow
  '#f59e0b', // Amber

  // Row 3 - Reds & Pinks
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#94a3b8', // Slate
];

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  presetColors = defaultPresetColors,
}) => {
  const [customColor, setCustomColor] = useState(value);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    
    // Only update if it's a valid hex color
    if (/^#[0-9A-F]{6}$/i.test(newColor)) {
      onChange(newColor);
    }
  };

  return (
    <div className="color-picker-container">
      <div className="color-picker">
        {presetColors.map((color) => (
          <button
            key={color}
            className={`color-option ${color === value ? 'active' : ''}`}
            style={{ background: color }}
            onClick={() => onChange(color)}
            title={color}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
      <div className="custom-color">
        <div 
          className="color-preview"
          style={{ background: value }}
        />
        <input
          type="text"
          className="custom-color-input"
          value={customColor}
          onChange={handleCustomColorChange}
          placeholder="#000000"
          pattern="^#[0-9A-Fa-f]{6}$"
          title="Hex color code (e.g. #ff0000)"
        />
      </div>
    </div>
  );
};

export default ColorPicker; 