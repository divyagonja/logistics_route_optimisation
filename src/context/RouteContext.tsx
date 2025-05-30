import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { Customer, TruckRoute, ViewMode, Warehouse } from '../types';
import { optimizeRoutes } from '../utils/optimization';
import { warehouse } from '../data/warehouse';
import { sampleCustomers } from '../data/sampleCustomers';
import { parseCSVFile } from '../utils/dataImport';

interface RouteContextType {
  customers: Customer[];
  routes: TruckRoute[];
  warehouse: Warehouse;
  viewMode: ViewMode;
  isLoading: boolean;
  selectedRouteId: string | null;
  setCustomers: (customers: Customer[]) => void;
  setViewMode: (mode: ViewMode) => void;
  setSelectedRouteId: (id: string | null) => void;
  optimizeRoutesForCustomers: () => void;
  importCustomersFromCSV: (file: File) => Promise<void>;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const RouteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [routes, setRoutes] = useState<TruckRoute[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.MAP);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const optimizeRoutesForCustomers = useCallback(() => {
    setIsLoading(true);
    
    try {
      const optimizedRoutes = optimizeRoutes(customers, warehouse);
      setRoutes(optimizedRoutes);
      
      // Select first route by default if available and none selected
      if (optimizedRoutes.length > 0 && !selectedRouteId) {
        setSelectedRouteId(optimizedRoutes[0].id);
      }
    } catch (error) {
      console.error('Error optimizing routes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [customers, selectedRouteId]);

  const importCustomersFromCSV = useCallback(async (file: File) => {
    setIsLoading(true);
    
    try {
      const importedCustomers = await parseCSVFile(file);
      setCustomers(importedCustomers);
      setSelectedRouteId(null); // Reset selection when importing new data
      return importedCustomers;
    } catch (error) {
      console.error('Error importing customers:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const contextValue = useMemo(() => ({
    customers,
    routes,
    warehouse,
    viewMode,
    isLoading,
    selectedRouteId,
    setCustomers,
    setViewMode,
    setSelectedRouteId,
    optimizeRoutesForCustomers,
    importCustomersFromCSV
  }), [
    customers,
    routes,
    viewMode,
    isLoading,
    selectedRouteId,
    optimizeRoutesForCustomers,
    importCustomersFromCSV
  ]);

  return (
    <RouteContext.Provider value={contextValue}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRouteContext = (): RouteContextType => {
  const context = useContext(RouteContext);
  
  if (context === undefined) {
    throw new Error('useRouteContext must be used within a RouteProvider');
  }
  
  return context;
};