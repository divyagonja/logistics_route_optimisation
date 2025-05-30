import React from 'react';
import { Truck, LayoutDashboard, Map, List, SplitSquareVertical } from 'lucide-react';
import { ViewMode } from '../types';
import { useRouteContext } from '../context/RouteContext';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { viewMode, setViewMode } = useRouteContext();

  return (
    <header className="bg-white shadow-md z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Truck size={32} className="text-blue-600" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Dairy Route Optimizer</h1>
            <p className="text-sm text-gray-500">Logistics Route Optimization</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <ViewModeToggle currentMode={viewMode} onModeChange={setViewMode} />
        </div>
      </div>
    </header>
  );
};

interface ViewModeToggleProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-1 flex">
      <button
        className={`p-2 rounded-md flex items-center ${
          currentMode === ViewMode.MAP
            ? 'bg-white shadow-sm text-blue-600'
            : 'text-gray-500 hover:text-gray-800'
        }`}
        onClick={() => onModeChange(ViewMode.MAP)}
        aria-label="Map View"
      >
        <Map size={18} />
        <span className="ml-2 hidden sm:inline">Map</span>
      </button>
      
      <button
        className={`p-2 rounded-md flex items-center ${
          currentMode === ViewMode.LIST
            ? 'bg-white shadow-sm text-blue-600'
            : 'text-gray-500 hover:text-gray-800'
        }`}
        onClick={() => onModeChange(ViewMode.LIST)}
        aria-label="List View"
      >
        <List size={18} />
        <span className="ml-2 hidden sm:inline">List</span>
      </button>
      
      <button
        className={`p-2 rounded-md flex items-center ${
          currentMode === ViewMode.SPLIT
            ? 'bg-white shadow-sm text-blue-600'
            : 'text-gray-500 hover:text-gray-800'
        }`}
        onClick={() => onModeChange(ViewMode.SPLIT)}
        aria-label="Split View"
      >
        <SplitSquareVertical size={18} />
        <span className="ml-2 hidden sm:inline">Split</span>
      </button>
    </div>
  );
};

export default Header;