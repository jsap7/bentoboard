import React, { useState, useRef, useEffect } from 'react';
import './TimerScroll.css';

const ScrollWheel = ({ value, onChange, max, min = 0, label }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(0);
  const [currentValue, setCurrentValue] = useState(value);
  const scrollRef = useRef(null);

  const ITEM_HEIGHT = 40;

  const handleStart = (clientY) => {
    setIsDragging(true);
    setStartY(clientY);
    setStartValue(currentValue);
  };

  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientY);
  };

  const handleMouseDown = (e) => {
    handleStart(e.clientY);
  };

  const handleMove = (clientY) => {
    if (!isDragging) return;

    const delta = startY - clientY;
    const valueDelta = Math.round(delta / ITEM_HEIGHT);
    let newValue = startValue + valueDelta;

    // Ensure the value stays within bounds
    newValue = Math.max(min, Math.min(newValue, max));
    
    if (newValue !== currentValue) {
      setCurrentValue(newValue);
      onChange(newValue);
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    handleMove(e.touches[0].clientY);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientY);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, currentValue]);

  // Generate array of visible numbers (current ± 2)
  const getVisibleNumbers = () => {
    const numbers = [];
    for (let i = Math.max(min, currentValue - 2); i <= Math.min(max, currentValue + 2); i++) {
      numbers.push(i);
    }
    return numbers;
  };

  return (
    <div className="scroll-wheel">
      <div className="scroll-gradient-top" />
      <div className="scroll-highlight" />
      <div className="scroll-gradient-bottom" />
      
      <div 
        className="scroll"
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="scroll-numbers">
          {getVisibleNumbers().map((num) => (
            <div 
              key={num}
              className={`scroll-number ${num === currentValue ? 'selected' : 
                Math.abs(num - currentValue) === 1 ? 'adjacent' : 'distant'}`}
              style={{
                transform: `translateY(${(num - currentValue) * ITEM_HEIGHT}px)`
              }}
            >
              {String(num).padStart(2, '0')}
            </div>
          ))}
        </div>
      </div>
      
      <div className="scroll-label">{label}</div>
    </div>
  );
};

const TimerScroll = ({ value, onChange, max, min, label }) => {
  if (value !== undefined && onChange !== undefined) {
    return (
      <ScrollWheel
        value={value}
        onChange={onChange}
        max={max}
        min={min}
        label={label}
      />
    );
  }

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const totalSeconds = (minutes * 60) + seconds;
    onTimeSet(totalSeconds);
  }, [minutes, seconds]);

  return (
    <div className="timer-scroll-container">
      <ScrollWheel
        value={minutes}
        onChange={setMinutes}
        max={100}
        label="minutes"
      />
      <ScrollWheel
        value={seconds}
        onChange={setSeconds}
        max={60}
        label="seconds"
      />
    </div>
  );
};

export default TimerScroll; 