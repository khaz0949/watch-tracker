/**
 * Official product page URL for each watch (by seed id).
 * Used by fetch-watch-images to get og:image from each brand site.
 */
export const OFFICIAL_PRODUCT_URLS: Record<string, string> = {
  // Rolex — rolex.com/en-us/watches/{collection}/{model}
  "seed-rolex-sub-41": "https://www.rolex.com/en-us/watches/submariner/m126610ln-0001",
  "seed-rolex-sub-nodate": "https://www.rolex.com/en-us/watches/submariner/m124060-0001",
  "seed-rolex-daytona": "https://www.rolex.com/en-us/watches/cosmograph-daytona/m126500ln-0002",
  "seed-rolex-gmt": "https://www.rolex.com/en-us/watches/gmt-master-ii/m126710blro-0002",
  "seed-rolex-datejust": "https://www.rolex.com/en-us/watches/datejust/m126334-0002",
  "seed-rolex-daydate": "https://www.rolex.com/en-us/watches/day-date/m228235-0002",
  "seed-rolex-explorer": "https://www.rolex.com/en-us/watches/explorer/m224270-0001",
  "seed-rolex-yacht": "https://www.rolex.com/en-us/watches/yacht-master/m226659-0002",
  // Audemars Piguet
  "seed-ap-ro-41": "https://www.audemarspiguet.com/com/en/watch-collection/royal-oak/15500ST.OO.1220ST.03.html",
  "seed-ap-ro-37": "https://www.audemarspiguet.com/com/en/watch-collection/royal-oak/15550ST.OO.1356ST.01.html",
  "seed-ap-ro-offshore": "https://www.audemarspiguet.com/com/en/watch-collection/royal-oak-offshore/26420SO.OO.A600CA.01.html",
  "seed-ap-ro-chrono": "https://www.audemarspiguet.com/com/en/watch-collection/royal-oak/26331ST.OO.1220ST.02.html",
  "seed-ap-royal-oak-jumbo": "https://www.audemarspiguet.com/com/en/watch-collection/royal-oak/16202ST.OO.1240ST.01.html",
  // Patek Philippe — patek.com/en/collection/{collection}/{ref}
  "seed-patek-nautilus": "https://www.patek.com/en/collection/nautilus/5712-1r-001",
  "seed-patek-aquanaut": "https://www.patek.com/en/collection/aquanaut/5167a-001",
  "seed-patek-calatrava": "https://www.patek.com/en/collection/calatrava/5226g-001",
  "seed-patek-nautilus-5712": "https://www.patek.com/en/collection/nautilus/5712-1r-001",
  "seed-patek-perpetual": "https://www.patek.com/en/collection/grand-complications/5320g-011",
  // Cartier
  "seed-cartier-santos": "https://www.cartier.com/en-us/watches/santos-de-cartier/WSSA0019.html",
  "seed-cartier-tank-must": "https://www.cartier.com/en-us/watches/tank-must/WSTA0042.html",
  "seed-cartier-tank-louis": "https://www.cartier.com/en-us/watches/tank-louis-cartier/WGTA0010.html",
  "seed-cartier-panthere": "https://www.cartier.com/en-us/watches/panthère-de-cartier/WSPN0006.html",
  "seed-cartier-ballon": "https://www.cartier.com/en-us/watches/ballon-bleu-de-cartier/W69012Z4.html",
  // Richard Mille — per-model pages may not expose og:image; keep Commons fallback
  "seed-rm-011": "https://www.richardmille.com/en/collections/rm-011",
  "seed-rm-035": "https://www.richardmille.com/en/collections/rm-035",
  "seed-rm-027": "https://www.richardmille.com/en/collections/rm-027",
  "seed-rm-055": "https://www.richardmille.com/en/collections/rm-055",
  "seed-rm-67-02": "https://www.richardmille.com/en/collections/rm-67-02",
};
