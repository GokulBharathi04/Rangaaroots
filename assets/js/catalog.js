/* Rangaa Roots — full product listing (35 products, 7 families)
 * Each product names its label style ("wrap" = Coconut Sugar label, "cream" = A2 Ghee label),
 * the pack it ships in, the sketch on its label (art) and the colour of what's inside (fill).
 * Notes describe the product only; no health claims beyond what a label may carry.
 */
(() => {
  // centre-panel palettes for the "wrap" label, one per family; the side panels stay dark brown
  const THEMES = {
    sweet: { side: "#5b4334", sideInk: "#c9a87a", center: "#eef0b8", center2: "#e3e6a4", name: "#3b2418", accent: "#8a3a1e", tagline: "A bite of tradition, a taste of joy!" },
    malts: { side: "#4a2c22", sideInk: "#c79a7a", center: "#f6e7c8", center2: "#eedab0", name: "#3b2418", accent: "#c22956", tagline: "Stone-milled goodness in every glass" },
    soups: { side: "#1f4a30", sideInk: "#9cc4a0", center: "#eef3d6", center2: "#e0eabf", name: "#173a24", accent: "#388e3c", tagline: "Grandmother's herbs, ready in minutes" },
    grains: { side: "#6b4a22", sideInk: "#d8b880", center: "#f3ead2", center2: "#e9dbb8", name: "#3b2418", accent: "#7a5a10", tagline: "Native grains, naturally grown" },
  };

  const FAMILIES = [
    { id: "ghee-oils", film: "coconut", filmLabel: "Film of the Rangaa Roots coconut range, from palm trees and fresh coconut to the finished jars and bottles", short: "Ghee & Oils", name: "Ghee & Cold-pressed Oils", blurb: "Hand-churned A2 ghee and wood-pressed coconut oil, in food-grade glass." },
    { id: "sweeteners", short: "Sweeteners", name: "Natural Sweeteners", blurb: "Unrefined sugars from coconut blossom and palm sap: no bleaching, no chemicals." },
    { id: "malts", short: "Malts & Mixes", name: "Health Mixes & Malts", blurb: "Stone-milled drink mixes from native urad, ragi, fruits and nuts." },
    { id: "thokku", film: "thokku", filmLabel: "Film of thokku being made in small batches, ending on five jars from the range", short: "Thokku", name: "Thokku", blurb: "Slow-cooked relishes of greens and vegetables in cold-pressed gingelly oil." },
    { id: "soups", short: "Soups", name: "Herbal Soup Blends", blurb: "Traditional Tamil soup herbs, sun-dried and powdered: just add hot water." },
    { id: "grains", film: "rice", filmLabel: "Film of heritage rice falling onto a heap, ending on the millet, rice and dal pouches", short: "Millets & Rice", name: "Millets, Heritage Rice & Dal", blurb: "Native millets and heritage paddy varieties, single-polished to keep the bran." },
    { id: "care", short: "Hair & Skin", name: "Hair & Skin Care", blurb: "Kitchen-garden ingredients for hair and skin, made in small batches." },
  ];

  const P = (family, id, lines, extra) => ({ family, id, lines, food: family !== "care", ...extra });
  const wrap = (theme, pack, extra) => ({ style: "wrap", theme: THEMES[theme], pack, ...extra });
  const cream = (pack, extra) => ({ style: "cream", pack, ...extra });

  const products = [
    // Ghee & oils — the Ghee label
    P("ghee-oils", "a2-ghee", ["A2 Cow Ghee"], cream("squat", { art: "ghee", fill: "#e8c25a", kind: "liquid", size: "500ml", tagline: "Traditional Bilona Method & Hand-churned Grass-Fed", note: "Curd-churned from Kangayam & Gir cow milk, simmered until granular." })),
    P("ghee-oils", "virgin-coconut-oil", ["Virgin Coconut Oil"], cream("oilBottle", { art: "coconutOil", fill: "#f3edd2", kind: "liquid", size: "500ml", tagline: "Cold-pressed from fresh Pollachi coconut milk", note: "Cold-pressed from fresh coconut milk, never heated or refined." })),

    // Sweeteners — the Coconut Sugar label
    P("sweeteners", "coconut-sugar", ["Coconut", "Sugar"], wrap("sweet", "tall", { art: "coconutSugar", fill: "#8a5a32", size: "100g", note: "Unrefined coconut blossom sap sugar, low GI 35." })),
    P("sweeteners", "palm-sugar", ["Palm", "Sugar"], wrap("sweet", "tall", { art: "palmSugar", fill: "#6e4325", size: "500g", tagline: "Pure palmyra sap, sun-dried", note: "Powdered palmyra jaggery from Udangudi, rich in minerals." })),
    P("sweeteners", "panai-kalkandu", ["Panai", "Kalkandu"], wrap("sweet", "tall", { art: "kalkandu", fill: "#e3d4b4", size: "250g", tagline: "Palm candy crystals, slow-set", note: "Palm sugar candy, crystallised slowly from palmyra sap." })),
    P("sweeteners", "country-sugar", ["Country", "Sugar"], wrap("sweet", "tall", { art: "countrySugar", fill: "#a87a45", size: "500g", tagline: "Nattu sakkarai, unbleached", note: "Unbleached cane sugar (nattu sakkarai), made without sulphur." })),

    // Malts & health mixes
    P("malts", "abc-malt", ["ABC", "Malt"], wrap("malts", "tall", { art: "abc", fill: "#b0503a", size: "500g", tagline: "Apple · Beetroot · Carrot", note: "Apple, beetroot and carrot with country sugar and nuts." })),
    P("malts", "biotin-malt", ["Biotin", "Malt"], wrap("malts", "tall", { art: "biotin", fill: "#c9a46a", size: "500g", tagline: "Nuts, seeds & sprouted grains", note: "Almonds, seeds and sprouted grains in a warm malt drink." })),
    P("malts", "choco-black-urad", ["Choco Black Urad", "Growth Mix"], wrap("malts", "tall", { art: "choco", fill: "#4a2c22", size: "500g", tagline: "For growing kids · Choco taste", note: "Black urad and cocoa sweetened with palm jaggery, for kids." })),
    P("malts", "ragi-urad-boneshield", ["Ragi Urad", "Boneshield"], wrap("malts", "tall", { art: "ragi", fill: "#8a5b4a", size: "500g", tagline: "Sprouted ragi & black urad", note: "Sprouted ragi and black urad, naturally rich in calcium." })),
    P("malts", "uradfit-nutri-blend", ["Uradfit", "Nutri Blend"], wrap("malts", "tall", { art: "uradfit", fill: "#6b5a50", size: "500g", tagline: "28.1g protein per 100g", note: "Roasted black urad, walnuts, almonds and dry ginger." })),
    P("malts", "blackboozt-nutri-plus", ["BlackBoozt", "Nutri+"], wrap("malts", "tall", { art: "blackboozt", fill: "#3a2e2a", size: "500g", tagline: "For active elders", note: "An easy-to-digest black urad blend for elders." })),
    P("malts", "palm-jaggery-chukku-coffee", ["Palm Jaggery", "Chukku Coffee"], wrap("malts", "tall", { art: "chukku", fill: "#5a3a22", size: "250g", tagline: "Dry ginger · Palm jaggery · Spices", note: "Caffeine-free dry-ginger coffee sweetened with palm jaggery." })),

    // Thokku — squat jars, the Ghee label's format
    P("thokku", "karuveppilai-thokku", ["Karuveppilai Thokku"], cream("squat", { art: "karuveppilai", fill: "#3f5a2a", size: "300g", tagline: "Curry leaves slow-cooked in gingelly oil", note: "Fresh curry leaves, tamarind and spices in gingelly oil." })),
    P("thokku", "vallarai-thokku", ["Vallarai Thokku"], cream("squat", { art: "vallaraiThokku", fill: "#4a6a2a", size: "300g", tagline: "Fresh vallarai keerai, stone-ground", note: "Fresh Centella (vallarai) greens, a traditional brain-tonic relish." })),
    P("thokku", "small-onion-thokku", ["Small Onion Thokku"], cream("squat", { art: "onionThokku", fill: "#8a3a22", size: "300g", tagline: "Sambar onions, slow-roasted", note: "Shallots slow-roasted with red chilli and tamarind." })),
    P("thokku", "vazhaipoo-thokku", ["Vazhaipoo Thokku"], cream("squat", { art: "vazhaipoo", fill: "#5a3f3a", size: "300g", tagline: "Banana flower, hand-cleaned", note: "Hand-cleaned banana flower cooked down with spices." })),
    P("thokku", "tomato-thokku", ["Tomato Thokku"], cream("squat", { art: "tomatoThokku", fill: "#b8321e", size: "300g", tagline: "Country tomatoes, cooked down slow", note: "Country tomatoes cooked down with chilli and mustard." })),

    // Soup blends — pouches
    P("soups", "thoothuvalai-soup", ["Thoothuvalai", "Soup Blend"], wrap("soups", "pouch", { art: "thoothuvalai", fill: "#6a7a3a", size: "200g", note: "Thoothuvalai leaves with pepper and cumin, a winter staple." })),
    P("soups", "banana-stem-soup", ["Banana Stem", "Soup Blend"], wrap("soups", "pouch", { art: "bananaStem", fill: "#c9c48a", size: "200g", note: "Dried banana stem with pepper: high in fibre." })),
    P("soups", "aavarampoo-soup", ["Aavarampoo", "Soup Blend"], wrap("soups", "pouch", { art: "aavarampoo", fill: "#d4b02a", size: "200g", note: "Sun-dried avaram flowers with moong dal and spices." })),
    P("soups", "vallarai-soup", ["Vallarai", "Soup Blend"], wrap("soups", "pouch", { art: "vallaraiSoup", fill: "#5a7a2a", size: "200g", note: "Vallarai greens with garlic and pepper." })),
    P("soups", "mudakathan-soup", ["Mudakathan", "Soup Blend"], wrap("soups", "pouch", { art: "mudakathan", fill: "#6a8a3a", size: "200g", note: "Mudakathan (balloon vine) leaves, traditionally taken for joints." })),
    P("soups", "nutri-moringa-soup", ["Nutri Moringa", "Soup Blend"], wrap("soups", "pouch", { art: "moringa", fill: "#4f7a2a", size: "200g", note: "Moringa leaves with lentils and spices." })),

    // Grains — pouches
    P("grains", "kodo-millet", ["Kodo", "Millet"], wrap("grains", "pouch", { art: "millet", fill: "#c9a46a", size: "1kg", tagline: "Varagu · unpolished", note: "Varagu: unpolished, ready to cook like rice." })),
    P("grains", "barnyard-millet", ["Barnyard", "Millet"], wrap("grains", "pouch", { art: "millet", fill: "#e8dcc0", size: "1kg", tagline: "Kuthiraivali · unpolished", note: "Kuthiraivali: light, quick-cooking and high in fibre." })),
    P("grains", "little-millet", ["Little", "Millet"], wrap("grains", "pouch", { art: "millet", fill: "#dcc48a", size: "1kg", tagline: "Samai · unpolished", note: "Samai: a small-grained millet for pongal and upma." })),
    P("grains", "foxtail-millet", ["Foxtail", "Millet"], wrap("grains", "pouch", { art: "millet", fill: "#e2bf5a", size: "1kg", tagline: "Thinai · unpolished", note: "Thinai: golden grains for khichdi, dosa and payasam." })),
    P("grains", "emperors-rice", ["Emperor's", "Rice"], wrap("grains", "pouch", { art: "rice", fill: "#2a1f2e", size: "1kg", tagline: "Karuppu kavuni · heritage black rice", note: "Karuppu kavuni black rice, once grown only for royalty." })),
    P("grains", "bridegroom-rice", ["Bridegroom", "Rice"], wrap("grains", "pouch", { art: "rice", fill: "#a8443a", size: "1kg", tagline: "Mappillai samba · heritage red rice", note: "Mappillai samba red rice, traditionally given to grooms." })),
    P("grains", "sprouted-dal", ["Sprouted", "Dal"], wrap("grains", "pouch", { art: "sproutedDal", fill: "#e8d28a", size: "500g", tagline: "Germinated, sun-dried, easy to digest", note: "Germinated and sun-dried lentils that cook faster." })),

    // Hair & skin care — bottles, the Ghee label's cream format
    P("care", "rice-water-shampoo", ["Rice Water Shampoo"], cream("pumpBottle", { art: "riceWater", fill: "#f4f0e6", kind: "liquid", size: "200ml", tagline: "Fermented rice water & herbs", note: "Fermented rice water with hibiscus and fenugreek." })),
    P("care", "coconut-milk-shampoo", ["Coconut Milk Shampoo"], cream("pumpBottle", { art: "coconutMilk", fill: "#fbf7ee", kind: "liquid", size: "200ml", tagline: "Fresh coconut milk, mild & sulphate-free", note: "A mild, sulphate-free wash made with fresh coconut milk." })),
    P("care", "herbal-hair-oil", ["Herbal Hair Oil"], cream("oilBottle", { art: "hairOil", fill: "#c9a02a", kind: "liquid", size: "100ml", tagline: "Hibiscus, curry leaf & bhringraj in coconut oil", note: "Hibiscus, curry leaf and bhringraj slow-infused in coconut oil." })),
    P("care", "saffron-serum", ["Saffron Serum"], cream("dropper", { art: "serum", fill: "#e8a33a", kind: "liquid", size: "30ml", tagline: "Kashmiri saffron & kumkumadi oils", note: "Kashmiri saffron in a light kumkumadi oil blend." })),
  ];

  // assets/img/products/<id>.jpg, except where the photo already had another name
  const PHOTO_NAMES = {
    "a2-ghee": "a2-cow-ghee", "coconut-sugar": "coconut-sugar", "palm-sugar": "udangudi-palm-jaggery",
    "abc-malt": "rangaa-roots-abc-malt", "choco-black-urad": "rangaa-roots-choco-black-urad-kids",
    "uradfit-nutri-blend": "rangaa-roots-uradfit-men", "blackboozt-nutri-plus": "rangaa-roots-blackboozt-elder",
    "banana-stem-soup": "banana-stem-soup", "vallarai-thokku": "vallarai-thokku",
  };
  products.forEach((p) => { p.photo = `${PHOTO_NAMES[p.id] || p.id}.jpg`; });

  window.RRCatalog = { families: FAMILIES, products };
})();
