DEMO - https://dairyrouteoptimizer.netlify.app/

# 🚚 Dairy Logistics Route Optimizer

A sophisticated React application that optimizes delivery routes for a dairy distribution company in Ahmedabad. The system automatically calculates the most efficient delivery routes for two trucks, minimizing fuel costs and travel distance while ensuring optimal customer coverage.

## ✨ Features

- **Smart Route Optimization**: Automatically divides customers between two delivery trucks and calculates optimal routes
- **Interactive Map View**: Real-time visualization of delivery routes using OpenStreetMap
- **Multiple View Modes**: 
  - Map View: Visual representation of routes on the map
  - List View: Detailed sequence of stops for each route
  - Split View: Combined map and list view
- **Route Statistics**: Comprehensive metrics including total distance, stops, and route distribution
- **CSV Import**: Easy data import through drag-and-drop or file selection
- **Responsive Design**: Fully responsive layout that works on all device sizes
- **Smooth Animations**: Beautiful transitions and interactions using Framer Motion

## 🛠️ Technology Stack

- **React**: Frontend framework
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Leaflet/React-Leaflet**: Interactive maps
- **Framer Motion**: Smooth animations and transitions
- **Papa Parse**: CSV parsing
- **Lucide React**: Beautiful icons
- **Vite**: Next-generation frontend tooling

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd logistics-route-optimization
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📦 Project Structure

```
src/
├── components/         # React components
├── context/           # React context providers
├── data/             # Static data and sample data
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── main.tsx          # Application entry point
```

## 🎯 Core Features

### Route Optimization Algorithm

The application uses a sophisticated route optimization algorithm that:
1. Divides customers into optimal clusters using K-means clustering
2. Solves the Traveling Salesman Problem (TSP) for each cluster using:
   - Nearest Neighbor algorithm for initial route
   - 2-opt improvement for route optimization
3. Balances workload between trucks while minimizing total distance

### Interactive Map Features

- Real-time route visualization
- Custom markers for warehouse and delivery stops
- Route sequence indicators
- Interactive popups with customer information
- Automatic map bounds adjustment

### Data Management

- CSV file import support
- Data validation and error handling
- Real-time route recalculation
- Sample data for demonstration

## 📊 Input Data Format

The application accepts CSV files with the following columns:
- Customer ID
- Business Name
- Latitude
- Longitude
- Google Maps Link

## 🔒 Constraints

- All customers must be visited
- Each customer is assigned to only one truck
- Routes start and end at the central warehouse
- Routes are optimized for minimum total distance

## 🎨 UI/UX Features

- Clean, modern interface
- Smooth transitions and animations
- Responsive design for all screen sizes
- Multiple view modes for different use cases
- Real-time statistics and updates
- Interactive route selection
- Loading states and error handling

## 📝 License

MIT License

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
