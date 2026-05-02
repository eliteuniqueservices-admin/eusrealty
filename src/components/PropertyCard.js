import { BedDouble, Bath, Maximize, MapPin, ArrowRight } from 'lucide-react';

export default function PropertyCard({ title, location, price, beds, baths, area, image }) {
  return (
    <div className="group flex flex-col bg-white h-full overflow-hidden">
      
      {/* --- Image Container --- */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-100 rounded-2xl">
        <img 
          src={image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"} 
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        {/* Subtle gradient overlay to make the image look richer */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* --- Content Container --- */}
      <div className="pt-6 pb-2 flex flex-col flex-1">
        
        {/* Location & Title */}
        <div className="mb-auto">
          <div className="flex items-center gap-1.5 text-gray-500 mb-2 font-medium">
            <MapPin size={16} className="text-blue-500" />
            <span className="text-sm">{location}, West Pune</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-blue-600 transition-colors duration-300 tracking-tight">
            {title}
          </h3>
        </div>
        
        {/* Specifications Grid */}
        <div className="grid grid-cols-3 gap-2 py-5 border-y border-gray-100 mb-6">
          <div className="flex flex-col items-center justify-center gap-1 text-gray-600 border-r border-gray-100">
            <BedDouble size={20} className="text-gray-400 mb-1" />
            <span className="font-bold text-gray-900 text-sm">{beds} BHK</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 text-gray-600 border-r border-gray-100">
            <Bath size={20} className="text-gray-400 mb-1" />
            <span className="font-bold text-gray-900 text-sm">{baths} Bath</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 text-gray-600">
            <Maximize size={20} className="text-gray-400 mb-1" />
            <span className="font-bold text-gray-900 text-sm">{area} <span className="text-xs text-gray-500 font-medium">sq.ft</span></span>
          </div>
        </div>

        {/* Footer: Price & CTA */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Starting From</p>
            <p className="text-3xl font-black text-blue-600 leading-none">
              ₹{price}
            </p>
          </div>
          <button className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl hover:bg-blue-600 transition-all duration-300 font-bold active:scale-95 group/btn shadow-md">
            Details
            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}