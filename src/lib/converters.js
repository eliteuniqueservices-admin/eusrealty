// c:\Users\rahul\eusrealty\src\lib\converters.js

export const UNITS = {
  area: {
    "square-meter": {
      name: "Square Meter",
      plural: "Square Meters",
      symbol: "sq m",
      factor: 1.0, // Base unit for area is Square Meter
      description: "A square meter (sq m) is a standard metric unit of area measurement. It is defined as the area of a square with sides measuring exactly one meter. It is the primary metric unit for real estate transactions in India, Europe, and globally under the International System of Units (SI). When buying apartments or commercial offices, property rates are often quoted per square meter, especially in official regulatory filings like RERA.",
    },
    "square-feet": {
      name: "Square Foot",
      plural: "Square Feet",
      symbol: "sq ft",
      factor: 0.09290304, // 1 sq ft = 0.09290304 sq m
      description: "A square foot (sq ft) is an imperial unit of area measurement widely used in real estate markets across India, the United States, the United Kingdom, and Canada. It is defined as the area of a square with sides of exactly one foot. In Indian real estate, apartments, residential houses, and commercial spaces are almost universally bought, sold, and rented based on their carpet area or built-up area measured in square feet.",
    },
    "hectare": {
      name: "Hectare",
      plural: "Hectares",
      symbol: "ha",
      factor: 10000.0, // 1 hectare = 10,000 sq m
      description: "A hectare (ha) is a metric unit of area equal to 10,000 square meters or approximately 2.471 acres. It is primarily used to measure large tracts of agricultural land, planning forests, and surveying rural areas. In India, agricultural land holdings, land acquisition projects, and government development zones are frequently measured and registered in hectares.",
    },
    "acre": {
      name: "Acre",
      plural: "Acres",
      symbol: "ac",
      factor: 4046.8564224, // 1 acre = 4046.8564224 sq m (or 43,560 sq ft)
      description: "An acre is a traditional imperial unit of land area measurement used extensively in India, the US, and the UK. Historically defined as the amount of land that could be plowed by a yoke of oxen in one day, it is equivalent to 43,560 square feet or 4,047 square meters. It is the most popular unit for measuring agricultural land plots, farmhouses, and industrial estates in India.",
    },
    "square-yard": {
      name: "Square Yard",
      plural: "Square Yards",
      symbol: "sq yd",
      factor: 0.83612736, // 1 sq yd = 9 sq ft = 0.83612736 sq m
      description: "A square yard (sq yd) is an imperial unit of area equal to nine square feet or approximately 0.836 square meters. In India, particularly in northern and western states like Delhi, Haryana, Punjab, and Telangana, municipal corporations and development authorities express plot sizes, residential layouts, and land rates in square yards (often referred to locally as 'Gaj').",
    },
    "cent": {
      name: "Cent",
      plural: "Cents",
      symbol: "cent",
      factor: 40.468564224, // 1 cent = 1/100 of an acre = 435.6 sq ft = 40.46856 sq m
      description: "A cent is a traditional unit of area measurement popular in southern Indian states, including Tamil Nadu, Kerala, Andhra Pradesh, and Karnataka. One cent is defined as 1/100th of an acre, which is equal to 435.6 square feet or approximately 40.47 square meters. It is frequently used for measuring residential plots and small agricultural parcels.",
    },
    "bigha": {
      name: "Bigha",
      plural: "Bigha",
      symbol: "bigha",
      factor: 2529.285264, // Standard Pucca Bigha = 27,000 sq ft = 2529.285 sq m
      description: "Bigha is a traditional unit of land area measurement used across northern and central parts of India, Bangladesh, and Nepal. Unlike metric units, the size of a Bigha varies significantly from state to state. For instance, in Bihar and Uttar Pradesh, a Pucca Bigha is equivalent to 27,000 square feet, whereas in Maharashtra and Gujarat, it is smaller (often around 17,424 sq ft or 16,187 sq ft). It is extensively used in rural real estate transactions.",
      regionalNote: "Note: Bigha is a regional unit. The standard conversion used here is 1 Pucca Bigha = 27,000 sq ft (2,529.28 sq m), which is common in UP, Bihar, and Rajasthan. In Maharashtra, 1 Bigha is typically equal to 20 Gunthas (21,780 sq ft or 2,023 sq m), and in West Bengal, it is 14,400 sq ft (1,337.8 sq m)."
    },
    "square-kilometer": {
      name: "Square Kilometer",
      plural: "Square Kilometers",
      symbol: "sq km",
      factor: 1000000.0,
      description: "A square kilometer (sq km) is a metric unit of area measurement equal to one million square meters. It is used to describe large geographical regions, city sizes, forest areas, and country sizes.",
    },
    "square-inch": {
      name: "Square Inch",
      plural: "Square Inches",
      symbol: "sq in",
      factor: 0.00064516, // 1 sq in = 6.4516 sq cm = 0.00064516 sq m
      description: "A square inch (sq in) is an imperial unit of area equal to a square with sides of one inch. It is commonly used for industrial measurements, pipe diameters, and product specifications.",
    },
    "decimal": {
      name: "Decimal",
      plural: "Decimals",
      symbol: "decimal",
      factor: 40.468564224, // 1 decimal = 1/100 of an acre = 435.6 sq ft = 40.46856 sq m
      description: "Decimal is a traditional land area measurement unit used in India (specifically West Bengal, Bihar, Jharkhand, and Odisha) and Bangladesh. One decimal is equal to 1/100th of an acre, which corresponds to 435.6 square feet (identical to a cent). It is commonly used in land revenue records and rural property sales.",
    },
    "marla": {
      name: "Marla",
      plural: "Marlas",
      symbol: "marla",
      factor: 25.29285264, // 1 marla = 272.25 sq ft = 25.29285 sq m
      description: "Marla is a traditional unit of area measurement used in India (primarily Punjab, Haryana, and Himachal Pradesh) and Pakistan. Traditionally, one Marla is equal to 272.25 square feet (a standard Marla), though a local 'Karam' system can vary it to 225 square feet in some areas. It is popular for residential plot sizing.",
    },
    "square-centimeter": {
      name: "Square Centimeter",
      plural: "Square Centimeters",
      symbol: "sq cm",
      factor: 0.0001,
      description: "A square centimeter (sq cm) is a metric unit of area equal to 1/10,000th of a square meter. It is typically used for small-scale measurements, floor tile dimensions, and architectural detailing.",
    },
    "katha": {
      name: "Katha",
      plural: "Katha",
      symbol: "katha",
      factor: 126.4642632, // 1 katha = 1/20 of a Bigha = 1,361.25 sq ft = 126.464 sq m
      description: "Katha is a traditional unit of area measurement used in eastern and northern India (West Bengal, Bihar, Jharkhand, Assam) and Bangladesh. The size of a Katha varies by region, but a standard Katha is generally 1,361.25 square feet (1/20th of a Bigha) in Bihar or 720 square feet in West Bengal. It is commonly used for measuring small plots of land.",
      regionalNote: "Note: Katha is highly regional. The standard conversion used here is 1 Katha = 1,361.25 sq ft (126.46 sq m) which is typical in Bihar/Jharkhand. In West Bengal, 1 Katha = 720 sq ft (66.89 sq m), and in Assam, it is 2,880 sq ft (267.56 sq m)."
    },
    "square-mile": {
      name: "Square Mile",
      plural: "Square Miles",
      symbol: "sq mi",
      factor: 2589988.110336, // 1 sq mi = 640 acres = 2589988.11 sq m
      description: "A square mile (sq mi) is an imperial unit of area equal to 640 acres or 2.59 square kilometers. It is used to measure large land expanses, geographical regions, and municipal boundaries.",
    },
    "dhur": {
      name: "Dhur",
      plural: "Dhur",
      symbol: "dhur",
      factor: 6.32321316, // 1 dhur = 1/20 of a Katha = 68.0625 sq ft = 6.323 sq m
      description: "Dhur is a traditional unit of land area measurement used in eastern India (Bihar, Jharkhand, West Bengal) and parts of Nepal. It is a subdivision of a Katha, where 20 Dhur make up 1 Katha. A standard Dhur is approximately 68.06 square feet, though it varies regionally depending on the local length of the 'Laggha' pole.",
      regionalNote: "Note: One Dhur is equal to 1/20 of a Katha. In Bihar, it is approximately 68.06 sq ft (6.32 sq m). In parts of West Bengal and Tripura, it is about 36 sq ft (3.34 sq m)."
    }
  },
  length: {
    "meter": {
      name: "Meter",
      plural: "Meters",
      symbol: "m",
      factor: 1.0, // Base unit for length is Meter
      description: "The meter (m) is the base unit of length in the International System of Units (SI). It is globally accepted and used for all scientific, engineering, and daily measurements, including building heights, corridor widths, and setback areas.",
    },
    "cm": {
      name: "Centimeter",
      plural: "Centimeters",
      symbol: "cm",
      factor: 0.01,
      description: "A centimeter (cm) is a metric unit of length equal to 1/100th of a meter. It is commonly used for measuring architectural drawings, wall thicknesses, and interior design elements.",
    },
    "mm": {
      name: "Millimeter",
      plural: "Millimeters",
      symbol: "mm",
      factor: 0.001,
      description: "A millimeter (mm) is a metric unit of length equal to 1/1000th of a meter. It is used for precision engineering, tile gaps, and detailed construction blueprints.",
    },
    "inches": {
      name: "Inch",
      plural: "Inches",
      symbol: "in",
      factor: 0.0254, // 1 inch = 2.54 cm = 0.0254 m
      description: "An inch (in) is a unit of length in the imperial system, equal to 2.54 centimeters. It is widely used in construction, furniture sizing, and screen dimensions.",
    },
    "ft": {
      name: "Foot",
      plural: "Feet",
      symbol: "ft",
      factor: 0.3048, // 1 ft = 12 inches = 0.3048 m
      description: "A foot (ft) is an imperial unit of length equal to 12 inches or 0.3048 meters. In real estate and construction, feet and inches are the most common units used to measure ceiling heights, room dimensions, and plot borders.",
    }
  }
};

