import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext.jsx';
import './TimerDial.css';

const MINUTES_PER_CLICK = 1; // How many minutes per click/notch
const ANGLE_PER_CLICK = 360 / (60 / MINUTES_PER_CLICK); // Degrees per click

const TimerDial = ({ onTimeSet }) => {
  const [angle, setAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const lastAngleRef = useRef(0);
  const { settings } = useSettings();

  // Create click sound
  const playClickSound = useCallback(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(2000, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 0.001);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.05);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
  }, []);

  const snapToNearestClick = useCallback((rawAngle) => {
    const snappedAngle = Math.round(rawAngle / ANGLE_PER_CLICK) * ANGLE_PER_CLICK;
    const newMinutes = Math.round((snappedAngle / 360) * 60);
    return { snappedAngle, newMinutes };
  }, []);

  const calculateAngleAndMinutes = useCallback((e, dial) => {
    const rect = dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    let angle = Math.atan2(deltaY, deltaX);
    angle = (angle * 180 / Math.PI + 360) % 360;
    angle = (angle + 90) % 360;
    
    const { snappedAngle, newMinutes } = snapToNearestClick(angle);
    
    // Check if we've moved to a new click position
    if (Math.abs(snappedAngle - lastAngleRef.current) >= ANGLE_PER_CLICK) {
      playClickSound();
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 50);
      lastAngleRef.current = snappedAngle;
    }
    
    return { angle: snappedAngle, minutes: newMinutes };
  }, [snapToNearestClick, playClickSound]);

  const handleMouseDown = (e) => {
    const dial = e.currentTarget;
    const { angle, minutes } = calculateAngleAndMinutes(e, dial);
    
    setAngle(angle);
    setMinutes(minutes);
    setIsDragging(true);
    lastAngleRef.current = angle;
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const dial = document.querySelector('.timer-dial');
    if (!dial) return;

    const { angle, minutes } = calculateAngleAndMinutes(e, dial);
    setAngle(angle);
    setMinutes(minutes);
  }, [isDragging, calculateAngleAndMinutes]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onTimeSet(minutes * 60);
    }
  }, [isDragging, minutes, onTimeSet]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const markers = Array.from({ length: 60 / MINUTES_PER_CLICK }, (_, i) => {
    const rotation = i * ANGLE_PER_CLICK;
    const isHour = i % 5 === 0;
    
    return (
      <div
        key={i}
        className={`dial-marker ${isHour ? 'hour' : ''}`}
        style={{ transform: `rotate(${rotation}deg)` }}
      />
    );
  });

  return (
    <div className="timer-dial-container">
      <div
        className={`timer-dial ${isAnimating ? 'clicking' : ''} ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <div className="dial-markers">
          {markers}
        </div>
        <div
          className="dial-hand"
          style={{
            transform: `rotate(${angle}deg)`,
            background: settings.theme.buttonColor
          }}
        >
          <div 
            className="dial-hand-dot"
            style={{ background: settings.theme.buttonColor }}
          />
        </div>
        <div 
          className="dial-center"
          style={{ background: settings.theme.buttonColor }}
        />
        <div className="dial-value">{minutes} min</div>
      </div>
    </div>
  );
};

export default TimerDial; 