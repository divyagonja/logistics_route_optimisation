import { Coordinates, Customer, Warehouse } from '../types';

// OpenRouteService API configuration
const ORS_API_KEY = '5b3ce3597851110001cf6248087ffc6fc8b34cdf89ee185abc125b7e'; // API key provided by user
const ORS_API_URL = 'https://api.openrouteservice.org/v2/matrix/driving-car';

/**
 * Interface for OpenRouteService Matrix API request
 */
interface ORSMatrixRequest {
  locations: number[][];
  metrics: string[];
  units?: string;
}

/**
 * Interface for OpenRouteService Matrix API response
 */
interface ORSMatrixResponse {
  distances: number[][];
  durations: number[][];
}

/**
 * Calculate road distance matrix using OpenRouteService API
 * @param points Array of coordinate points
 * @returns Promise with distance matrix
 */
export async function calculateRoadDistanceMatrix(
  points: Coordinates[]
): Promise<number[][]> {
  try {
    // Format locations for ORS API (note: ORS uses [lng, lat] format)
    const locations = points.map(point => [point.lng, point.lat]);
    
    // Prepare request body
    const requestBody: ORSMatrixRequest = {
      locations,
      metrics: ['distance'],
      units: 'km'
    };
    
    // Make API request
    const response = await fetch(ORS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ORS_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`OpenRouteService API error: ${response.status}`);
    }
    
    const data: ORSMatrixResponse = await response.json();
    return data.distances;
  } catch (error) {
    console.error('Error calculating road distances:', error);
    // Fallback to straight-line distance if API fails
    return calculateFallbackDistanceMatrix(points);
  }
}

/**
 * Fallback to calculate straight-line distance matrix if API fails
 * @param points Array of coordinate points
 * @returns Distance matrix
 */
function calculateFallbackDistanceMatrix(points: Coordinates[]): number[][] {
  const n = points.length;
  const distanceMatrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        distanceMatrix[i][j] = calculateHaversineDistance(points[i], points[j]);
      }
    }
  }
  
  return distanceMatrix;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param point1 First coordinate
 * @param point2 Second coordinate
 * @returns Distance in kilometers
 */
function calculateHaversineDistance(point1: Coordinates, point2: Coordinates): number {
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