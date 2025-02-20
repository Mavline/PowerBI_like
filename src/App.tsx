import React from 'react';
import { Dashboard } from './components/Dashboard';
import { Chart as ChartJS } from 'chart.js';

// Disable Chart.js auto-resize animation for better performance
ChartJS.defaults.responsive = true;
ChartJS.defaults.maintainAspectRatio = false;

function App() {
  return (
    <div className="min-h-screen bg-[#000000] transition-colors duration-300">
      <Dashboard />
    </div>
  );
}

export default App;