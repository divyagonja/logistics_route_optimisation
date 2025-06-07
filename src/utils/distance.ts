import { Coordinates, Customer, Warehouse } from '../types';
import { calculateRoadDistanceMatrix } from './routeApi';

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(point2.lat - point1.lat);
  const dLon = deg2rad(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Calculate distance matrix for a set of customers and warehouse
 * Uses road distances via API when possible, falls back to straight-line distances
 */
export async function calculateDistanceMatrix(
  customers: Customer[], 
  warehouse: Warehouse
): Promise<number[][]> {
  const points = [
    { lat: warehouse.latitude, lng: warehouse.longitude },
    ...customers.map(c => ({ lat: c.latitude, lng: c.longitude }))
  ];
  
  try {
    // Try to get road distances using the OpenRouteService API
    return await calculateRoadDistanceMatrix(points);
  } catch (error) {
    console.error('Failed to get road distances, falling back to straight-line distances:', error);
    
    // Fallback to straight-line distances
    const n = points.length;
    const distanceMatrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          distanceMatrix[i][j] = calculateDistance(points[i], points[j]);
        }
      }
    }
    
    return distanceMatrix;
  }
}

/**
 * Calculate total route distance
 */
export function calculateRouteDistance(
  route: number[], 
  distanceMatrix: number[][]
): number {
  let totalDistance = 0;
  
  for (let i = 0; i < route.length - 1; i++) {
    totalDistance += distanceMatrix[route[i]][route[i + 1]];
  }
  
  return totalDistance;
}