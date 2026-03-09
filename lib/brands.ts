/**
 * Brand logos — Wikimedia Commons (public domain / CC where noted).
 * Covers brands from Chrono24 browse (chrono24.ae/search/browse.htm).
 */
const WIKI = "https://upload.wikimedia.org/wikipedia/commons";

export const BRAND_LOGOS: Record<string, string> = {
  Rolex: `${WIKI}/f/f4/Logo_da_Rolex.png`,
  "Audemars Piguet": `${WIKI}/4/4f/Logo_Audemars_Piguet.svg`,
  "Patek Philippe": `${WIKI}/0/02/Patek_Philippe_Logo.png`,
  Cartier: `${WIKI}/8/86/Cartier_logo.svg`,
  "Richard Mille": `${WIKI}/e/e5/Logo_Richard_Mille.svg`,
  Omega: `${WIKI}/f/fb/Omega_Logo.svg`,
  "TAG Heuer": `${WIKI}/d/de/TAG_Heuer_Logo.svg`,
  "Grand Seiko": `${WIKI}/2/21/Grand_Seiko_Logo.svg`,
  Panerai: `${WIKI}/8/8a/Panerai_logo.svg`,
  Hublot: `${WIKI}/7/79/Hublot-logo.svg`,
  "IWC Schaffhausen": `${WIKI}/f/fa/International_Watch_Company_logo.svg`,
  Breitling: `${WIKI}/0/06/Breitling_logo.png`,
  Tudor: `${WIKI}/c/cb/Tudor_%28Uhrenmarke%29_logo.svg`,
  Longines: `${WIKI}/0/0a/Longines_wordmark_logo.svg`,
  "A. Lange & Söhne": `${WIKI}/e/ee/Alange_soehne_logo.svg`,
  "Vacheron Constantin": `${WIKI}/1/16/Vacheron_Constantin.svg`,
  "Jaeger-LeCoultre": `${WIKI}/d/df/Jaeger-LeCoultre_Logo.png`,
  Breguet: `${WIKI}/3/36/Breguet_logo.png`,
  Chopard: `${WIKI}/3/37/Logo_Chopard.svg`,
  Bulgari: `${WIKI}/3/32/Bulgari_logo.svg`,
  Seiko: `${WIKI}/2/2c/Seiko_logo.svg`,
  Casio: `${WIKI}/4/4d/Casio_logo.svg`,
  Citizen: `${WIKI}/5/51/Citizen_logo.svg`,
  "Nomos Glashütte": `${WIKI}/2/2a/Nomos_Glash%C3%BCtte.svg`,
  "Glashütte Original": `${WIKI}/9/95/Glash%C3%BCtter_Uhrenbetrieb_logo.svg`,
};

export function getBrandLogoUrl(brand: string): string {
  return BRAND_LOGOS[brand] ?? `${WIKI}/4/4f/Logo_Audemars_Piguet.svg`;
}

/** Official brand sites — use to verify MSRP and launch (benchmark sources). */
export const BRAND_OFFICIAL_URL: Record<string, string> = {
  Rolex: "https://www.rolex.com",
  "Audemars Piguet": "https://www.audemarspiguet.com",
  "Patek Philippe": "https://www.patek.com",
  Cartier: "https://www.cartier.com",
  "Richard Mille": "https://www.richardmille.com",
  Omega: "https://www.omega.com",
  "TAG Heuer": "https://www.tagheuer.com",
  "Grand Seiko": "https://www.grand-seiko.com",
  Panerai: "https://www.panerai.com",
  Hublot: "https://www.hublot.com",
  "IWC Schaffhausen": "https://www.iwc.com",
  Breitling: "https://www.breitling.com",
  Tudor: "https://www.tudorwatch.com",
  Longines: "https://www.longines.com",
  "A. Lange & Söhne": "https://www.alange-soehne.com",
  "Vacheron Constantin": "https://www.vacheron-constantin.com",
  "Jaeger-LeCoultre": "https://www.jaeger-lecoultre.com",
  Breguet: "https://www.breguet.com",
  Chopard: "https://www.chopard.com",
  Bulgari: "https://www.bulgari.com",
  Seiko: "https://www.seikowatches.com",
  Casio: "https://www.casio.com",
  Citizen: "https://www.citizenwatch.com",
  "Nomos Glashütte": "https://www.nomos-glashuette.com",
  "Glashütte Original": "https://www.glashuette-original.com",
};

export function getOfficialBenchmarkUrl(brand: string): string | null {
  return BRAND_OFFICIAL_URL[brand] ?? null;
}

/** All brands we track (Chrono24 browse + core). Order: core first, then A–Z. */
export const BRAND_LIST = [
  "Rolex",
  "Audemars Piguet",
  "Patek Philippe",
  "Cartier",
  "Richard Mille",
  "Omega",
  "TAG Heuer",
  "Grand Seiko",
  "Panerai",
  "Hublot",
  "IWC Schaffhausen",
  "Breitling",
  "Tudor",
  "Longines",
  "A. Lange & Söhne",
  "Vacheron Constantin",
  "Jaeger-LeCoultre",
  "Breguet",
  "Chopard",
  "Bulgari",
  "Seiko",
  "Casio",
  "Citizen",
  "Nomos Glashütte",
  "Glashütte Original",
] as const;
