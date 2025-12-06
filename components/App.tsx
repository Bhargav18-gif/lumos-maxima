import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { AppView, Place, DayPlan, Guide, ExperienceType } from './types';
import { searchHiddenGems, generateItinerary, getGuideRecommendation } from './services/geminiService';
import { ExperienceCard } from './components/ExperienceCard';
import { PaymentView } from './components/PaymentView';
import { Search, MapPin, Sparkles, Filter, Calendar as CalendarIcon, Clock, ChevronRight, User } from 'lucide-react';

const MOCK_GUIDES: Guide[] = [
  {
    id: '1',
    name: 'Elena Rossi',
    bio: 'Art historian and foodie born in Rome. I show you the layers of history tourists miss.',
    specialties: ['History', 'Street Food'],
    rating: 4.9,
    pricePerDay: 150,
    reviews: 124,
    imageUrl: 'https://picsum.photos/seed/elena/200/200'
  },
  {
    id: '2',
    name: 'Kenji Sato',
    bio: 'Nature photographer based in Kyoto. Let’s find the quietest temples and best hiking trails.',
    specialties: ['Nature', 'Photography'],
    rating: 5.0,
    pricePerDay: 200,
    reviews: 89,
    imageUrl: 'https://picsum.photos/seed/kenji/200/200'
  },
  {
    id: '3',
    name: 'Sarah Jenkins',
    bio: 'Urban explorer in London. I know every secret speakeasy and underground gallery.',
    specialties: ['Nightlife', 'Modern Art'],
    rating: 4.8,
    pricePerDay: 120,
    reviews: 210,
    imageUrl: 'https://picsum.photos/seed/sarah/200/200'
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DISCOVER);
  const [location, setLocation] = useState('Kyoto, Japan');
  const [places, setPlaces] = useState<Place[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<DayPlan[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  
  // Search Filters
  const [mood, setMood] = useState('Authentic');
  
  // Initial Load
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { places: newPlaces, events: newEvents } = await searchHiddenGems(location, mood);
      setPlaces(newPlaces);
      setEvents(newEvents);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateItinerary = async () => {
    setLoading(true);
    try {
      const result = await generateItinerary(location, 3, mood);
      setItinerary(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Views

  const renderDiscover = () => (
    <div className="pb-24 pt-4 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Hero Search */}
      <div className="bg-teal-700 rounded-3xl p-6 md:p-12 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Discover the Undiscovered</h1>
          <p className="text-teal-100 mb-8 max-w-lg">Find authentic experiences, hidden gems, and local secrets curated by AI.</p>
          
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-3">
              <MapPin className="text-gray-400 mr-2" />
              <input 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
                placeholder="Where to?"
              />
            </div>
            <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-3 relative group">
              <Filter className="text-gray-400 mr-2" />
              <select 
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-800 appearance-none cursor-pointer"
              >
                <option>Authentic & Local</option>
                <option>Adventure & Active</option>
                <option>Relaxed & Chill</option>
                <option>Foodie Paradise</option>
                <option>Arts & Culture</option>
              </select>
            </div>
            <button 
              onClick={handleSearch}
              className="bg-teal-400 hover:bg-teal-300 text-teal-900 font-bold py-3 px-8 rounded-xl transition-colors flex items-center justify-center"
            >
              {loading ? 'Searching...' : <Search />}
            </button>
          </div>
        </div>
      </div>

      {/* Events / Live Updates */}
      {events.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center mb-4">
             <Sparkles className="text-amber-500 mr-2" />
             <h2 className="text-xl font-bold">Happening This Week</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {events.map((evt, i) => (
              <div key={i} className="min-w-[280px] bg-amber-50 border border-amber-100 p-4 rounded-lg">
                <p className="font-medium text-amber-900 text-sm line-clamp-3">{evt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Results */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Hidden Gems in {location}</h2>
        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1,2,3].map(i => (
               <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
             ))}
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place, i) => (
              <ExperienceCard key={i} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderItinerary = () => (
    <div className="pb-24 pt-8 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Personal Guide</h1>
        <p className="text-gray-600">AI-curated daily plans for {location}</p>
      </div>

      {itinerary.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
           <CalendarIcon className="mx-auto text-teal-600 mb-4" size={48} />
           <h3 className="text-xl font-bold mb-2">Plan your trip to {location}</h3>
           <p className="text-gray-500 mb-6">Get a day-by-day plan tailored to {mood} experiences.</p>
           <button 
             onClick={handleGenerateItinerary}
             disabled={loading}
             className="bg-teal-600 text-white px-8 py-3 rounded-full font-bold hover:bg-teal-700 disabled:opacity-50 transition"
           >
             {loading ? 'Designing Plan...' : 'Generate Itinerary'}
           </button>
        </div>
      ) : (
        <div className="space-y-8">
           <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">3-Day Plan</h2>
              <button onClick={() => setItinerary([])} className="text-teal-600 text-sm font-medium">Reset</button>
           </div>
           {itinerary.map((day) => (
             <div key={day.day} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="bg-teal-50 px-6 py-4 border-b border-teal-100 flex justify-between items-center">
                 <h3 className="font-bold text-teal-800">Day {day.day}</h3>
                 <span className="text-xs bg-white px-2 py-1 rounded text-teal-600 font-medium border border-teal-100">{day.theme}</span>
               </div>
               <div className="p-6 space-y-6">
                 {day.activities.map((act, idx) => (
                   <div key={idx} className="flex gap-4">
                     <div className="flex-shrink-0 w-16 text-sm font-bold text-gray-400 pt-1">
                       {act.time}
                     </div>
                     <div className="pb-6 border-l-2 border-gray-100 pl-6 relative last:pb-0 last:border-0">
                       <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-teal-200 border-2 border-white"></div>
                       <h4 className="font-bold text-gray-900">{act.activity}</h4>
                       <div className="flex items-center text-xs text-gray-500 mt-1 mb-2">
                         <MapPin size={12} className="mr-1" /> {act.location}
                       </div>
                       <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{act.notes}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );

  const renderGuides = () => (
    <div className="pb-24 pt-8 px-4 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Connect with Locals</h1>
        <p className="text-gray-600">Expert guides to show you the real {location}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_GUIDES.map(guide => (
          <div key={guide.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="h-32 bg-teal-600 relative">
               <div className="absolute -bottom-8 left-6">
                 <img src={guide.imageUrl} alt={guide.name} className="w-20 h-20 rounded-full border-4 border-white object-cover" />
               </div>
            </div>
            <div className="pt-10 pb-6 px-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                 <div>
                    <h3 className="font-bold text-lg">{guide.name}</h3>
                    <div className="flex items-center text-yellow-500 text-sm">
                      <span className="font-bold">{guide.rating}</span>
                      <span className="text-gray-300 mx-1">•</span>
                      <span className="text-gray-400">{guide.reviews} reviews</span>
                    </div>
                 </div>
                 <div className="text-right">
                    <span className="block font-bold text-xl text-teal-600">${guide.pricePerDay}</span>
                    <span className="text-xs text-gray-400">per person</span>
                 </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                 {guide.specialties.map(s => (
                   <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{s}</span>
                 ))}
              </div>

              <p className="text-sm text-gray-600 mb-6 flex-1">"{guide.bio}"</p>

              <button 
                onClick={() => {
                  setSelectedGuide(guide);
                  setCurrentView(AppView.PAYMENT);
                }}
                className="w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition flex items-center justify-center group"
              >
                Book Guide <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile-first top bar (mostly for mobile view) */}
      <div className="md:hidden sticky top-0 bg-white/80 backdrop-blur-md z-40 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
         <span className="font-bold text-teal-600 text-lg">HiddenPaths</span>
         <button className="p-2 bg-gray-100 rounded-full">
            <User size={20} className="text-gray-600" />
         </button>
      </div>

      <main className="min-h-screen">
        {currentView === AppView.DISCOVER && renderDiscover()}
        {currentView === AppView.ITINERARY && renderItinerary()}
        {currentView === AppView.GUIDES && renderGuides()}
        {currentView === AppView.PAYMENT && selectedGuide && (
          <PaymentView 
            guide={selectedGuide} 
            onBack={() => setCurrentView(AppView.GUIDES)} 
            onComplete={() => setCurrentView(AppView.GUIDES)}
          />
        )}
      </main>

      {currentView !== AppView.PAYMENT && (
        <Navigation currentView={currentView} onChangeView={setCurrentView} />
      )}
    </div>
  );
}