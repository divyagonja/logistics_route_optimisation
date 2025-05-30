import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { divIcon, LatLngBounds, LatLng } from 'leaflet';
import { useRouteContext } from '../context/RouteContext';
import { motion } from 'framer-motion';

interface MapBounds {
  bounds: [[number, number], [number, number]];
  zoom: number;
}

const RouteMap: React.FC = () => {
  const { warehouse, routes, selectedRouteId } = useRouteContext();
  const [mapBounds, setMapBounds] = useState<MapBounds>({
    bounds: [[warehouse.latitude, warehouse.longitude], [warehouse.latitude, warehouse.longitude]],
    zoom: 13
  });

  // Calculate map bounds when routes change
  useEffect(() => {
    if (routes.length > 0) {
      const points = [
        [warehouse.latitude, warehouse.longitude],
        ...routes.flatMap(route => 
          route.stops.map(stop => [stop.customer.latitude, stop.customer.longitude])
        )
      ] as [number, number][];

      const latitudes = points.map(p => p[0]);
      const longitudes = points.map(p => p[1]);

      const southWest: [number, number] = [
        Math.min(...latitudes) - 0.01,
        Math.min(...longitudes) - 0.01
      ];
      const northEast: [number, number] = [
        Math.max(...latitudes) + 0.01,
        Math.max(...longitudes) + 0.01
      ];

      setMapBounds({
        bounds: [southWest, northEast],
        zoom: 12
      });
    }
  }, [routes, warehouse]);

  // Custom warehouse marker icon with memoization
  const warehouseIcon = useMemo(() => divIcon({
    html: `<div class="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-full shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect x="6" y="10" width="12" height="12"/><path d="M12 10v12"/></svg>
           </div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  }), []);

  // Generate customer marker icon with memoization
  const getCustomerIcon = useMemo(() => (routeColor: string, sequence: number) => {
    return divIcon({
      html: `<div class="flex items-center justify-center w-6 h-6 bg-white border-2 rounded-full shadow-md" style="border-color: ${routeColor}">
              <span class="text-xs font-bold" style="color: ${routeColor}">${sequence}</span>
             </div>`,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  }, []);

  return (
    <motion.div 
      className="h-[calc(100vh-12rem)] rounded-lg overflow-hidden shadow-md border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MapContainer
        bounds={mapBounds.bounds}
        zoom={mapBounds.zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBoundsUpdater bounds={mapBounds} />
        
        {/* Warehouse Marker */}
        <Marker
          position={[warehouse.latitude, warehouse.longitude]}
          icon={warehouseIcon}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold">{warehouse.name}</h3>
              <p className="text-sm text-gray-600">Central Warehouse</p>
              <a 
                href={warehouse.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm block mt-1 hover:underline"
              >
                View on Google Maps
              </a>
            </div>
          </Popup>
        </Marker>
        
        {/* Routes and Customer Markers */}
        {routes.map(route => {
          const isSelected = selectedRouteId === null || selectedRouteId === route.id;
          if (!isSelected) return null;
          
          const sortedStops = [...route.stops].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
          
          // Create route path including warehouse at start and end
          const routePath: [number, number][] = [
            [warehouse.latitude, warehouse.longitude],
            ...sortedStops.map(stop => [stop.customer.latitude, stop.customer.longitude] as [number, number]),
            [warehouse.latitude, warehouse.longitude]
          ];
          
          return (
            <React.Fragment key={route.id}>
              {/* Route line with animation */}
              <Polyline
                positions={routePath}
                pathOptions={{ 
                  color: route.color,
                  weight: 4,
                  opacity: 0.7,
                  dashArray: '10, 10',
                  lineCap: 'round'
                }}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold" style={{ color: route.color }}>{route.name}</h3>
                    <p className="text-sm text-gray-600">
                      {route.stops.length} stops • {route.totalDistance.toFixed(2)} km
                    </p>
                  </div>
                </Popup>
              </Polyline>
              
              {/* Customer markers */}
              {sortedStops.map(stop => (
                <Marker
                  key={stop.customer.id}
                  position={[stop.customer.latitude, stop.customer.longitude]}
                  icon={getCustomerIcon(route.color, stop.sequenceNumber)}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{stop.customer.businessName}</h3>
                      <p className="text-sm text-gray-600">Stop #{stop.sequenceNumber}</p>
                      <p className="text-xs text-gray-500">
                        {stop.customer.latitude.toFixed(6)}, {stop.customer.longitude.toFixed(6)}
                      </p>
                      {stop.customer.googleMapsLink && (
                        <a 
                          href={stop.customer.googleMapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-sm block mt-1 hover:underline"
                        >
                          View on Google Maps
                        </a>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </motion.div>
  );
};

// Helper component to update map bounds
interface MapBoundsUpdaterProps {
  bounds: MapBounds;
}

const MapBoundsUpdater: React.FC<MapBoundsUpdaterProps> = ({ bounds }) => {
  const map = useMap();
  
  useEffect(() => {
    const latLngBounds = new LatLngBounds(
      new LatLng(bounds.bounds[0][0], bounds.bounds[0][1]),
      new LatLng(bounds.bounds[1][0], bounds.bounds[1][1])
    );
    map.fitBounds(latLngBounds, { padding: [50, 50] });
  }, [map, bounds]);
  
  return null;
};

export default RouteMap;