export const ALIASES = {
  // Area aliases
  "sq-m": "square-meter",
  "sqm": "square-meter",
  "square-meters": "square-meter",
  "sq-ft": "square-feet",
  "sqft": "square-feet",
  "square-foot": "square-feet",
  "hectares": "hectare",
  "acres": "acre",
  "sq-yd": "square-yard",
  "sqyard": "square-yard",
  "square-yards": "square-yard",
  "cents": "cent",
  "bighas": "bigha",
  "sq-km": "square-kilometer",
  "sqkm": "square-kilometer",
  "square-kilometers": "square-kilometer",
  "sq-in": "square-inch",
  "sqinch": "square-inch",
  "square-inches": "square-inch",
  "decimals": "decimal",
  "marlas": "marla",
  "sq-cm": "square-centimeter",
  "sqcm": "square-centimeter",
  "square-centimeters": "square-centimeter",
  "kathas": "katha",
  "sq-mi": "square-mile",
  "sqmile": "square-mile",
  "square-miles": "square-mile",
  "dhurs": "dhur",

  // Length aliases
  "inch": "inches",
  "centimeter": "cm",
  "centimeters": "cm",
  "foot": "ft",
  "feet": "ft",
  "millimeter": "mm",
  "millimeters": "mm",
  "meters": "meter",
  "m": "meter"
};

