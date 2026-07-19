/**
 * GDPR Detection & Compliance Utilities
 * Detects EU/EEA users and provides GDPR compliance helpers
 *
 * EU/EEA Countries (27 + UK):
 * Austria, Belgium, Bulgaria, Croatia, Republic of Cyprus, Czech Republic,
 * Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland,
 * Ireland, Italy, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta,
 * Netherlands, Norway, Poland, Portugal, Romania, Slovakia, Slovenia,
 * Spain, Sweden, United Kingdom
 *
 * Built: 2025-02-25
 */

// EU/EEA country codes (ISO 3166-1 alpha-2)
const EU_EEA_COUNTRIES = new Set([
  'AT', // Austria
  'BE', // Belgium
  'BG', // Bulgaria
  'HR', // Croatia
  'CY', // Cyprus (Republic of)
  'CZ', // Czech Republic
  'DK', // Denmark
  'EE', // Estonia
  'FI', // Finland
  'FR', // France
  'DE', // Germany
  'GR', // Greece
  'HU', // Hungary
  'IS', // Iceland
  'IE', // Ireland
  'IT', // Italy
  'LV', // Latvia
  'LI', // Liechtenstein
  'LT', // Lithuania
  'LU', // Luxembourg
  'MT', // Malta
  'NL', // Netherlands
  'NO', // Norway
  'PL', // Poland
  'PT', // Portugal
  'RO', // Romania
  'SK', // Slovakia
  'SI', // Slovenia
  'ES', // Spain
  'SE', // Sweden
  'GB', // United Kingdom
]);

// EU timezones for detection
const EU_TIMEZONES = new Set([
  'Europe/Vienna',
  'Europe/Brussels',
  'Europe/Sofia',
  'Europe/Zagreb',
  'Europe/Nicosia',
  'Europe/Prague',
  'Europe/Copenhagen',
  'Europe/Tallinn',
  'Europe/Helsinki',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Athens',
  'Europe/Budapest',
  'Atlantic/Reykjavik',
  'Europe/Dublin',
  'Europe/Rome',
  'Europe/Riga',
  'Europe/Vaduz',
  'Europe/Vilnius',
  'Europe/Luxembourg',
  'Europe/Malta',
  'Europe/Amsterdam',
  'Europe/Oslo',
  'Europe/Warsaw',
  'Europe/Lisbon',
  'Europe/Bucharest',
  'Europe/Bratislava',
  'Europe/Ljubljana',
  'Europe/Madrid',
  'Europe/Stockholm',
  'Europe/London',
  'Europe/Gibraltar',
  'Europe/Guernsey',
  'Europe/Jersey',
  'Europe/Isle_of_Man',
]);

// NOTE: We deliberately do NOT match on browser language alone. Language is
// a very weak jurisdictional signal — a German-speaking Israeli, a French
// tourist in Tokyo, or an English-native anywhere would all trip a positive.
// EU classification now requires either a timezone match or an explicit
// country-in-locale match (e.g. `de-AT`, `en-GB`).

export interface GDPRDetectionResult {
  isEU: boolean;
  confidence: 'high' | 'medium' | 'low';
  method: 'timezone' | 'locale' | 'both';
  country?: string;
  detectedCountry: string;
}

/**
 * Detect if user is in EU/EEA based on browser timezone
 */
const detectByTimezone = (): boolean => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return EU_TIMEZONES.has(timezone);
  } catch {
    return false;
  }
};

/**
 * Detect if user is in EU/EEA based on browser locale
 */
const detectByLocale = (): { isEU: boolean; country?: string } => {
  // navigator.userLanguage is a legacy IE fallback — cast because it's not in lib.dom
  const lang = navigator.language || (navigator as unknown as { userLanguage?: string }).userLanguage || '';

  // Extract country code from locale (e.g., 'en-GB' -> 'GB'). We only match on
  // an explicit country segment; a bare language ('de', 'fr') does not qualify
  // — see the note above EU_EEA_COUNTRIES.
  const parts = lang.split('-');
  if (parts.length < 2) return { isEU: false };
  const potentialCountry = parts[parts.length - 1].toUpperCase();

  if (potentialCountry.length === 2 && EU_EEA_COUNTRIES.has(potentialCountry)) {
    return { isEU: true, country: potentialCountry };
  }

  return { isEU: false };
};

/**
 * Main GDPR detection function
 * Combines timezone and locale detection for better accuracy
 */
