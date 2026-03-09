/**
 * Comprehensive list of models available on Chrono24 for our tracked brands.
 * Format: [id, name, brand, reference, launchDate, msrpCents]
 * ID = seed-{brandShort}-{refSlug} for uniqueness.
 *
 * MSRP & Launch: Sourced from official brand sites (Rolex.com, Patek, AP, Cartier, etc.),
 * press releases, and AD/benchmark references. Rolex does not publish list prices; our Rolex
 * MSRPs are widely cited US retail benchmarks. Launch dates are model introduction (e.g.
 * Baselworld/W&W) where known. Overrides for key references are in realistic-prices.ts.
 */

type ModelInput = [string, string, string, number];

function refSlug(ref: string): string {
  return ref.replace(/\s*\/\s*/g, "-").replace(/\s+/g, "").toLowerCase();
}

function row(brandShort: string, ref: string, name: string, brand: string, launch: string, msrpUsd: number): [string, string, string, string, string, number] {
  const id = `seed-${brandShort}-${refSlug(ref)}`;
  return [id, name, brand, ref, launch, msrpUsd * 100];
}

export const WATCH_MODELS: [string, string, string, string, string, number][] = [
  // —— Rolex ——
  ...[
    ["Submariner Date 41mm", "126610LN", "2020-09", 10150],
    ["Submariner Date 41mm", "126610LV", "2020-09", 10150],
    ["Submariner No-Date 41mm", "124060", "2020-09", 9100],
    ["Submariner Date 41mm two-tone", "126613LN", "2020-09", 14550],
    ["Submariner Date 41mm two-tone", "126613LB", "2020-09", 14550],
    ["Submariner Date 41mm gold", "126618LN", "2020-09", 39500],
    ["Submariner Date 41mm gold", "126618LB", "2020-09", 39500],
    ["Cosmograph Daytona", "126500LN", "2023-03", 14800],
    ["Cosmograph Daytona two-tone", "126503", "2023-03", 22250],
    ["GMT-Master II Pepsi", "126710BLRO", "2018-03", 10700],
    ["GMT-Master II Batman", "126710BLNR", "2019-03", 10700],
    ["GMT-Master II", "126710GRNR", "2022-03", 10700],
    ["GMT-Master II two-tone", "126713GRNR", "2022-03", 15500],
    ["Datejust 41", "126334", "2019-04", 9150],
    ["Datejust 41", "126300", "2019-04", 7150],
    ["Datejust 36", "126234", "2019-04", 7550],
    ["Datejust 36", "126200", "2019-04", 6550],
    ["Datejust 31", "278274", "2019-01", 7550],
    ["Day-Date 40", "228235", "2019-03", 36500],
    ["Day-Date 40", "228238", "2019-03", 36500],
    ["Day-Date 36", "128235", "2019-03", 34500],
    ["Explorer 36mm", "124270", "2021-04", 7550],
    ["Explorer 40mm", "224270", "2021-04", 7550],
    ["Explorer II 42mm", "226570", "2021-04", 10600],
    ["Yacht-Master 42", "226659", "2019-03", 13850],
    ["Yacht-Master 40", "126622", "2019-03", 12850],
    ["Yacht-Master 37", "268622", "2019-03", 10500],
    ["Sea-Dweller 43mm", "126600", "2017-03", 14250],
    ["Sea-Dweller 43mm", "126603", "2019-03", 18500],
    ["Deepsea", "136660", "2018-03", 15800],
    ["Air-King", "126900", "2022-03", 7550],
    ["Oyster Perpetual 41", "124300", "2020-09", 6100],
    ["Oyster Perpetual 36", "126000", "2020-09", 5900],
    ["Sky-Dweller", "326934", "2017-03", 17750],
    ["Sky-Dweller", "326935", "2019-03", 48500],
    ["Lady-Datejust 28", "279174", "2019-01", 7550],
    ["Milgauss", "116400GV", "2007-01", 8900],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("rolex", ref, name, "Rolex", launch, msrp); }),

  // —— Audemars Piguet ——
  ...[
    ["Royal Oak 41mm", "15500ST", "2019-01", 21500],
    ["Royal Oak 41mm", "15510ST", "2022-01", 22500],
    ["Royal Oak 37mm", "15550ST", "2022-01", 20700],
    ["Royal Oak 37mm", "15551ST", "2022-01", 21200],
    ["Royal Oak Jumbo 39mm", "16202ST", "2022-01", 33500],
    ["Royal Oak Jumbo", "15202ST", "2012-01", 21900],
    ["Royal Oak Chronograph", "26331ST", "2018-01", 27500],
    ["Royal Oak Chronograph", "26315ST", "2021-01", 28500],
    ["Royal Oak Perpetual Calendar", "26574ST", "2015-01", 92500],
    ["Royal Oak Offshore 43mm", "26420SO", "2021-01", 31500],
    ["Royal Oak Offshore 43mm", "26420IO", "2021-01", 34500],
    ["Royal Oak Offshore 42mm", "26470ST", "2018-01", 28500],
    ["Royal Oak Offshore Diver", "15720ST", "2021-01", 27500],
    ["Royal Oak 34mm", "77450ST", "2022-01", 18500],
    ["Royal Oak 34mm", "77350ST", "2020-01", 17800],
    ["Royal Oak Double Balance", "15407ST", "2018-01", 48500],
    ["Royal Oak Concept", "26620TI", "2022-01", 105000],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("ap", ref, name, "Audemars Piguet", launch, msrp); }),

  // —— Patek Philippe ——
  ...[
    ["Nautilus 5711/1A", "5711/1A-010", "2006-01", 35100],
    ["Nautilus 5811/1G", "5811/1G-001", "2022-01", 42500],
    ["Nautilus 5712/1A", "5712/1A-001", "2006-01", 42000],
    ["Nautilus 5712/1R", "5712/1R-001", "2015-01", 58500],
    ["Nautilus Chronograph", "5980/1A-001", "2010-01", 48500],
    ["Nautilus Annual Calendar", "5726/1A-014", "2012-01", 52500],
    ["Nautilus Perpetual Calendar", "5740/1G-001", "2021-01", 145000],
    ["Nautilus Travel Time", "5990/1A-001", "2014-01", 58500],
    ["Nautilus 40mm ladies", "7118/1A-001", "2018-01", 35500],
    ["Aquanaut 5167A", "5167A-001", "2017-01", 22400],
    ["Aquanaut 5168G", "5168G-001", "2017-01", 28500],
    ["Aquanaut Travel Time", "5164A-001", "2011-01", 38500],
    ["Aquanaut Chronograph", "5968A-001", "2018-01", 48500],
    ["Aquanaut Luce", "5267/200A-001", "2019-01", 22500],
    ["Calatrava 5196G", "5196G-001", "2015-01", 21900],
    ["Calatrava 5226G", "5226G-001", "2022-01", 28500],
    ["Calatrava 6119G", "6119G-001", "2021-01", 23500],
    ["Perpetual Calendar 5320G", "5320G-001", "2017-01", 62000],
    ["Perpetual Calendar 5140G", "5140G-001", "2012-01", 58500],
    ["World Time 5230G", "5230G-001", "2016-01", 48500],
    ["Chronograph 5170G", "5170G-001", "2010-01", 68500],
    ["Nautilus 40mm", "7010/1A-011", "2024-01", 38500],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("patek", ref, name, "Patek Philippe", launch, msrp); }),

  // —— Cartier ——
  ...[
    ["Santos de Cartier Large", "WSSA0019", "2018-01", 7300],
    ["Santos de Cartier Medium", "WSSA0029", "2018-01", 6550],
    ["Santos-Dumont", "W2SA0006", "2020-01", 4450],
    ["Tank Must", "WSTA0042", "2021-01", 2850],
    ["Tank Must Large", "WSTA0054", "2021-01", 3200],
    ["Tank Louis Cartier", "WGTA0010", "2017-01", 12100],
    ["Tank Française", "WSTA0051", "2023-01", 3950],
    ["Tank Américaine", "WSTA0062", "2022-01", 8950],
    ["Panthère de Cartier", "WSPN0006", "2017-01", 5950],
    ["Panthère de Cartier small", "WSPN0007", "2017-01", 5250],
    ["Ballon Bleu 42mm", "W69012Z4", "2018-01", 6050],
    ["Ballon Bleu 40mm", "W69010Z4", "2018-01", 5550],
    ["Ballon Bleu 36mm", "W69006Z4", "2018-01", 4950],
    ["Ballon Bleu 33mm", "W4BB0017", "2018-01", 4450],
    ["Pasha de Cartier", "WSPA0015", "2020-01", 6850],
    ["Pasha Grille", "WGPA0007", "2020-01", 7550],
    ["Ronde Must", "WR000351", "2021-01", 2250],
    ["Clé de Cartier", "WCLN0006", "2015-01", 5850],
    ["Drive de Cartier", "WGNM0004", "2016-01", 6850],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("cartier", ref, name, "Cartier", launch, msrp); }),

  // —— Richard Mille ——
  ...[
    ["RM 011 Felipe Massa", "RM011", "2007-01", 165000],
    ["RM 011 NTPT", "RM011-NTPT", "2014-01", 175000],
    ["RM 012", "RM012", "2010-01", 195000],
    ["RM 027 Rafael Nadal", "RM027", "2010-01", 525000],
    ["RM 027-02", "RM027-02", "2017-01", 735000],
    ["RM 035 Rafael Nadal", "RM035", "2012-01", 85000],
    ["RM 035-02", "RM035-02", "2017-01", 95000],
    ["RM 055 Bubba Watson", "RM055", "2014-01", 95000],
    ["RM 067", "RM067", "2017-01", 105000],
    ["RM 67-02", "RM67-02", "2017-01", 105000],
    ["RM 011 Red TPT", "RM011-RED", "2016-01", 185000],
    ["RM 030", "RM030", "2012-01", 125000],
    ["RM 016", "RM016", "2008-01", 145000],
    ["RM 033", "RM033", "2012-01", 185000],
    ["RM 037", "RM037", "2013-01", 125000],
    ["RM 052 Skull", "RM052", "2012-01", 485000],
    ["RM 056", "RM056", "2012-01", 1850000],
    ["RM 61-01", "RM61-01", "2018-01", 85000],
    ["RM 07-01", "RM07-01", "2016-01", 125000],
    ["RM 72-01", "RM72-01", "2022-01", 165000],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("rm", ref, name, "Richard Mille", launch, msrp); }),

  // —— Omega (Chrono24 browse) ——
  ...[
    ["Speedmaster Moonwatch", "310.30.42.50.01.001", "2021-01", 7150],
    ["Seamaster Diver 300m", "210.30.42.20.01.001", "2018-01", 6100],
    ["Seamaster Aqua Terra", "220.10.41.21.01.001", "2017-01", 5900],
    ["Constellation", "131.10.39.20.01.001", "2018-01", 5100],
    ["Planet Ocean 600m", "215.30.44.21.01.001", "2016-01", 7100],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("omega", ref, name, "Omega", launch, msrp); }),

  // —— TAG Heuer (Chrono24 browse) ——
  ...[
    ["Monaco", "CBL2111", "2019-01", 5950],
    ["Carrera", "CBS2210", "2020-01", 5250],
    ["Aquaracer", "WBP2010", "2022-01", 2750],
    ["Formula 1", "WAZ1010", "2020-01", 1650],
    ["Autavia", "CBE2110", "2019-01", 4950],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("tagheuer", ref, name, "TAG Heuer", launch, msrp); }),

  // —— Grand Seiko (Chrono24 browse) ——
  ...[
    ["Snowflake", "SBGA211", "2017-01", 6100],
    ["Spring Drive GMT", "SBGE255", "2020-01", 7500],
    ["Heritage", "SBGR261", "2018-01", 4200],
    ["Hi-Beat", "SBGH267", "2017-01", 6800],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("grandseiko", ref, name, "Grand Seiko", launch, msrp); }),

  // —— Panerai (Chrono24 browse) ——
  ...[
    ["Luminor Marina", "PAM01312", "2017-01", 8500],
    ["Luminor Submersible", "PAM00683", "2018-01", 13500],
    ["Luminor Due", "PAM00926", "2020-01", 6200],
    ["Radiomir", "PAM00753", "2017-01", 5900],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("panerai", ref, name, "Panerai", launch, msrp); }),

  // —— Hublot (Chrono24 browse) ——
  ...[
    ["Big Bang", "441.NX.7170.NX", "2020-01", 18200],
    ["Classic Fusion", "525.NX.1280.NX", "2019-01", 5900],
    ["Spirit of Big Bang", "641.NX.7170.NX", "2020-01", 21500],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("hublot", ref, name, "Hublot", launch, msrp); }),

  // —— IWC Schaffhausen (Chrono24 browse) ——
  ...[
    ["Portugieser", "IW500705", "2015-01", 12900],
    ["Pilot Chronograph", "IW377801", "2016-01", 5950],
    ["Portofino", "IW356501", "2017-01", 4950],
    ["Aquatimer", "IW329001", "2014-01", 5950],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("iwc", ref, name, "IWC Schaffhausen", launch, msrp); }),

  // —— Breitling (Chrono24 browse) ——
  ...[
    ["Navitimer", "AB0138211B1A1", "2020-01", 8950],
    ["Chronomat", "B0235", "2020-01", 8950],
    ["Superocean", "A17367", "2022-01", 4550],
    ["Premier", "AB0141", "2018-01", 5950],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("breitling", ref, name, "Breitling", launch, msrp); }),

  // —— Tudor (Chrono24 browse) ——
  ...[
    ["Black Bay 58", "M79030N", "2018-01", 4050],
    ["Black Bay 41", "M79540", "2020-01", 3550],
    ["Pelagos", "M25600TN", "2015-01", 4950],
    ["Royal", "M28600", "2022-01", 3250],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("tudor", ref, name, "Tudor", launch, msrp); }),

  // —— Longines (Chrono24 browse) ——
  ...[
    ["HydroConquest", "L3.781.4.56.6", "2018-01", 1575],
    ["Spirit", "L3.810.4.53.0", "2020-01", 2750],
    ["Master", "L2.893.4.51.6", "2019-01", 2250],
    ["Legend Diver", "L3.774.4.50.0", "2017-01", 2950],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("longines", ref, name, "Longines", launch, msrp); }),

  // —— A. Lange & Söhne (Chrono24 browse) ——
  ...[
    ["Lange 1", "191.032", "2015-01", 38500],
    ["Zeitwerk", "142.050", "2019-01", 69000],
    ["Odysseus", "363.179", "2022-01", 28500],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("alangesoehne", ref, name, "A. Lange & Söhne", launch, msrp); }),

  // —— Vacheron Constantin (Chrono24 browse) ——
  ...[
    ["Overseas", "4500V", "2016-01", 22200],
    ["FiftySix", "4600E", "2018-01", 13200],
    ["Historiques", "82172", "2010-01", 48500],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("vacheron", ref, name, "Vacheron Constantin", launch, msrp); }),

  // —— Jaeger-LeCoultre (Chrono24 browse) ——
  ...[
    ["Reverso", "Q3848420", "2018-01", 8100],
    ["Master Control", "Q4018480", "2020-01", 8950],
    ["Polaris", "Q9068670", "2018-01", 9500],
    ["Rendez-Vous", "Q3468421", "2017-01", 12500],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("jlc", ref, name, "Jaeger-LeCoultre", launch, msrp); }),

  // —— Breguet (Chrono24 browse) ——
  ...[
    ["Classique", "5177", "2010-01", 28500],
    ["Marine", "5517", "2017-01", 13200],
    ["Type XX", "2067", "2023-01", 14500],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("breguet", ref, name, "Breguet", launch, msrp); }),

  // —— Chopard (Chrono24 browse) ——
  ...[
    ["Happy Sport", "278573", "2019-01", 6950],
    ["Mille Miglia", "168571", "2018-01", 4950],
    ["LUC", "161926", "2016-01", 18500],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("chopard", ref, name, "Chopard", launch, msrp); }),

  // —— Bulgari (Chrono24 browse) ——
  ...[
    ["Octo", "103431", "2020-01", 13200],
    ["Serpenti", "102897", "2019-01", 12500],
    ["Bulgari Bulgari", "BVLGARI-BVLGARI", "2018-01", 4950],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("bulgari", ref, name, "Bulgari", launch, msrp); }),

  // —— Seiko (Chrono24 browse) ——
  ...[
    ["Prospex", "SPB143", "2020-01", 1200],
    ["Presage", "SRPE45", "2020-01", 675],
    ["5 Sports", "SRPE67", "2019-01", 325],
    ["Astron", "SSH073", "2021-01", 2500],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("seiko", ref, name, "Seiko", launch, msrp); }),

  // —— Casio (Chrono24 browse) ——
  ...[
    ["G-Shock", "GMW-B5000", "2018-01", 500],
    ["Oceanus", "OCW-S100", "2019-01", 750],
    ["Edifice", "EQB-1100", "2020-01", 450],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("casio", ref, name, "Casio", launch, msrp); }),

  // —— Citizen (Chrono24 browse) ——
  ...[
    ["Eco-Drive", "BM8180", "2015-01", 175],
    ["Promaster", "BN0150", "2018-01", 350],
    ["Chronomaster", "AQ4020", "2020-01", 3500],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("citizen", ref, name, "Citizen", launch, msrp); }),

  // —— Nomos Glashütte (Chrono24 browse) ——
  ...[
    ["Tangente", "101", "2012-01", 1980],
    ["Orion", "309", "2018-01", 2480],
    ["Club", "735", "2020-01", 1580],
    ["Ludwig", "205", "2015-01", 2180],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("nomos", ref, name, "Nomos Glashütte", launch, msrp); }),

  // —— Glashütte Original (Chrono24 browse) ——
  ...[
    ["Senator", "1-36-01", "2016-01", 8950],
    ["Seventies", "1-37-02", "2018-01", 9500],
    ["SeaQ", "1-39-11-03-81-06", "2019-01", 9500],
  ].map((x) => { const [name, ref, launch, msrp] = x as ModelInput; return row("glashuette", ref, name, "Glashütte Original", launch, msrp); }),
];
