import React, { useMemo } from 'react';
import { TruckRoute } from '../types';
import { BarChart3, TrendingDown, Route, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RouteStatisticsProps {
  routes: TruckRoute[];
}

const RouteStatistics: React.FC<RouteStatisticsProps> = ({ routes }) => {
  const stats = useMemo(() => {
    if (routes.length === 0) return null;
    
    const totalDistance = routes.reduce((sum, route) => sum + route.totalDistance, 0);
    const totalStops = routes.reduce((sum, route) => sum + route.stops.length, 0);
    const maxRouteDistance = Math.max(...routes.map(route => route.totalDistance));
    const minRouteDistance = Math.min(...routes.map(route => route.totalDistance));
    
    const routePercentages = routes.map(route => ({
      id: route.id,
      name: route.name,
      color: route.color,
      percentage: (route.totalDistance / totalDistance) * 100,
      stops: route.stops.length,
      distance: route.totalDistance
    }));
    
    return {
      totalDistance,
      totalStops,
      maxRouteDistance,
      minRouteDistance,
      routePercentages
    };
  }, [routes]);
  
  if (!stats) return null;
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      layout
    >
      <div className="flex items-center mb-4">
        <BarChart3 className="text-blue-600 mr-2" size={20} />
        <h2 className="text-lg font-bold text-gray-800">Route Statistics</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatsCard 
          icon={<Route size={18} />}
          label="Total Distance"
          value={`${stats.totalDistance.toFixed(2)} km`}
          color="bg-blue-100 text-blue-700"
        />
        
        <StatsCard 
          icon={<MapPin size={18} />}
          label="Total Stops"
          value={stats.totalStops.toString()}
          color="bg-green-100 text-green-700"
        />
        
        <StatsCard 
          icon={<TrendingDown size={18} />}
          label="Route Difference"
          value={`${(stats.maxRouteDistance - stats.minRouteDistance).toFixed(2)} km`}
          color="bg-purple-100 text-purple-700"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Route Distribution</h3>
        
        <AnimatePresence mode="wait">
          {stats.routePercentages.map(route => (
            <motion.div 
              key={route.id} 
              className="mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium" style={{ color: route.color }}>
                  {route.name}
                </span>
                <span className="text-gray-600">
                  {route.stops} stops • {route.distance.toFixed(2)} km
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="h-2.5 rounded-full"
                  style={{ backgroundColor: route.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${route.percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  layout
                ></motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, color }) => {
  return (
    <motion.div 
      className="bg-gray-50 rounded-lg p-3 flex items-center"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-bold text-gray-800">{value}</p>
      </div>
    </motion.div>
  );
};

export default RouteStatistics;