export const detectEUUser = (): GDPRDetectionResult => {
  const timezoneResult = detectByTimezone();
  const localeResult = detectByLocale();

  // High confidence: Both timezone and locale indicate EU
  if (timezoneResult && localeResult.isEU) {
    return {
      isEU: true,
      confidence: 'high',
      method: 'both',
      country: localeResult.country,
      detectedCountry: localeResult.country || 'EU'
    };
  }

  // Medium confidence: Either timezone or locale indicates EU
  if (timezoneResult) {
    return {
      isEU: true,
      confidence: 'medium',
      method: 'timezone',
      country: undefined,
      detectedCountry: 'EU (timezone)'
    };
  }

  if (localeResult.isEU) {
    return {
      isEU: true,
      confidence: 'medium',
      method: 'locale',
      country: localeResult.country,
      detectedCountry: localeResult.country || 'EU (locale)'
    };
  }

  // Not detected as EU
  return {
    isEU: false,
    confidence: 'low',
    method: 'locale',
    detectedCountry: 'Non-EU'
  };
};

/**
 * Store GDPR detection result in sessionStorage
 */
export const storeGDPRDetection = (result: GDPRDetectionResult): void => {
  try {
    sessionStorage.setItem('gdpr_detection', JSON.stringify({
      ...result,
      timestamp: new Date().toISOString()
    }));
  } catch (e) {
    // Silent fail if sessionStorage is not available
  }
};

/**
 * Get stored GDPR detection result
 */
export const getStoredGDPRDetection = (): GDPRDetectionResult | null => {
  try {
    const stored = sessionStorage.getItem('gdpr_detection');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Use cached result if less than 1 hour old
      const age = Date.now() - new Date(parsed.timestamp).getTime();
      if (age < 3600000) { // 1 hour
        return parsed;
      }
    }
  } catch (e) {
    // Silent fail
  }
  return null;
};

/**
 * Check if GDPR applies to current user
 */
export const doesGDPRApply = (): boolean => {
  // Check cached result first
  const cached = getStoredGDPRDetection();
  if (cached) {
    return cached.isEU;
  }

  // Run fresh detection
  const result = detectEUUser();
  storeGDPRDetection(result);
  return result.isEU;
};

/**
 * Get GDPR compliance information for display
 */