// Preset pairs for generateStaticParams and listing links
export const TOP_CALCULATORS = [
  { from: "square-meter", to: "square-feet" },
  { from: "hectare", to: "acre" },
  { from: "square-feet", to: "square-meter" },
  { from: "square-yard", to: "square-feet" },
  { from: "acre", to: "hectare" },
  { from: "cent", to: "square-feet" },
  { from: "acre", to: "square-meter" },
  { from: "acre", to: "square-feet" },
  { from: "square-feet", to: "acre" },
  { from: "bigha", to: "acre" },
  { from: "acre", to: "bigha" },
  { from: "cent", to: "square-meter" },
  { from: "square-meter", to: "square-yard" },
  { from: "bigha", to: "hectare" },
  { from: "square-yard", to: "square-meter" }
];

export const SQM_TO_OTHERS = [
  { from: "square-meter", to: "square-yard" },
  { from: "square-meter", to: "bigha" },
  { from: "square-meter", to: "square-kilometer" },
  { from: "square-meter", to: "square-inch" },
  { from: "square-meter", to: "decimal" },
  { from: "square-meter", to: "marla" },
  { from: "square-meter", to: "square-centimeter" },
  { from: "square-meter", to: "katha" },
  { from: "square-meter", to: "square-mile" },
  { from: "square-meter", to: "dhur" }
];

export const LENGTH_CONVERSIONS = [
  { from: "inches", to: "cm" },
  { from: "ft", to: "mm" },
  { from: "ft", to: "cm" },
  { from: "meter", to: "ft" },
  { from: "inches", to: "mm" },
  { from: "cm", to: "mm" },
  { from: "ft", to: "inches" },
  { from: "meter", to: "cm" },
  { from: "meter", to: "mm" },
  { from: "meter", to: "inches" }
];

export function getUnitKey(str) {
  if (!str) return null;
  const normalized = str.toLowerCase().trim();
  if (ALIASES[normalized]) return ALIASES[normalized];
  
  // Try matching directly
  if (UNITS.area[normalized]) return normalized;
  if (UNITS.length[normalized]) return normalized;
  
  // Replace hyphens and underscores
  const clean = normalized.replace(/[-_]/g, "");
  const keys = [...Object.keys(UNITS.area), ...Object.keys(UNITS.length)];
  for (const k of keys) {
    if (k.replace(/[-_]/g, "") === clean) return k;
  }
  return null;
}

export function getUnitDetails(key) {
  if (UNITS.area[key]) {
    return { ...UNITS.area[key], type: "area" };
  }
  if (UNITS.length[key]) {
    return { ...UNITS.length[key], type: "length" };
  }
  return null;
}

export function convertUnits(value, fromKey, toKey) {
  const from = getUnitDetails(fromKey);
  const to = getUnitDetails(toKey);
  if (!from || !to || from.type !== to.type) return null;
  
  // Convert from source to base, then base to target
  // base to target is value / target.factor
  const baseValue = value * from.factor;
  return baseValue / to.factor;
}
