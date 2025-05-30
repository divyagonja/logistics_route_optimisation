import React, { useRef, useState } from 'react';
import { Upload, FileUp, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouteContext } from '../context/RouteContext';
import { motion } from 'framer-motion';

const ImportPanel: React.FC = () => {
  const { importCustomersFromCSV, optimizeRoutesForCustomers } = useRouteContext();
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    await processFile(files[0]);
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    await processFile(files[0]);
  };
  
  const processFile = async (file: File) => {
    setFileName(file.name);
    setError(null);
    setSuccess(false);
    
    // Check file type
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }
    
    try {
      await importCustomersFromCSV(file);
      setSuccess(true);
      optimizeRoutesForCustomers();
    } catch (err) {
      setError('Error processing file. Please check the format.');
      console.error(err);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="mb-6">
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : success
            ? 'border-green-500 bg-green-50'
            : error
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".csv"
        />
        
        <div className="flex flex-col items-center justify-center text-center">
          {success ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
            </motion.div>
          ) : error ? (
            <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
          ) : (
            <Upload className="h-12 w-12 text-blue-500 mb-2" />
          )}
          
          <h3 className="text-lg font-medium">
            {success
              ? 'File imported successfully!'
              : error
              ? 'Error importing file'
              : 'Import Customer Data'}
          </h3>
          
          <p className="text-sm text-gray-500 mt-1">
            {success
              ? fileName
              : error
              ? error
              : 'Drag and drop a CSV file here, or click to select'}
          </p>
          
          {!success && !error && (
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}
            >
              <FileUp className="h-4 w-4 mr-2" />
              <span>Select CSV File</span>
            </button>
          )}
          
          {success && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-green-600 mt-2"
            >
              Routes have been optimized!
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportPanel;