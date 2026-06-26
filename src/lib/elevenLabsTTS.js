// ═══════════════════════════════════════════════════════════════
// PREMIUM VOICE TTS — Warm, Confident Female Voice
// Uses best available browser voices (Natural AI voices on Edge/Chrome)
// No external API needed — works offline!
// ═══════════════════════════════════════════════════════════════

const speechState = {
  active: false,
  cancel() {
    this.active = false;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  },
};

// ── Voice preference list (best-sounding first) ──
// Modern browsers on Windows 10/11 have "Online (Natural)" voices
// that sound remarkably warm and human-like
const VOICE_PREFERENCES = [
  // Tier 1: Microsoft Natural (AI) voices — sound almost human
  'Microsoft Neerja Online (Natural) - English (India)',
  'Microsoft Neerja Online (Natural)',
  'Microsoft Ava Online (Natural) - English (United States)',
  'Microsoft Jenny Online (Natural) - English (United States)',
  'Microsoft Aria Online (Natural) - English (United States)',
  'Microsoft Sara Online (Natural) - English (United States)',
  'Microsoft Sonia Online (Natural) - English (United Kingdom)',

  // Tier 2: Google's built-in voices (Chrome)
  'Google UK English Female',
  'Google US English',

  // Tier 3: macOS/iOS voices
  'Samantha',
  'Karen',
  'Moira',
  'Tessa',

  // Tier 4: Older Microsoft voices (still decent)
  'Microsoft Heera Online (Natural) - English (India)',
  'Microsoft Neerja',
  'Microsoft Heera',
  'Microsoft Zira Desktop',
  'Microsoft Zira',
  'Veena',
  'Lekha',
];

/**
 * Find the best available female voice from the browser
 */
function findBestVoice(voices) {
  // Try exact matches first
  for (const pref of VOICE_PREFERENCES) {
    const match = voices.find(v => v.name === pref);
    if (match) return match;
  }

  // Try partial matches
  for (const pref of VOICE_PREFERENCES) {
    const match = voices.find(v => v.name.includes(pref));
    if (match) return match;
  }

  // Fallback: any English female-sounding voice
  const fallback = voices.find(v =>
    (v.lang === 'en-IN' || v.lang === 'en-US' || v.lang === 'en-GB' || v.lang.startsWith('en')) &&
    (v.name.toLowerCase().includes('female') ||
     v.name.toLowerCase().includes('zira') ||
     v.name.toLowerCase().includes('samantha') ||
     v.name.toLowerCase().includes('neerja') ||
     v.name.toLowerCase().includes('heera'))
  );

  if (fallback) return fallback;

  // Last resort: any English voice
  return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
}

/**
 * Speak a congratulation message using the best available browser voice.
 * Warm, confident tone with natural pacing and pauses.
 * @param {string} name - The user's name
 */
export async function speakCongratulation(name) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    speechState.cancel();
    speechState.active = true;

    const firstName = name?.trim().split(' ')[0] || 'there';

    const doSpeak = () => {
      if (!speechState.active) return;
      const voices = window.speechSynthesis.getVoices();
      const chosenVoice = findBestVoice(voices);

      // Check if the voice is a "Natural" (AI) voice — they sound much better
      const isNaturalVoice = chosenVoice?.name?.includes('Natural') || 
                              chosenVoice?.name?.includes('Google');

      const sentences = [
        `Congratulations, ${firstName}!`,
        `You are one step closer to your dream home.`,
        `Our senior consultant will call you personally within the next fifteen minutes.`,
        `Welcome to the E.U.S. Realty family.`,
      ];

      let index = 0;

      const speakNext = () => {
        if (!speechState.active) return;
        if (index >= sentences.length) return;

        const utter = new SpeechSynthesisUtterance(sentences[index]);

        // Tune for warm, confident delivery
        if (isNaturalVoice) {
          // Natural voices sound best with minimal tuning
          utter.rate = 0.92;
          utter.pitch = 1.0;
        } else {
          // Standard voices need more adjustment for warmth
          utter.rate = 0.88;
          utter.pitch = 1.08;
        }

        utter.volume = 1;
        utter.lang = chosenVoice?.lang || 'en-IN';
        if (chosenVoice) utter.voice = chosenVoice;

        utter.onend = () => {
          if (!speechState.active) return;
          // Natural pause between sentences for warmth
          const pauseMs = index === 0 ? 700 : 500;
          setTimeout(() => {
            if (!speechState.active) return;
            index++;
            speakNext();
          }, pauseMs);
        };

        utter.onerror = () => {
          if (!speechState.active) return;
          index++;
          speakNext();
        };

        window.speechSynthesis.speak(utter);
      };

      if (chosenVoice) {
        console.log(`🎤 Using voice: ${chosenVoice.name} (${chosenVoice.lang})`);
      }
      speakNext();
    };

    // Voices may load asynchronously
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      doSpeak();
    } else {
      const onVoicesLoaded = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesLoaded);
        doSpeak();
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesLoaded);
      // Safety timeout
      setTimeout(() => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesLoaded);
        doSpeak();
      }, 1500);
    }
  } catch (err) {
    console.error('Error in speakCongratulation:', err);
  }
}

/**
 * Clean formatting symbols (markdown bold, italics, code blocks, excessive punctuation) 
 * to provide a smooth, clean speech output.
 */
function cleanTextForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold **text** -> text
    .replace(/\*([^*]+)\*/g, '$1')    // Italics *text* -> text
    .replace(/`([^`]+)`/g, '$1')       // Inline code `text` -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Markdown link [text](url) -> text
    .replace(/[:\-•*■✔]/g, ' ')        // Symbols/bullets -> space
    .replace(/\n+/g, ' ')              // Newlines -> space
    .replace(/\s+/g, ' ')              // Double spaces -> space
    .trim();
}

/**
 * Speak any generic text dynamically using the best browser voice.
 */
export async function speakText(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    speechState.cancel();
    speechState.active = true;

    const cleaned = cleanTextForSpeech(text);
    if (!cleaned) return;

    const doSpeak = () => {
      if (!speechState.active) return;
      const voices = window.speechSynthesis.getVoices();
      const chosenVoice = findBestVoice(voices);

      const isNaturalVoice = chosenVoice?.name?.includes('Natural') || 
                            chosenVoice?.name?.includes('Google');

      const utter = new SpeechSynthesisUtterance(cleaned);

      if (isNaturalVoice) {
        utter.rate = 0.94;
        utter.pitch = 1.0;
      } else {
        utter.rate = 0.90;
        utter.pitch = 1.05;
      }

      utter.volume = 1;
      utter.lang = chosenVoice?.lang || 'en-IN';
      if (chosenVoice) utter.voice = chosenVoice;

      utter.onend = () => {
        speechState.active = false;
      };

      utter.onerror = () => {
        speechState.active = false;
      };

      window.speechSynthesis.speak(utter);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      doSpeak();
    } else {
      const onVoicesLoaded = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesLoaded);
        doSpeak();
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesLoaded);
      setTimeout(() => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesLoaded);
        doSpeak();
      }, 1000);
    }
  } catch (err) {
    console.error('Error in speakText:', err);
  }
}

/**
 * Cancel any ongoing speech
 */
export function cancelSpeech() {
  speechState.cancel();
}

export { speechState };

