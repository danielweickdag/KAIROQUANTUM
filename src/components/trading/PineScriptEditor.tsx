'use client';

import React, { useState } from 'react';
import { Play, Save, Download, Upload, Code, BarChart3, Settings } from 'lucide-react';

interface PineScriptEditorProps {
  onSave?: (script: string) => Promise<void>;
  onRun?: (script: string) => Promise<void>;
}

const PineScriptEditor = ({ onSave, onRun }: PineScriptEditorProps) => {
  const [code, setCode] = useState(`//@version=5
indicator("My Custom Indicator", shorttitle="MCI", overlay=true)

// Input parameters
length = input.int(14, title="Length", minval=1)
source = input(close, title="Source")

// Calculate moving average
ma = ta.sma(source, length)

// Plot the moving average
plot(ma, color=color.blue, linewidth=2, title="Moving Average")

// Add alerts
alertcondition(ta.crossover(close, ma), title="Price crosses above MA", message="Price crossed above moving average")
alertcondition(ta.crossunder(close, ma), title="Price crosses below MA", message="Price crossed below moving average")`);

  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      if (onRun) {
        await onRun(code);
      } else {
        // Simulate script execution
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(code);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pine Script Editor
            </h2>
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">v5</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button 
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Play className="h-4 w-4" />
              <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Code Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Script Editor
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Line 1, Column 1</span>
                <Settings className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300" />
              </div>
            </div>
            
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-0 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-b-lg"
                placeholder="Enter your Pine Script code here..."
                spellCheck={false}
              />
              
              {/* Line numbers */}
              <div className="absolute left-0 top-0 p-4 text-xs text-gray-400 dark:text-gray-600 pointer-events-none font-mono">
                {code.split('\n').map((_, index) => (
                  <div key={index} className="h-5">
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Console Output */}
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Console Output
              </h3>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
              <div className="font-mono text-sm space-y-1">
                {isRunning ? (
                  <div className="text-blue-600 dark:text-blue-400">
                    <span className="animate-pulse">●</span> Compiling script...
                  </div>
                ) : (
                  <>
                    <div className="text-green-600 dark:text-green-400">
                      ✓ Script compiled successfully
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      → Indicator "My Custom Indicator" added to chart
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      → 2 alert conditions created
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Script Templates */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Script Templates
            </h3>
            
            <div className="space-y-2">
              {[
                { name: 'Simple Moving Average', type: 'Indicator' },
                { name: 'RSI Divergence', type: 'Indicator' },
                { name: 'Bollinger Bands', type: 'Indicator' },
                { name: 'MACD Strategy', type: 'Strategy' },
                { name: 'Support/Resistance', type: 'Indicator' },
                { name: 'Volume Profile', type: 'Indicator' }
              ].map((template) => (
                <button
                  key={template.name}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {template.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {template.type}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Script Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Script Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Script Name
                </label>
                <input
                  type="text"
                  defaultValue="My Custom Indicator"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Short Title
                </label>
                <input
                  type="text"
                  defaultValue="MCI"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Script Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                  <option>Indicator</option>
                  <option>Strategy</option>
                  <option>Library</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="overlay"
                  defaultChecked
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="overlay" className="text-sm text-gray-700 dark:text-gray-300">
                  Overlay on main chart
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="alerts"
                  defaultChecked
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="alerts" className="text-sm text-gray-700 dark:text-gray-300">
                  Enable alerts
                </label>
              </div>
            </div>
          </div>

          {/* Documentation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Quick Reference
            </h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Common Functions</h4>
                <ul className="mt-1 space-y-1 text-gray-600 dark:text-gray-400">
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">ta.sma()</code> - Simple Moving Average</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">ta.rsi()</code> - Relative Strength Index</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">ta.crossover()</code> - Crossover detection</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Plot Functions</h4>
                <ul className="mt-1 space-y-1 text-gray-600 dark:text-gray-400">
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">plot()</code> - Plot line</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">plotshape()</code> - Plot shape</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">bgcolor()</code> - Background color</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Input Types</h4>
                <ul className="mt-1 space-y-1 text-gray-600 dark:text-gray-400">
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">input.int()</code> - Integer input</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">input.float()</code> - Float input</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">input.bool()</code> - Boolean input</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PineScriptEditor;