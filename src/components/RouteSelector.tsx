import React from 'react';
import { useRouteContext } from '../context/RouteContext';
import { TruckRoute } from '../types';
import { Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const RouteSelector: React.FC = () => {
  const { routes, selectedRouteId, setSelectedRouteId } = useRouteContext();
  
  if (routes.length === 0) {
    return null;
  }
  
  const handleSelectRoute = (routeId: string | null) => {
    setSelectedRouteId(routeId === selectedRouteId ? null : routeId);
  };
  
  return (
    <motion.div 
      className="flex flex-wrap gap-2 mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors ${
          selectedRouteId === null
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        onClick={() => handleSelectRoute(null)}
      >
        <Truck size={16} className="mr-2" />
        <span>All Routes</span>
      </button>
      
      {routes.map(route => (
        <RouteButton
          key={route.id}
          route={route}
          isSelected={selectedRouteId === route.id}
          onClick={() => handleSelectRoute(route.id)}
        />
      ))}
    </motion.div>
  );
};

interface RouteButtonProps {
  route: TruckRoute;
  isSelected: boolean;
  onClick: () => void;
}

const RouteButton: React.FC<RouteButtonProps> = ({ route, isSelected, onClick }) => {
  return (
    <motion.button
      className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors`}
      style={{
        backgroundColor: isSelected ? route.color : `${route.color}20`,
        color: isSelected ? 'white' : route.color
      }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Truck size={16} className="mr-2" />
      <span>{route.name}</span>
    </motion.button>
  );
};

export default RouteSelector;