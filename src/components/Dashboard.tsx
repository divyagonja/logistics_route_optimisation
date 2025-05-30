import React, { useEffect, Suspense } from 'react';
import { useRouteContext } from '../context/RouteContext';
import Header from './Header';
import ImportPanel from './ImportPanel';
import RouteMap from './RouteMap';
import RouteList from './RouteList';
import RouteStatistics from './RouteStatistics';
import RouteSelector from './RouteSelector';
import { ViewMode } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { 
    viewMode, 
    routes, 
    customers, 
    optimizeRoutesForCustomers,
    isLoading
  } = useRouteContext();
  
  useEffect(() => {
    if (customers.length > 0) {
      optimizeRoutesForCustomers();
    }
  }, [customers, optimizeRoutesForCustomers]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <ImportPanel />
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center p-8"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </motion.div>
          ) : routes.length > 0 ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <RouteStatistics routes={routes} />
              <RouteSelector />
              
              <Suspense fallback={null}>
                {viewMode === ViewMode.MAP && (
                  <RouteMap />
                )}
                
                {viewMode === ViewMode.LIST && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {routes.map(route => (
                      <RouteList key={route.id} route={route} />
                    ))}
                  </div>
                )}
                
                {viewMode === ViewMode.SPLIT && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <RouteMap />
                    </div>
                    <div>
                      {routes.map(route => (
                        <div key={route.id} className="mb-6">
                          <RouteList route={route} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Suspense>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          Dairy Logistics Route Optimizer &copy; {new Date().getFullYear()} | Designed & Developed by <a href="https://divyagonja.netlify.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Divya Gonja</a>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;