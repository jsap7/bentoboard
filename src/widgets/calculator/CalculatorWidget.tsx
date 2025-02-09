import React, { useState } from 'react';
import BaseWidget from '../../components/BaseWidget';
import { WidgetProps } from '../shared/types';
import './styles/CalculatorWidget.css';

interface CalculatorWidgetProps extends WidgetProps {}

interface CalculatorWidgetComponent extends React.FC<CalculatorWidgetProps> {
  widgetConfig: any;
}

const CalculatorWidget: CalculatorWidgetComponent = ({
  id,
  style,
  gridPosition,
  gridSize,
  onClose,
  onResize,
  onDrag
}) => {
  const [display, setDisplay] = useState('0');
  const [storedNumber, setStoredNumber] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const clearAll = () => {
    setDisplay('0');
    setStoredNumber(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const toggleSign = () => {
    setDisplay(display.charAt(0) === '-' ? display.substr(1) : '-' + display);
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const performOperation = (nextOperator: string) => {
    const value = parseFloat(display);

    if (storedNumber === null) {
      setStoredNumber(value);
    } else if (operator) {
      const result = calculate(storedNumber, value, operator);
      setDisplay(String(result));
      setStoredNumber(result);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (storedNumber === null || operator === null) return;

    const value = parseFloat(display);
    const result = calculate(storedNumber, value, operator);
    
    setDisplay(String(result));
    setStoredNumber(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  return (
    <BaseWidget
      id={id}
      title="Calculator"
      style={style}
      gridPosition={gridPosition}
      gridSize={gridSize}
      onClose={onClose}
      onResize={onResize}
      onDrag={onDrag}
    >
      <div className="calculator-widget">
        <div className="calculator-display">
          <div className="display-value">{display}</div>
        </div>
        <div className="calculator-keypad">
          <button className="key function" onClick={clearAll}>AC</button>
          <button className="key function" onClick={toggleSign}>±</button>
          <button className="key function" onClick={inputPercent}>%</button>
          <button className={`key operator ${operator === '÷' ? 'active' : ''}`} onClick={() => performOperation('÷')}>÷</button>

          <button className="key number" onClick={() => inputDigit('7')}>7</button>
          <button className="key number" onClick={() => inputDigit('8')}>8</button>
          <button className="key number" onClick={() => inputDigit('9')}>9</button>
          <button className={`key operator ${operator === '×' ? 'active' : ''}`} onClick={() => performOperation('×')}>×</button>

          <button className="key number" onClick={() => inputDigit('4')}>4</button>
          <button className="key number" onClick={() => inputDigit('5')}>5</button>
          <button className="key number" onClick={() => inputDigit('6')}>6</button>
          <button className={`key operator ${operator === '-' ? 'active' : ''}`} onClick={() => performOperation('-')}>−</button>

          <button className="key number" onClick={() => inputDigit('1')}>1</button>
          <button className="key number" onClick={() => inputDigit('2')}>2</button>
          <button className="key number" onClick={() => inputDigit('3')}>3</button>
          <button className={`key operator ${operator === '+' ? 'active' : ''}`} onClick={() => performOperation('+')}>+</button>

          <button className="key number zero" onClick={() => inputDigit('0')}>0</button>
          <button className="key number" onClick={inputDecimal}>.</button>
          <button className="key equals" onClick={handleEquals}>=</button>
        </div>
      </div>
    </BaseWidget>
  );
};

CalculatorWidget.widgetConfig = {
  id: 'calculator',
  type: 'calculator',
  title: 'Calculator',
  description: 'Basic calculator with standard operations',
  defaultSize: { width: 2, height: 3 },
  minSize: { width: 2, height: 3 },
  maxSize: { width: 3, height: 4 }
};

export default CalculatorWidget; 