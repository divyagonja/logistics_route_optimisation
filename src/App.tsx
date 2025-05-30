import React from 'react';
import { RouteProvider } from './context/RouteContext';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <RouteProvider>
      <Dashboard />
    </RouteProvider>
  );
}

export default App;