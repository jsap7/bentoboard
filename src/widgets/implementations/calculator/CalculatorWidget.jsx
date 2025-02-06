import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BaseWidget from '../../core/BaseWidget';
import CalculatorSettings from './CalculatorSettings';
import './styles/CalculatorWidget.css';

const CalculatorWidget = ({ id, onClose, onMinimize, settings = {}, onSettingsChange }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [lastOperation, setLastOperation] = useState(null);
  const [memory, setMemory] = useState(null);

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
    setLastOperation(null);
  };

  const clearEntry = () => {
    setDisplay('0');
    setIsNewNumber(true);
  };

  const handleNumber = (num) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (isNewNumber) {
      setDisplay('0.');
      setIsNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (operator) => {
    const currentValue = parseFloat(display);
    
    if (lastOperation && !isNewNumber) {
      let result;
      const prevValue = parseFloat(equation);
      
      switch (lastOperation) {
        case '+': result = prevValue + currentValue; break;
        case '-': result = prevValue - currentValue; break;
        case '×': result = prevValue * currentValue; break;
        case '÷': result = prevValue / currentValue; break;
        default: result = currentValue;
      }
      
      setDisplay(result.toString());
      setEquation(result.toString());
    } else {
      setEquation(currentValue.toString());
    }
    
    setLastOperation(operator);
    setIsNewNumber(true);
  };

  const calculateResult = () => {
    if (!lastOperation || isNewNumber) return;
    
    const currentValue = parseFloat(display);
    const prevValue = parseFloat(equation);
    let result;
    
    switch (lastOperation) {
      case '+': result = prevValue + currentValue; break;
      case '-': result = prevValue - currentValue; break;
      case '×': result = prevValue * currentValue; break;
      case '÷': result = prevValue / currentValue; break;
      default: result = currentValue;
    }
    
    setDisplay(result.toString());
    setEquation('');
    setLastOperation(null);
    setIsNewNumber(true);
  };

  const handleMemory = (action) => {
    const currentValue = parseFloat(display);
    
    switch (action) {
      case 'MC':
        setMemory(null);
        break;
      case 'MR':
        if (memory !== null) {
          setDisplay(memory.toString());
          setIsNewNumber(true);
        }
        break;
      case 'M+':
        setMemory((memory || 0) + currentValue);
        setIsNewNumber(true);
        break;
      case 'M-':
        setMemory((memory || 0) - currentValue);
        setIsNewNumber(true);
        break;
      default:
        break;
    }
  };

  const handlePlusMinus = () => {
    if (display !== '0') {
      setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
    }
  };

  const handlePercent = () => {
    const value = parseFloat(display);
    setDisplay((value / 100).toString());
    setIsNewNumber(true);
  };

  return (
    <BaseWidget
      id={id}
      title="Calculator"
      onClose={onClose}
      onMinimize={onMinimize}
      settings={settings}
      onSettingsChange={onSettingsChange}
      SettingsComponent={CalculatorSettings}
      className="calculator-widget"
    >
      <div className="calculator-container">
        <div className="calculator-display">
          <div className="equation">{equation} {lastOperation}</div>
          <div className="result">{display}</div>
        </div>
        <div className="calculator-keypad">
          <button onClick={() => handleMemory('MC')} className="memory">MC</button>
          <button onClick={() => handleMemory('MR')} className="memory">MR</button>
          <button onClick={() => handleMemory('M+')} className="memory">M+</button>
          <button onClick={() => handleMemory('M-')} className="memory">M-</button>
          
          <button onClick={clear} className="function">C</button>
          <button onClick={clearEntry} className="function">CE</button>
          <button onClick={handlePercent} className="function">%</button>
          <button onClick={() => handleOperator('÷')} className="operator">÷</button>
          
          <button onClick={() => handleNumber('7')} className="number">7</button>
          <button onClick={() => handleNumber('8')} className="number">8</button>
          <button onClick={() => handleNumber('9')} className="number">9</button>
          <button onClick={() => handleOperator('×')} className="operator">×</button>
          
          <button onClick={() => handleNumber('4')} className="number">4</button>
          <button onClick={() => handleNumber('5')} className="number">5</button>
          <button onClick={() => handleNumber('6')} className="number">6</button>
          <button onClick={() => handleOperator('-')} className="operator">−</button>
          
          <button onClick={() => handleNumber('1')} className="number">1</button>
          <button onClick={() => handleNumber('2')} className="number">2</button>
          <button onClick={() => handleNumber('3')} className="number">3</button>
          <button onClick={() => handleOperator('+')} className="operator">+</button>
          
          <button onClick={handlePlusMinus} className="number">±</button>
          <button onClick={() => handleNumber('0')} className="number">0</button>
          <button onClick={handleDecimal} className="number">.</button>
          <button onClick={calculateResult} className="operator equals">=</button>
        </div>
      </div>
    </BaseWidget>
  );
};

CalculatorWidget.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onMinimize: PropTypes.func,
  settings: PropTypes.object,
  onSettingsChange: PropTypes.func
};

// Register the widget
const calculatorWidgetConfig = {
  type: 'calculator',
  component: CalculatorWidget,
  name: 'Calculator',
  description: 'A simple calculator for basic arithmetic operations',
  defaultSettings: {
    theme: {
      backgroundColor: '#161616'
    }
  },
  defaultSize: {
    width: 2,
    height: 3
  },
  isResizable: true,
  minSize: {
    width: 2,
    height: 3
  },
  maxSize: {
    width: 3,
    height: 4
  }
};

export { CalculatorWidget as default, calculatorWidgetConfig }; 