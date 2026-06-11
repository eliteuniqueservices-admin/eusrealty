/**
 * Formats a number as Indian Rupee (INR) string.
 * Handles large numbers with Cr/L notation.
 */
export const formatINR = (num) => {
  const absNum = Math.abs(num);
  if (absNum >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (absNum >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${Math.round(num).toLocaleString("en-IN")}`;
};
