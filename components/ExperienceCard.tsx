import React from 'react';
import { Place, ExperienceType } from '../types';
import { MapPin, ExternalLink } from 'lucide-react';

interface Props {
  place: Place;
}

export const ExperienceCard: React.FC<Props> = ({ place }) => {
  // Deterministic random image based on name length for visual consistency without real API
  const seed = place.name.length * 123; 
  const imageUrl = `https://picsum.photos/seed/${seed}/400/300`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <img 
          src={imageUrl} 
          alt={place.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-teal-700">
          {place.type}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1">{place.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{place.description}</p>
        
        {place.uri && (
          <a 
            href={place.uri} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-teal-600 font-medium hover:text-teal-700"
          >
            <MapPin size={16} className="mr-1" />
            View on Map <ExternalLink size={12} className="ml-1" />
          </a>
        )}
      </div>
    </div>
  );
};