export const getGDPRInfo = (language: 'en' | 'de' | 'fr' | 'es' | 'it' | 'nl' | 'pl' = 'en') => {
  const info = {
    en: {
      legalBasis: 'Consent (Article 6(1)(a) GDPR)',
      rightsTitle: 'Your GDPR Rights',
      rights: [
        'Right to be informed (Article 13 & 14)',
        'Right of access (Article 15)',
        'Right to rectification (Article 16)',
        'Right to erasure (Article 17)',
        'Right to restrict processing (Article 18)',
        'Right to data portability (Article 20)',
        'Right to object (Article 21)'
      ],
      complaintAuthority: 'You have the right to lodge a complaint with a supervisory authority in your EU member state.',
      dataTransfer: 'Data transfers outside EU/EEA are protected by Standard Contractual Clauses (SCC).'
    },
    de: {
      legalBasis: 'Einwilligung (Artikel 6 Abs. 1 lit. a DSGVO)',
      rightsTitle: 'Ihre DSGVO-Rechte',
      rights: [
        'Recht auf Information (Artikel 13 & 14)',
        'Recht auf Auskunft (Artikel 15)',
        'Recht auf Berichtigung (Artikel 16)',
        'Recht auf Löschung (Artikel 17)',
        'Recht auf Einschränkung der Verarbeitung (Artikel 18)',
        'Recht auf Datenübertragbarkeit (Artikel 20)',
        'Recht auf Widerspruch (Artikel 21)'
      ],
      complaintAuthority: 'Sie haben das Recht, eine Beschwerde bei einer Aufsichtsbehörde in Ihrem EU-Mitgliedsstaat einzureichen.',
      dataTransfer: 'Datenübertragungen außerhalb des EU/EWR sind durch Standardvertragsklauseln (SCC) geschützt.'
    },
    fr: {
      legalBasis: 'Consentement (article 6(1)(a) RGPD)',
      rightsTitle: 'Vos droits RGPD',
      rights: [
        'Droit d\'information (article 13 & 14)',
        'Droit d\'accès (article 15)',
        'Droit de rectification (article 16)',
        'Droit à l\'effacement (article 17)',
        'Droit à la limitation du traitement (article 18)',
        'Droit à la portabilité des données (article 20)',
        'Droit d\'opposition (article 21)'
      ],
      complaintAuthority: 'Vous avez le droit d\'déposer une plainte auprès d\'une autorité de contrôle dans votre État membre de l\'UE.',
      dataTransfer: 'Les transferts de données hors UE/EEE sont protégés par des Clauses Contractuelles Types (CCT).'
    },
    es: {
      legalBasis: 'Consentimiento (artículo 6(1)(a) RGPD)',
      rightsTitle: 'Sus derechos RGPD',
      rights: [
        'Derecho a ser informado (artículo 13 y 14)',
        'Derecho de acceso (artículo 15)',
        'Derecho de rectificación (artículo 16)',
        'Derecho de supresión (artículo 17)',
        'Derecho a limitar el tratamiento (artículo 18)',
        'Derecho a la portabilidad de los datos (artículo 20)',
        'Derecho de oposición (artículo 21)'
      ],
      complaintAuthority: 'Tiene derecho a presentar una reclamación ante una autoridad de control de su estado miembro de la UE.',
      dataTransfer: 'Las transferencias de datos fuera de la UE/EEE están protegidas por Cláusulas Contractuales Tipo (CCT).'
    },
    it: {
      legalBasis: 'Consenso (articolo 6(1)(a) GDPR)',
      rightsTitle: 'I tuoi diritti GDPR',
      rights: [
        'Diritto all\'informazione (articolo 13 e 14)',
        'Diritto di accesso (articolo 15)',
        'Diritto di rettifica (articolo 16)',
        'Diritto alla cancellazione (articolo 17)',
        'Diritto di limitazione del trattamento (articolo 18)',
        'Diritto alla portabilità dei dati (articolo 20)',
        'Diritto di opposizione (articolo 21)'
      ],
      complaintAuthority: 'Hai il diritto di presentare un reclamo a un\'autorità di controllo nel tuo stato membro dell\'UE.',
      dataTransfer: 'I trasferimenti di dati fuori dall\'UE/SEE sono protetti da Clausole Contrattuali Standard (SCC).'
    },
    nl: {
      legalBasis: 'Toestemming (artikel 6(1)(a) AVG)',
      rightsTitle: 'Uw AVG-rechten',
      rights: [
        'Recht op informatie (artikel 13 & 14)',
        'Recht op toegang (artikel 15)',
        'Recht op rectificatie (artikel 16)',
        'Recht op verwijdering (artikel 17)',
        'Recht op beperking van de verwerking (artikel 18)',
        'Recht op gegevensoverdraagbaarheid (artikel 20)',
        'Recht van bezwaar (artikel 21)'
      ],
      complaintAuthority: 'U heeft het recht om een klacht in te dienen bij een toezichthoudende autoriteit in uw EU-lidstaat.',
      dataTransfer: 'Gegevensoverdrachten buiten de EU/EER zijn beschermd door Standendaard Contractuele Clausules (SCC).'
    },
    pl: {
      legalBasis: 'Zgoda (artykuł 6(1)(a) RODO)',
      rightsTitle: 'Twoje prawa RODO',
      rights: [
        'Prawo do informacji (artykuł 13 i 14)',
        'Prawo dostępu (artykuł 15)',
        'Prawo do sprostowania (artykuł 16)',
        'Prawo do usunięcia (artykuł 17)',
        'Prawo do ograniczenia przetwarzania (artykuł 18)',
        'Prawo do przenoszenia danych (artykuł 20)',
        'Prawo do sprzeciwienia (artykuł 21)'
      ],
      complaintAuthority: 'Masz prawo do wniesienia skargi do organu nadzorczego w swoim państwie członkowskim UE.',
      dataTransfer: 'Przekazywanie danych poza UE/EOG jest chronione przez Standardowe Klauzule Umowne (SCC).'
    }
  };

  return info[language] || info.en;
};

/**
 * GDPR legal bases for different processing activities
 */
export const GDPR_LEGAL_BASES = {
  necessary: {
    article: 'Article 6(1)(c)',
    description: 'Legitimate Interests - for the operation of the website and security',
    name: { en: 'Legitimate Interests', de: 'Berechtigte Interessen', fr: 'Intérêts légitimes', es: 'Intereses legítimos', it: 'Interessi legittimi', nl: 'Gerechtvaardigde belangen', pl: 'Uzasadnione interesy' }
  },
  analytics: {
    article: 'Article 6(1)(a)',
    description: 'Consent - for analytics and statistics',
    name: { en: 'Consent', de: 'Einwilligung', fr: 'Consentement', es: 'Consentimiento', it: 'Consenso', nl: 'Toestemming', pl: 'Zgoda' }
  },
  marketing: {
    article: 'Article 6(1)(a)',
    description: 'Consent - for marketing and advertising',
    name: { en: 'Consent', de: 'Einwilligung', fr: 'Consentement', es: 'Consentimiento', it: 'Consenso', nl: 'Toestemming', pl: 'Zgoda' }
  }
};

export default detectEUUser;
