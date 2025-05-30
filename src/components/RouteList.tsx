import React from 'react';
import { TruckRoute } from '../types';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';
import { useRouteContext } from '../context/RouteContext';
import { motion } from 'framer-motion';

const RouteList: React.FC<{ route: TruckRoute }> = ({ route }) => {
  const { warehouse } = useRouteContext();
  
  // Sort stops by sequence number
  const sortedStops = [...route.stops].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div 
        className="p-4 flex items-center justify-between"
        style={{ backgroundColor: `${route.color}20` }}
      >
        <div className="flex items-center">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3"
            style={{ backgroundColor: route.color }}
          >
            <Navigation size={18} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{route.name}</h3>
            <p className="text-sm text-gray-600">
              {route.stops.length} stops • {route.totalDistance.toFixed(2)} km
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-2">
        <div className="flex items-center p-3 bg-gray-50 rounded-md mb-2">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white mr-3">
            <MapPin size={16} />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-800">Start: {warehouse.name}</h4>
            <p className="text-xs text-gray-500">
              {warehouse.latitude.toFixed(6)}, {warehouse.longitude.toFixed(6)}
            </p>
          </div>
        </div>
        
        <div className="space-y-1 pl-4 relative">
          {/* Vertical line connecting stops */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          
          {/* Stops */}
          {sortedStops.map((stop, index) => (
            <motion.div 
              key={stop.customer.id}
              className="flex items-start py-3 pl-3 relative"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            >
              {/* Dot on vertical line */}
              <div className="absolute left-0 top-5 w-2 h-2 rounded-full bg-blue-500 z-10"></div>
              
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs mr-3 flex-shrink-0 mt-0.5"
                style={{ backgroundColor: route.color }}
              >
                {stop.sequenceNumber}
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{stop.customer.businessName}</h4>
                <p className="text-xs text-gray-500">
                  {stop.customer.latitude.toFixed(6)}, {stop.customer.longitude.toFixed(6)}
                </p>
                {stop.customer.googleMapsLink && (
                  <a
                    href={stop.customer.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline inline-flex items-center mt-1"
                  >
                    <span>Google Maps</span>
                    <ArrowRight size={12} className="ml-1" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex items-center p-3 bg-gray-50 rounded-md mt-2">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white mr-3">
            <MapPin size={16} />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-800">End: {warehouse.name}</h4>
            <p className="text-xs text-gray-500">
              {warehouse.latitude.toFixed(6)}, {warehouse.longitude.toFixed(6)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RouteList;