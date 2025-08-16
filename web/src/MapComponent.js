import React, { useState, useEffect, useRef } from 'react';

const MapComponent = ({ onLocationSelect, radius = 100, userLocation }) => {
  const [position, setPosition] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    // Check if Leaflet is already loaded
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (leafletLoaded && mapRef.current && !mapLoaded) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        initializeMap();
      }, 100);
    }
  }, [leafletLoaded, mapLoaded]);

  // Update circle radius when radius prop changes
  useEffect(() => {
    if (circleRef.current && position) {
      circleRef.current.setRadius(radius);
    }
  }, [radius, position]);

  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    if (mapInstance.current) {
      mapInstance.current.setView([lat, lng], 16);
      
      // Remove existing marker and circle
      if (markerRef.current) {
        mapInstance.current.removeLayer(markerRef.current);
      }
      if (circleRef.current) {
        mapInstance.current.removeLayer(circleRef.current);
      }
      
      // Add new marker and circle
      markerRef.current = window.L.marker([lat, lng]).addTo(mapInstance.current);
      circleRef.current = window.L.circle([lat, lng], {
        radius: radius,
        fillColor: '#007AFF',
        fillOpacity: 0.2,
        color: '#007AFF',
        weight: 2
      }).addTo(mapInstance.current);
      
      const newPosition = { latitude: lat, longitude: lng };
      setPosition(newPosition);
      
      if (onLocationSelect) {
        onLocationSelect(newPosition);
      }
    }
    
    setSearchQuery(result.display_name);
    setSearchResults([]);
  };

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      searchLocation(query);
    }, 300);
  };

  const initializeMap = () => {
    if (!window.L || !mapRef.current || mapInstance.current) return;

    try {
      // Initialize map
      const center = userLocation ? [userLocation.latitude, userLocation.longitude] : [17.3850, 78.4867]; // Default to Hyderabad
      const map = window.L.map(mapRef.current, {
        center: center,
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Add tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Handle map clicks
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        
        // Remove existing marker and circle
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }
        if (circleRef.current) {
          map.removeLayer(circleRef.current);
        }
        
        // Add new marker
        markerRef.current = window.L.marker([lat, lng]).addTo(map);
        
        // Add circle
        circleRef.current = window.L.circle([lat, lng], {
          radius: radius,
          fillColor: '#007AFF',
          fillOpacity: 0.2,
          color: '#007AFF',
          weight: 2
        }).addTo(map);
        
        const newPosition = { latitude: lat, longitude: lng };
        setPosition(newPosition);
        
        if (onLocationSelect) {
          onLocationSelect(newPosition);
        }
      });

      // Ensure map renders properly
      setTimeout(() => {
        map.invalidateSize();
      }, 100);

      mapInstance.current = map;
      setMapLoaded(true);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  return (
    <div style={{ marginBottom: '15px' }}>
      <div style={{ position: 'relative', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search for a location (e.g., Hyderabad, India)"
          value={searchQuery}
          onChange={handleSearchInput}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
        
        {searchResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {searchResults.map((result, index) => (
              <div
                key={index}
                onClick={() => selectSearchResult(result)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: index < searchResults.length - 1 ? '1px solid #f0f0f0' : 'none',
                  fontSize: '14px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                📍 {result.display_name}
              </div>
            ))}
          </div>
        )}
        
        {isSearching && (
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#666',
            fontSize: '12px'
          }}>
            Searching...
          </div>
        )}
      </div>
      
      <div 
        ref={mapRef} 
        style={{ 
          height: '300px', 
          width: '100%',
          border: '2px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f0f0f0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {!mapLoaded && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#666',
            fontSize: '14px'
          }}>
            Loading map...
          </div>
        )}
      </div>
      
      {position && (
        <p style={{ 
          fontSize: '12px', 
          color: '#007AFF', 
          marginTop: '8px',
          fontFamily: 'monospace',
          backgroundColor: '#f8f9fa',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          📍 {position.latitude.toFixed(6)}, {position.longitude.toFixed(6)}
        </p>
      )}
      
      <p style={{ 
        fontSize: '12px', 
        color: '#666', 
        marginTop: '5px',
        fontStyle: 'italic'
      }}>
        {mapLoaded ? 'Search for a location above or click on the map to select' : 'Loading OpenStreetMap...'}
      </p>
    </div>
  );
};

export default MapComponent;