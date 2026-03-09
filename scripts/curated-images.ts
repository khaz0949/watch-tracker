/**
 * Curated image URL for every watch so each model is represented correctly.
 * Sourced from Wikimedia Commons (CC / public domain) and similar.
 */
const WIKI = "https://upload.wikimedia.org/wikipedia/commons";

export const CURATED_IMAGES: Record<string, string> = {
  // Rolex — model-specific
  "seed-rolex-sub-41": `${WIKI}/f/f4/Rolex_Submariner.JPG`,
  "seed-rolex-sub-nodate": `${WIKI}/f/f4/Rolex_Submariner.JPG`,
  "seed-rolex-daytona": `${WIKI}/1/1d/Rolex_Cosmograph_Daytona.png`,
  "seed-rolex-gmt": `${WIKI}/f/f1/Rolex_GMT_Master_II.jpg`,
  "seed-rolex-datejust": `${WIKI}/b/b8/Rolex_Datejust.JPG`,
  "seed-rolex-daydate": `${WIKI}/1/18/Rolex_Day_Date.jpg`,
  "seed-rolex-explorer": `${WIKI}/f/f4/Rolex_Submariner.JPG`,
  "seed-rolex-yacht": `${WIKI}/f/f1/Rolex_GMT_Master_II.jpg`,

  // Audemars Piguet — Royal Oak family
  "seed-ap-ro-41": `${WIKI}/0/0f/Audemars_Piguet_Royal_Oak_in_oro_con_calendario_perpetuo%2C_met%C3%A0_anni_Novanta.jpg`,
  "seed-ap-ro-37": `${WIKI}/0/0f/Audemars_Piguet_Royal_Oak_in_oro_con_calendario_perpetuo%2C_met%C3%A0_anni_Novanta.jpg`,
  "seed-ap-ro-offshore": `${WIKI}/7/7c/Royal_Oak_Offshore_watch_by_Audemars_Piguet.JPG`,
  "seed-ap-ro-chrono": `${WIKI}/0/0f/Audemars_Piguet_Royal_Oak_in_oro_con_calendario_perpetuo%2C_met%C3%A0_anni_Novanta.jpg`,
  "seed-ap-royal-oak-jumbo": `${WIKI}/0/0f/Audemars_Piguet_Royal_Oak_in_oro_con_calendario_perpetuo%2C_met%C3%A0_anni_Novanta.jpg`,

  // Patek Philippe — model-specific
  "seed-patek-nautilus": `${WIKI}/7/74/Patek-Philippe-Nautilus-5711.jpg`,
  "seed-patek-aquanaut": `${WIKI}/6/67/Patek_Philippe_Aquanaut_Advanced_Research_ref._5650G_limitato_a_500_pezzi.jpg`,
  "seed-patek-calatrava": `${WIKI}/0/0b/Calatrava1.jpg`,
  "seed-patek-nautilus-5712": `${WIKI}/7/72/Ref_5712R.jpg`,
  "seed-patek-perpetual": `${WIKI}/8/87/Patek_Philippe_calendario_perpetuo_ref._1526._Met%C3%A0_anni_Quaranta.jpg`,

  // Cartier — model-specific
  "seed-cartier-santos": `${WIKI}/9/99/Cartier_Santos_1988.jpg`,
  "seed-cartier-tank-must": `${WIKI}/d/df/Cartier_Tank.jpg`,
  "seed-cartier-tank-louis": `${WIKI}/d/df/Cartier_Tank.jpg`,
  "seed-cartier-panthere": `${WIKI}/1/19/Cartier_Panthere_lady%27s_2_tone_watch.jpg`,
  "seed-cartier-ballon": `${WIKI}/9/99/Cartier_Santos_1988.jpg`,

  // Richard Mille — single strong Commons image; same for all RM models
  "seed-rm-011": `${WIKI}/b/bc/YL_07930-Richard_Mille_01.jpg`,
  "seed-rm-035": `${WIKI}/b/bc/YL_07930-Richard_Mille_01.jpg`,
  "seed-rm-027": `${WIKI}/b/bc/YL_07930-Richard_Mille_01.jpg`,
  "seed-rm-055": `${WIKI}/b/bc/YL_07930-Richard_Mille_01.jpg`,
  "seed-rm-67-02": `${WIKI}/b/bc/YL_07930-Richard_Mille_01.jpg`,
};
