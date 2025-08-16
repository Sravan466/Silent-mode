import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapComponent from './MapComponent';
import './App.css';

const API_BASE_URL = 'http://localhost:8080/api';

function App() {
  const [user, setUser] = useState(null);
  const [zones, setZones] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [zoneData, setZoneData] = useState({
    name: '',
    latitude: null,
    longitude: null,
    radius: 100,
    mode: 'silent'
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('myzones');
  const [zoneAddresses, setZoneAddresses] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState({});
  const [formStep, setFormStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: API_BASE_URL,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;
      
      const response = await api.post(endpoint, payload);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      fetchZones();
    } catch (error) {
      alert(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const fetchZones = async () => {
    try {
      const response = await api.get('/zones');
      const zonesData = response.data;
      setZones(zonesData);
      
      // Get addresses for all zones
      const addresses = {};
      for (const zone of zonesData) {
        const lat = zone.location.coordinates[1];
        const lng = zone.location.coordinates[0];
        addresses[zone._id] = await getAddressFromCoordinates(lat, lng);
      }
      setZoneAddresses(addresses);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!zoneData.name.trim()) errors.name = 'Zone name is required';
    if (!zoneData.latitude || !zoneData.longitude) errors.location = 'Please select a location';
    if (zoneData.radius < 10 || zoneData.radius > 1000) errors.radius = 'Radius must be between 10-1000m';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createZone = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsCreating(true);
    try {
      const response = await api.post('/zones', {
        ...zoneData,
        latitude: zoneData.latitude,
        longitude: zoneData.longitude,
        radius: zoneData.radius
      });
      const newZone = response.data;
      setZones([...zones, newZone]);
      
      // Get address for new zone
      const lat = newZone.location.coordinates[1];
      const lng = newZone.location.coordinates[0];
      const address = await getAddressFromCoordinates(lat, lng);
      setZoneAddresses(prev => ({ ...prev, [newZone._id]: address }));
      
      setZoneData({ name: '', latitude: null, longitude: null, radius: 100, mode: 'silent' });
      switchTab('myzones');
      
      // Show success animation
      setTimeout(() => {
        const newCard = document.querySelector(`[data-zone-id="${newZone._id}"]`);
        if (newCard) {
          newCard.classList.add('zone-created-animation');
        }
      }, 300);
    } catch (error) {
      setFormErrors({ submit: 'Failed to create zone. Please try again.' });
    } finally {
      setIsCreating(false);
    }
  };

  const nextStep = () => {
    if (formStep === 1 && !zoneData.name.trim()) {
      setFormErrors({ name: 'Zone name is required' });
      return;
    }
    if (formStep === 2 && (!zoneData.latitude || !zoneData.longitude)) {
      setFormErrors({ location: 'Please select a location' });
      return;
    }
    setFormErrors({});
    setFormStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setFormStep(prev => Math.max(prev - 1, 1));
    setFormErrors({});
  };

  const handleLocationSelect = (location) => {
    setZoneData({
      ...zoneData,
      latitude: location.latitude,
      longitude: location.longitude
    });
  };

  const switchTab = (tab) => {
    setIsTransitioning(true);
    if (tab === 'addzone') {
      setFormStep(1);
      setFormErrors({});
    }
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 150);
  };

  const toggleAddressView = (zoneId) => {
    setShowFullAddress(prev => ({
      ...prev,
      [zoneId]: !prev[zoneId]
    }));
  };

  const getShortAddress = (fullAddress) => {
    if (!fullAddress) return 'Loading...';
    const parts = fullAddress.split(',');
    return parts.slice(0, 2).join(',').trim();
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied');
          // Default to Hyderabad
          setUserLocation({ latitude: 17.3850, longitude: 78.4867 });
        }
      );
    } else {
      // Default to Hyderabad
      setUserLocation({ latitude: 17.3850, longitude: 78.4867 });
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const deleteZone = async (id) => {
    try {
      await api.delete(`/zones/${id}`);
      setZones(zones.filter(zone => zone._id !== id));
    } catch (error) {
      alert('Failed to delete zone');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setZones([]);
  };

  if (!user) {
    return (
      <div className="container">
        <div className="auth-form">
          <h1>Silent Zone</h1>
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          <form onSubmit={handleAuth}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
            </button>
          </form>
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="modern-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">🔇</div>
            <h1 className="app-title">Silent Zone</h1>
          </div>
          
          <nav className="main-nav">
            <button 
              className={`nav-item ${activeTab === 'myzones' ? 'active' : ''}`}
              onClick={() => setActiveTab('myzones')}
            >
              <span className="nav-icon">📍</span>
              My Zones
            </button>
            <button 
              className={`nav-item ${activeTab === 'addzone' ? 'active' : ''}`}
              onClick={() => setActiveTab('addzone')}
            >
              <span className="nav-icon">+</span>
              Add Zone
            </button>
          </nav>
          <div className="user-section">
            <div className="user-profile" onClick={() => setShowUserMenu(!showUserMenu)}>
              <div className="user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user.username}</span>
              <div className="dropdown-arrow">▼</div>
            </div>
            {showUserMenu && (
              <div className="user-menu">
                <div className="menu-item">Profile</div>
                <div className="menu-item">Settings</div>
                <div className="menu-divider"></div>
                <div className="menu-item logout" onClick={logout}>Logout</div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-container">
          {activeTab === 'myzones' ? (
            <div className="zones-section full-width">
              <div className="section-header">
                <h2>My Silent Zones</h2>
                <div className="header-actions">
                  <span className="zone-count">{zones.length} zones</span>
                  <button className="add-zone-btn" onClick={() => setActiveTab('addzone')}>
                    <span>+</span> Add Zone
                  </button>
                </div>
              </div>
              
              {zones.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📍</div>
                  <h3>Your Zones Will Appear Here</h3>
                  <p>Add a zone to automatically silence your phone at work, school, or any location.</p>
                  <button className="cta-button" onClick={() => setActiveTab('addzone')}>
                    + Add Your First Zone
                  </button>
                </div>
              ) : (
                <div className="zones-grid">
                  {zones.map(zone => (
                    <div key={zone._id} className="modern-zone-card">
                      <div className="zone-header">
                        <div className="zone-icon">
                          {zone.mode === 'silent' ? '🔇' : '📳'}
                        </div>
                        <div className="zone-info">
                          <h3>{zone.name}</h3>
                          <p className="zone-mode">
                            {zone.mode === 'silent' ? 'Silent Mode' : 'Vibrate Mode'}
                          </p>
                        </div>
                        <div className="zone-status">
                          <span className="status-badge active">Active</span>
                        </div>
                      </div>
                      <div className="zone-details">
                        <div className="detail-item">
                          <span className="detail-label">Radius</span>
                          <span className="detail-value">{zone.radius}m</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Location</span>
                          <span className="detail-value address">
                            {zoneAddresses[zone._id] || 'Loading address...'}
                          </span>
                        </div>
                      </div>
                      <div className="zone-actions">
                        <button className="edit-button">Edit</button>
                        <button className="delete-button" onClick={() => deleteZone(zone._id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="add-zone-section full-width">
              <div className="form-card">
                <div className="form-header">
                  <button className="back-button" onClick={() => switchTab('myzones')}>
                    <span className="back-icon">←</span>
                    Back to My Zones
                  </button>
                  <h2 className="form-title">Create New Zone</h2>
                </div>
                
                {formErrors.submit && (
                  <div className="error-banner">
                    <span className="error-icon">⚠️</span>
                    {formErrors.submit}
                  </div>
                )}
                
                <form onSubmit={createZone} className="modern-form">
                  <div className="form-group">
                    <label htmlFor="zone-name">Zone Name</label>
                    <div className="input-container">
                      <input
                        id="zone-name"
                        type="text"
                        placeholder="e.g., Office, Library, Hospital"
                        value={zoneData.name}
                        onChange={(e) => setZoneData({...zoneData, name: e.target.value})}
                        className={formErrors.name ? 'error' : ''}
                      />
                    </div>
                    {formErrors.name && <div className="error-text">{formErrors.name}</div>}
                  </div>

                  <div className="form-group">
                    <label>Select Location</label>
                    <p className="form-hint">Search or click on the map to choose your silent zone location</p>
                    <div className="map-container-wrapper">
                      <MapComponent
                        onLocationSelect={handleLocationSelect}
                        radius={zoneData.radius}
                        userLocation={userLocation}
                      />
                    </div>
                    {formErrors.location && <div className="error-text">{formErrors.location}</div>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="radius">Zone Radius</label>
                      <div className="radius-control">
                        <input
                          id="radius"
                          type="range"
                          min="10"
                          max="1000"
                          value={zoneData.radius}
                          onChange={(e) => setZoneData({...zoneData, radius: parseInt(e.target.value)})}
                          className="radius-slider"
                        />
                        <div className="radius-display">
                          <span className="radius-value">{zoneData.radius}</span>
                          <span className="radius-unit">meters</span>
                        </div>
                      </div>
                      {formErrors.radius && <div className="error-text">{formErrors.radius}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label>Audio Mode</label>
                      <div className="mode-cards">
                        <div 
                          className={`mode-card ${zoneData.mode === 'silent' ? 'selected' : ''}`}
                          onClick={() => setZoneData({...zoneData, mode: 'silent'})}
                        >
                          <div className="mode-card-icon">🔇</div>
                          <div className="mode-card-title">Silent</div>
                          <div className="mode-card-desc">Complete silence</div>
                        </div>
                        <div 
                          className={`mode-card ${zoneData.mode === 'vibrate' ? 'selected' : ''}`}
                          onClick={() => setZoneData({...zoneData, mode: 'vibrate'})}
                        >
                          <div className="mode-card-icon">📳</div>
                          <div className="mode-card-title">Vibrate</div>
                          <div className="mode-card-desc">Vibration only</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-footer">
                    <button type="submit" className={`create-button ${isCreating ? 'loading' : ''}`} disabled={isCreating}>
                      <div className="create-btn-content">
                        {isCreating ? (
                          <>
                            <div className="loading-spinner"></div>
                            <span>Creating Zone...</span>
                          </>
                        ) : (
                          <>
                            <span className="create-icon">+</span>
                            <span>Create Zone</span>
                          </>
                        )}
                      </div>
                      <div className="btn-ripple"></div>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;