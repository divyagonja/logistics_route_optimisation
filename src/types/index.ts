export interface Customer {
  id: string;
  businessName: string;
  latitude: number;
  longitude: number;
  googleMapsLink: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RouteStop {
  customer: Customer;
  sequenceNumber: number;
}

export interface TruckRoute {
  id: string;
  name: string;
  color: string;
  stops: RouteStop[];
  totalDistance: number;
}

export interface Warehouse {
  name: string;
  latitude: number;
  longitude: number;
  googleMapsLink: string;
}

export enum ViewMode {
  MAP,
  LIST,
  SPLIT
}