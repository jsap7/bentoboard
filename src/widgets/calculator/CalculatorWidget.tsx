import React from 'react';
import BaseWidget from '../../components/BaseWidget';
import { WidgetProps } from '../shared/types';
import { useWidgetState } from '../../contexts/WidgetStateContext';
import './styles/CalculatorWidget.css';

interface CalculatorWidgetProps extends WidgetProps {}

interface CalculatorWidgetComponent extends React.FC<CalculatorWidgetProps> {
  widgetConfig: any;
}

interface CalculatorData {
  display: string;
  storedNumber: number | null;
  operator: string | null;
  waitingForOperand: boolean;
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
  const [widgetState, updateWidgetState] = useWidgetState({
    id,
    initialGridPosition: gridPosition,
    initialGridSize: gridSize,
    initialData: {
      display: '0',
      storedNumber: null,
      operator: null,
      waitingForOperand: false
    }
  });

  const calculatorData = widgetState.data as CalculatorData;

  const clearAll = () => {
    updateWidgetState({
      data: {
        display: '0',
        storedNumber: null,
        operator: null,
        waitingForOperand: false
      }
    });
  };

  const inputDigit = (digit: string) => {
    if (calculatorData.waitingForOperand) {
      updateWidgetState({
        data: {
          ...calculatorData,
          display: digit,
          waitingForOperand: false
        }
      });
    } else {
      updateWidgetState({
        data: {
          ...calculatorData,
          display: calculatorData.display === '0' ? digit : calculatorData.display + digit
        }
      });
    }
  };

  const inputDecimal = () => {
    if (calculatorData.waitingForOperand) {
      updateWidgetState({
        data: {
          ...calculatorData,
          display: '0.',
          waitingForOperand: false
        }
      });
    } else if (calculatorData.display.indexOf('.') === -1) {
      updateWidgetState({
        data: {
          ...calculatorData,
          display: calculatorData.display + '.'
        }
      });
    }
  };

  const toggleSign = () => {
    updateWidgetState({
      data: {
        ...calculatorData,
        display: calculatorData.display.charAt(0) === '-' ? calculatorData.display.substr(1) : '-' + calculatorData.display
      }
    });
  };

  const inputPercent = () => {
    const value = parseFloat(calculatorData.display);
    updateWidgetState({
      data: {
        ...calculatorData,
        display: String(value / 100)
      }
    });
  };

  const performOperation = (nextOperator: string) => {
    const value = parseFloat(calculatorData.display);

    if (calculatorData.storedNumber === null) {
      updateWidgetState({
        data: {
          ...calculatorData,
          storedNumber: value,
          operator: nextOperator,
          waitingForOperand: true
        }
      });
    } else if (calculatorData.operator) {
      const result = calculate(calculatorData.storedNumber, value, calculatorData.operator);
      updateWidgetState({
        data: {
          ...calculatorData,
          display: String(result),
          storedNumber: result,
          operator: nextOperator,
          waitingForOperand: true
        }
      });
    }
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
    if (calculatorData.storedNumber === null || calculatorData.operator === null) return;

    const value = parseFloat(calculatorData.display);
    const result = calculate(calculatorData.storedNumber, value, calculatorData.operator);
    
    updateWidgetState({
      data: {
        ...calculatorData,
        display: String(result),
        storedNumber: null,
        operator: null,
        waitingForOperand: true
      }
    });
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
          <div className="display-value">{calculatorData.display}</div>
        </div>
        <div className="calculator-keypad">
          <button className="key function" onClick={clearAll}>AC</button>
          <button className="key function" onClick={toggleSign}>±</button>
          <button className="key function" onClick={inputPercent}>%</button>
          <button className={`key operator ${calculatorData.operator === '÷' ? 'active' : ''}`} onClick={() => performOperation('÷')}>÷</button>

          <button className="key number" onClick={() => inputDigit('7')}>7</button>
          <button className="key number" onClick={() => inputDigit('8')}>8</button>
          <button className="key number" onClick={() => inputDigit('9')}>9</button>
          <button className={`key operator ${calculatorData.operator === '×' ? 'active' : ''}`} onClick={() => performOperation('×')}>×</button>

          <button className="key number" onClick={() => inputDigit('4')}>4</button>
          <button className="key number" onClick={() => inputDigit('5')}>5</button>
          <button className="key number" onClick={() => inputDigit('6')}>6</button>
          <button className={`key operator ${calculatorData.operator === '-' ? 'active' : ''}`} onClick={() => performOperation('-')}>−</button>

          <button className="key number" onClick={() => inputDigit('1')}>1</button>
          <button className="key number" onClick={() => inputDigit('2')}>2</button>
          <button className="key number" onClick={() => inputDigit('3')}>3</button>
          <button className={`key operator ${calculatorData.operator === '+' ? 'active' : ''}`} onClick={() => performOperation('+')}>+</button>

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