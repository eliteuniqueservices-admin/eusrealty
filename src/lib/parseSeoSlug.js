/**
 * Parses a long-tail SEO slug into structured database query parameters.
 * Example: '2-bhk-flats-under-1-cr-in-wakad'
 */
export function parseSeoSlug(slugArray) {
  // Catch-all route gives us an array of path segments. We usually care about the last one or a joined one.
  const fullSlug = Array.isArray(slugArray) ? slugArray.join('-') : slugArray;
  const text = fullSlug.toLowerCase().replace(/-/g, ' ');

  const result = {
    originalSlug: fullSlug,
    title: '',
    query: {},
    bhk: null,
    budget: null,
    locality: null,
    type: null,
    status: null,
  };

  // 1. Extract BHK
  const bhkMatch = text.match(/(\d)\s*bhk/);
  if (bhkMatch) {
    result.bhk = bhkMatch[1];
    // query.$or = [{ configurations: ... }, { "configDetails.type": ... }] handled in page.js
  }

  // 2. Extract Budget (Max Cr)
  // Handles: under 50 lakhs, under 1.5 cr
  const budgetMatch = text.match(/under\s*(\d+(?:\.\d+)?)\s*(cr|crore|lakhs|lakh|l)/);
  if (budgetMatch) {
    const value = parseFloat(budgetMatch[1]);
    const unit = budgetMatch[2];
    if (unit.startsWith('cr')) {
      result.budget = value; // Store max budget in Cr
    } else if (unit.startsWith('l')) {
      result.budget = value / 100; // Convert lakhs to Cr
    }
  }

  // 3. Extract Locality
  const localities = ['baner', 'wakad', 'hinjawadi', 'tathawade', 'aundh', 'balewadi', 'pimpri', 'chinchwad', 'pune'];
  for (const loc of localities) {
    if (text.includes(`in ${loc}`) || text.includes(`near ${loc}`) || text.endsWith(loc)) {
      result.locality = loc === 'pune' ? null : loc; // If just Pune, no specific locality filter
      break;
    }
  }

  // 4. Extract Type
  if (text.includes('villa') || text.includes('villas')) result.type = 'Villas';
  else if (text.includes('flat') || text.includes('apartment')) result.type = 'Apartments';
  else if (text.includes('plot')) result.type = 'Plots';

  // 5. Extract Status
  if (text.includes('new launch') || text.includes('pre launch')) result.status = 'New Launch';
  else if (text.includes('ready to move') || text.includes('rtm')) result.status = 'Ready to Move';
  else if (text.includes('under construction')) result.status = 'Under Construction';

  // Generate an optimized Title H1 based on extracted params
  let titleParts = [];
  if (result.status) titleParts.push(result.status);
  if (result.bhk) titleParts.push(`${result.bhk} BHK`);
  if (result.type) titleParts.push(result.type);
  else titleParts.push('Properties');
  
  if (result.budget) {
    if (result.budget < 1) titleParts.push(`Under ${result.budget * 100} Lakhs`);
    else titleParts.push(`Under ${result.budget} Cr`);
  }
  
  if (result.locality) titleParts.push(`in ${result.locality.charAt(0).toUpperCase() + result.locality.slice(1)}`);
  else titleParts.push('in Pune');

  result.title = titleParts.join(' ');

  return result;
}
