import { Customer, RouteStop, TruckRoute, Warehouse } from '../types';
import { calculateDistanceMatrix, calculateRouteDistance } from './distance';

/**
 * Simple k-means clustering to divide customers into k clusters
 */
function kMeansClustering(customers: Customer[], k: number, maxIterations = 100): number[] {
  if (customers.length === 0) return [];
  if (customers.length <= k) return customers.map((_, i) => Math.min(i, k - 1));
  
  // Initialize centroids randomly
  const centroids: { lat: number; lng: number }[] = [];
  const seen = new Set<number>();
  
  while (centroids.length < k) {
    const idx = Math.floor(Math.random() * customers.length);
    if (seen.has(idx)) continue;
    seen.add(idx);
    
    centroids.push({
      lat: customers[idx].latitude,
      lng: customers[idx].longitude
    });
  }
  
  // Assign customers to clusters
  let clusters: number[] = Array(customers.length).fill(0);
  let iterations = 0;
  let changed = true;
  
  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;
    
    // Assign each customer to the nearest centroid
    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      let minDist = Number.MAX_VALUE;
      let nearestCluster = 0;
      
      for (let j = 0; j < k; j++) {
        const centroid = centroids[j];
        const dist = Math.pow(customer.latitude - centroid.lat, 2) + 
                     Math.pow(customer.longitude - centroid.lng, 2);
        
        if (dist < minDist) {
          minDist = dist;
          nearestCluster = j;
        }
      }
      
      if (clusters[i] !== nearestCluster) {
        clusters[i] = nearestCluster;
        changed = true;
      }
    }
    
    if (!changed) break;
    
    // Recalculate centroids
    const counts = Array(k).fill(0);
    const newCentroids = Array(k).fill(0).map(() => ({ lat: 0, lng: 0 }));
    
    for (let i = 0; i < customers.length; i++) {
      const cluster = clusters[i];
      const customer = customers[i];
      
      newCentroids[cluster].lat += customer.latitude;
      newCentroids[cluster].lng += customer.longitude;
      counts[cluster]++;
    }
    
    for (let i = 0; i < k; i++) {
      if (counts[i] > 0) {
        newCentroids[i].lat /= counts[i];
        newCentroids[i].lng /= counts[i];
      } else {
        // If a cluster is empty, reinitialize it
        const idx = Math.floor(Math.random() * customers.length);
        newCentroids[i] = {
          lat: customers[idx].latitude,
          lng: customers[idx].longitude
        };
      }
    }
    
    centroids.splice(0, k, ...newCentroids);
  }
  
  // Balance clusters if needed
  const clusterSizes = Array(k).fill(0);
  for (const cluster of clusters) {
    clusterSizes[cluster]++;
  }
  
  const avgSize = customers.length / k;
  const maxDeviation = Math.max(...clusterSizes) - Math.min(...clusterSizes);
  
  if (maxDeviation > avgSize * 0.5) {
    // If clusters are too imbalanced, try again
    return kMeansClustering(customers, k, maxIterations);
  }
  
  return clusters;
}

/**
 * Nearest neighbor algorithm for solving TSP
 */
function nearestNeighborTSP(
  startIdx: number, 
  nodes: number[], 
  distanceMatrix: number[][]
): number[] {
  const n = nodes.length;
  const visited = Array(n).fill(false);
  const tour = [startIdx];
  
  visited[startIdx] = true;
  let current = startIdx;
  
  for (let i = 1; i < n; i++) {
    let bestDist = Number.MAX_VALUE;
    let bestIdx = -1;
    
    for (let j = 0; j < n; j++) {
      if (!visited[j] && distanceMatrix[current][j] < bestDist) {
        bestDist = distanceMatrix[current][j];
        bestIdx = j;
      }
    }
    
    if (bestIdx !== -1) {
      tour.push(bestIdx);
      visited[bestIdx] = true;
      current = bestIdx;
    }
  }
  
  // Return to start
  tour.push(startIdx);
  
  return tour;
}

/**
 * 2-opt algorithm for improving TSP route
 */
function twoOptImprovement(
  route: number[], 
  distanceMatrix: number[][], 
  maxIterations = 100
): number[] {
  let improved = true;
  let iterations = 0;
  let bestRoute = [...route];
  let bestDistance = calculateRouteDistance(bestRoute, distanceMatrix);
  
  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;
    
    for (let i = 1; i < route.length - 2; i++) {
      for (let j = i + 1; j < route.length - 1; j++) {
        // Skip if edges are adjacent
        if (j - i === 1) continue;
        
        // Calculate current distance
        const a = route[i - 1];
        const b = route[i];
        const c = route[j];
        const d = route[j + 1];
        
        // Check if swapping edges (a,b) and (c,d) with (a,c) and (b,d) improves distance
        const currentDist = distanceMatrix[a][b] + distanceMatrix[c][d];
        const newDist = distanceMatrix[a][c] + distanceMatrix[b][d];
        
        if (newDist < currentDist) {
          // Perform 2-opt swap
          const newRoute = [...route];
          let left = i;
          let right = j;
          
          while (left < right) {
            [newRoute[left], newRoute[right]] = [newRoute[right], newRoute[left]];
            left++;
            right--;
          }
          
          const newTotalDist = calculateRouteDistance(newRoute, distanceMatrix);
          
          if (newTotalDist < bestDistance) {
            bestDistance = newTotalDist;
            bestRoute = [...newRoute];
            improved = true;
          }
        }
      }
    }
    
    route = [...bestRoute];
  }
  
  return bestRoute;
}

/**
 * Optimize routes for two trucks
 * Now uses async/await for road distance calculations
 */
export async function optimizeRoutes(
  customers: Customer[], 
  warehouse: Warehouse
): Promise<TruckRoute[]> {
  if (customers.length === 0) {
    return [];
  }
  
  // 1. Divide customers into two clusters
  const clusters = kMeansClustering(customers, 2);
  
  // 2. Create two groups of customers
  const groups: Customer[][] = [[], []];
  
  clusters.forEach((cluster, idx) => {
    groups[cluster].push(customers[idx]);
  });
  
  // 3. For each group, calculate optimal route
  const routes: TruckRoute[] = [];
  const colors = ['#0F52BA', '#00AB66']; // Blue and Green
  const names = ['Route Truck 1', 'Route Truck 2'];
  
  // Process each group sequentially with async/await
  for (let i = 0; i < 2; i++) {
    const groupCustomers = groups[i];
    
    if (groupCustomers.length === 0) continue;
    
    // Calculate distance matrix including warehouse - now async
    const distanceMatrix = await calculateDistanceMatrix(groupCustomers, warehouse);
    
    // Run TSP algorithm (nearest neighbor + 2-opt)
    let tour = nearestNeighborTSP(0, Array(groupCustomers.length + 1).fill(0).map((_, i) => i), distanceMatrix);
    tour = twoOptImprovement(tour, distanceMatrix);
    
    // Build route with customer information
    const stops: RouteStop[] = [];
    
    for (let j = 1; j < tour.length - 1; j++) {
      const customerIdx = tour[j] - 1; // Adjust for warehouse at index 0
      
      if (customerIdx >= 0 && customerIdx < groupCustomers.length) {
        stops.push({
          customer: groupCustomers[customerIdx],
          sequenceNumber: j
        });
      }
    }
    
    // Calculate total distance
    const totalDistance = calculateRouteDistance(tour, distanceMatrix);
    
    routes.push({
      id: `truck-${i + 1}`,
      name: names[i],
      color: colors[i],
      stops,
      totalDistance
    });
  }
  
  return routes;
}