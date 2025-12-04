import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Lead } from '../types';

// Fix for default Leaflet icon not finding images in Webpack/bundler-less environments
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LeadsMapProps {
  leads: Lead[];
}

// Component to adjust map view bounds based on markers
const MapBounds = ({ leads }: { leads: Lead[] }) => {
  const map = useMap();

  useEffect(() => {
    if (leads.length > 0) {
      const validCoordinates = leads
        .filter(l => l.coordinates)
        .map(l => [l.coordinates!.lat, l.coordinates!.lng] as [number, number]);

      if (validCoordinates.length > 0) {
        const bounds = L.latLngBounds(validCoordinates);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [leads, map]);

  return null;
};

export const LeadsMap: React.FC<LeadsMapProps> = ({ leads }) => {
  // Filter leads that have coordinates
  const mapLeads = leads.filter(l => l.coordinates && l.coordinates.lat && l.coordinates.lng);
  
  // Default center (Europe/Africa/Asia junction) if no leads, or center of first lead
  const center: [number, number] = mapLeads.length > 0 
    ? [mapLeads[0].coordinates!.lat, mapLeads[0].coordinates!.lng]
    : [20, 0];

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 z-0">
      <MapContainer 
        center={center} 
        zoom={2} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {mapLeads.map((lead) => (
          <Marker 
            key={lead.id} 
            position={[lead.coordinates!.lat, lead.coordinates!.lng]}
          >
            <Popup>
              <div className="p-1">
                <strong className="block text-sm font-bold text-slate-800 mb-1">{lead.companyName}</strong>
                <span className="text-xs text-slate-500 block mb-2">{lead.address}</span>
                <a href={lead.website} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                    Visit Website
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <MapBounds leads={mapLeads} />
      </MapContainer>
    </div>
  );
};