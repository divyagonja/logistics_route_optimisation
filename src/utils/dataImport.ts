import Papa from 'papaparse';
import { Customer } from '../types';

interface CSVRow {
  'Customer ID': string;
  'Business Name': string;
  'Latitude': string;
  'Longitude': string;
  'Google Maps Link': string;
  [key: string]: string;
}

export async function parseCSVFile(file: File): Promise<Customer[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const customers: Customer[] = [];
          const rows = results.data as CSVRow[];
          
          for (const row of rows) {
            const lat = parseFloat(row['Latitude']);
            const lng = parseFloat(row['Longitude']);
            
            if (isNaN(lat) || isNaN(lng)) {
              console.warn(`Skipping row with invalid coordinates: ${JSON.stringify(row)}`);
              continue;
            }
            
            customers.push({
              id: row['Customer ID'],
              businessName: row['Business Name'],
              latitude: lat,
              longitude: lng,
              googleMapsLink: row['Google Maps Link']
            });
          }
          
          resolve(customers);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}