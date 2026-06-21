import Link from "next/link";
import { Building2, CalendarDays, MapPin, ShieldCheck } from "lucide-react";

export default function PropertyCardSeoStrip({ property }) {
  if (!property) return null;

  const details = [
    { icon: ShieldCheck, label: "RERA", value: property.rera || "Verified" },
    { icon: Building2, label: "Developer", value: property.developer || "Top Pune Builder" },
    { icon: CalendarDays, label: "Possession", value: property.possession || "On Request" },
    { icon: MapPin, label: "Locality", value: property.location || "Pune" },
  ];

  return (
    <div className="border-t border-slate-100 bg-white px-4 pb-4 pt-3">
      <div className="grid grid-cols-2 gap-2 text-xs">
        {details.map(({ icon: Icon, label, value }) => (
          <div key={label} className="min-w-0 rounded-xl bg-slate-50 px-3 py-2">
            <div className="flex items-center gap-1.5 font-black uppercase tracking-widest text-slate-400">
              <Icon size={11} className="text-amber-500" />
              {label}
            </div>
            <p className="mt-1 truncate font-bold text-slate-700">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href={`/properties/location/${String(property.location || "pune").toLowerCase().split(",")[0].trim().replace(/\s+/g, "-")}`} className="text-xs font-bold text-amber-700 hover:underline">
          More in {property.location || "Pune"}
        </Link>
        {property.developer && (
          <span className="text-xs font-semibold text-slate-400">by {property.developer}</span>
        )}
      </div>
    </div>
  );
}
