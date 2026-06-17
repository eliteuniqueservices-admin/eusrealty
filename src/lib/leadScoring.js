/**
 * Lead Scoring System for EUS Realty AI Chatbot
 * 
 * Scoring factors (max 100 points):
 * - Phone number provided: +30 pts
 * - Budget shared: +20 pts
 * - Name provided: +10 pts
 * - Location preference stated: +15 pts
 * - Site visit requested: +15 pts
 * - Email provided: +5 pts
 * - Callback requested: +5 pts
 * 
 * Quality tiers:
 * - Hot: 65–100 (immediate follow-up)
 * - Warm: 35–64 (follow up within 24hrs)
 * - Cold: 0–34 (nurture sequence)
 */

export function calculateLeadScore(leadData = {}) {
  let score = 0;

  // Phone number — highest value signal (proves genuine interest)
  if (leadData.phone && /^[6-9]\d{9}$/.test(leadData.phone.replace(/[\s+91]/g, ''))) {
    score += 30;
  }

  // Budget — quantifies buying power
  if (leadData.budget && leadData.budget.trim().length > 2) {
    score += 20;
  }

  // Location preference — shows serious intent
  if (leadData.preferredLocation && leadData.preferredLocation.trim().length > 1) {
    score += 15;
  }

  // Site visit requested — strongest buying signal
  if (leadData.siteVisitRequested) {
    score += 15;
  }

  // Name provided — personalisation & trust signal
  if (leadData.name && leadData.name.trim().length > 1) {
    score += 10;
  }

  // Email — additional contact channel
  if (leadData.email && leadData.email.includes('@')) {
    score += 5;
  }

  // Callback requested — active interest
  if (leadData.callbackRequested) {
    score += 5;
  }

  score = Math.min(100, Math.max(0, score));

  return {
    score,
    quality: score >= 65 ? 'Hot' : score >= 35 ? 'Warm' : 'Cold',
  };
}

/**
 * Merge extracted lead data with existing session lead data.
 * Only updates fields that have new non-empty values.
 */
export function mergLeadData(existing = {}, extracted = {}) {
  const merged = { ...existing };
  
  for (const [key, value] of Object.entries(extracted)) {
    if (value !== null && value !== undefined) {
      if (typeof value === 'boolean') {
        // For booleans: only update if true (once set, stays set)
        if (value === true) merged[key] = true;
      } else if (typeof value === 'string' && value.trim().length > 0) {
        merged[key] = value.trim();
      }
    }
  }
  
  return merged;
}

/**
 * Detect escalation triggers in a message
 */
export function detectEscalation(message = '') {
  const lower = message.toLowerCase();
  const triggers = [
    'site visit', 'want to buy', 'ready to buy', 'book now',
    'finalise', 'finalize', 'confirm booking', 'speak to agent',
    'speak to someone', 'human', 'call me now', 'urgent', 'asap',
    'visit site', 'book flat', 'book apartment','book','speak','site','visit','buy'
,  ];
  return triggers.some(t => lower.includes(t));
}
