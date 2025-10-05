import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPinType } from '../types';
import { MAP_PINS } from '../constants';
import { Card } from './Card';

// Helper component to force map resize on load to prevent gray tiles
function ResizeMapOnLoad() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// Helper function to create our custom-styled icons from pin data
const createCustomIcon = (pin) => {
  const pinColors = {
    [MapPinType.SAFE_LOCATION]: '#10B981', // green
    [MapPinType.INCIDENT]: '#EF4444',     // red
    [MapPinType.VOLUNTEER]: '#3B82F6',   // blue
  };
  const pinIcon = {
    [MapPinType.SAFE_LOCATION]: '🏠',
    [MapPinType.INCIDENT]: '⚠️',
    [MapPinType.VOLUNTEER]: '❤️',
  };

  return L.divIcon({
    html: `<div style="background-color: ${pinColors[pin.type]};" class="w-8 h-8 rounded-full flex items-center justify-center text-white text-lg shadow-lg ring-2 ring-white">${pinIcon[pin.type]}</div>`,
    className: 'bg-transparent border-0',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Component to find, display, and follow the user's location
function LocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
    locationerror(e) {
      alert(e.message);
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  const userIcon = L.divIcon({
    html: `<div class="w-5 h-5 bg-blue-500 rounded-full ring-4 ring-blue-200 animate-pulse"></div>`,
    className: 'bg-transparent border-0',
    iconSize: [20, 20],
  });

  return position === null ? null : (
    <Marker position={position} icon={userIcon}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

// The main InteractiveMap component
export const InteractiveMap = () => {
  const mapCenter = [20.2961, 85.8245]; // Bhubaneswar

  return (
    <Card className="h-full w-full relative overflow-hidden">
      <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <ResizeMapOnLoad />
        
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker />

        {MAP_PINS.map(pin => (
          <Marker key={pin.id} position={pin.position} icon={createCustomIcon(pin)}>
            <Popup>
              <div className="w-48">
                <h3 className="font-bold text-sm">{pin.title}</h3>
                <p className="text-xs text-gray-600">{pin.details}</p>
                {pin.extra && <p className="text-xs text-gray-800 mt-1 font-semibold">{pin.extra}</p>}
                {pin.type === MapPinType.SAFE_LOCATION && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const query = encodeURIComponent(pin.title);
                      const lat = pin.position[0];
                      const lon = pin.position[1];
                      window.open(`https://www.google.com/maps/search/?api=1&query=${query}&ll=${lat},${lon}`, '_blank');
                    }}
                    className="mt-2 w-full text-xs bg-brand-blue text-white py-1 px-2 rounded hover:bg-brand-blue-dark transition-colors">
                    Navigate
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-md z-[1000]">
        <h4 className="font-bold text-sm mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-brand-green mr-2"></span>Safe Location</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-brand-red mr-2"></span>Incident</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-brand-blue mr-2"></span>Volunteer</div>
        </div>
      </div>
    </Card>
  );
};