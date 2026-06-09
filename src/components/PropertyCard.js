import { BedDouble, Bath, Maximize, MapPin, ArrowRight } from 'lucide-react';

export default function PropertyCard({ title, location, price, beds, bhk, baths, area, image }) {
  const displayBeds = beds || bhk;
  return (
    <div className="group flex flex-col bg-white h-full overflow-hidden border border-slate-100 rounded-3xl">
      
      {/* --- Image Container --- */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
        <img 
          src={image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"} 
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* --- Content Container --- */}
      <div className="px-6 sm:px-8 pt-8 pb-8 flex flex-col flex-1">
        
        {/* Location & Title */}
        <div className="mb-auto">
          <div className="flex items-center gap-1.5 text-slate-500 mb-3 font-medium">
            <MapPin size={16} className="text-amber-500" />
            <span className="text-sm tracking-wide">{location}</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-6 group-hover:text-amber-600 transition-colors duration-300 tracking-tight">
            {title}
          </h3>
        </div>
        
        {/* Specifications Grid */}
        <div className="grid grid-cols-3 gap-2 py-5 border-y border-slate-100 mb-6">
          <div className="flex flex-col items-center justify-center gap-1.5 text-slate-600 border-r border-slate-100">
            <BedDouble size={20} className="text-slate-400 mb-1" />
            <span className="font-bold text-slate-900 text-sm">{displayBeds} BHK</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 text-slate-600 border-r border-slate-100">
            <Bath size={20} className="text-slate-400 mb-1" />
            <span className="font-bold text-slate-900 text-sm">{baths} Bath</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 text-slate-600">
            <Maximize size={20} className="text-slate-400 mb-1" />
            <span className="font-bold text-slate-900 text-sm">{area} <span className="text-xs text-slate-500 font-medium">sq.ft</span></span>
          </div>
        </div>

        {/* Footer: Price & CTA */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-widest">Starting From</p>
            <p className="text-3xl font-black text-slate-900 leading-none group-hover:text-amber-500 transition-colors">
              ₹{price}
            </p>
          </div>
          
          {/* UPDATED BUTTON: "Building Rise" Animation added here */}
          <button className="relative overflow-hidden bg-slate-950 text-white px-6 py-3 rounded-xl font-bold active:scale-95 group/btn shadow-md hover:shadow-xl hover:shadow-slate-900/20 transition-all">
            <span className="absolute inset-0 w-full h-full bg-amber-500 origin-bottom transform scale-y-0 transition-transform duration-300 ease-out group-hover/btn:scale-y-100" />
            <span className="relative z-10 flex items-center gap-2 group-hover/btn:text-slate-950 transition-colors duration-300">
              Details
              <ArrowRight size={18} className="text-amber-400 group-hover/btn:text-slate-950 group-hover/btn:translate-x-1 transition-all duration-300" />
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}