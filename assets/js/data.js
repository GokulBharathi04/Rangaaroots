/* Rangaa Roots — catalogue data
 * Products, reviews and batch records are taken from rangaaroots.com.
 * This is a showcase site: no prices, no checkout. Enquiries go to WhatsApp.
 * Ghee details come from the live site's Bilona article and farm page.
 */
window.RR = {
  brand: {
    name: "Rangaa Roots",
    tagline: "Rooted in Tradition",
    phone: "+91 95979 27712",
    whatsapp: "919597927712",
    email: "info@rangaaroots.co.in",
    address: "#D12/28, TNHB Colony, Bagalur Road, Near Subham Department Stores, Hosur, Tamil Nadu 635109",
  },

  ghee: {
    id: "a2-bilona-ghee",
    name: "A2 Bilona Desi Cow Ghee",
    subtitle: "Hand-churned from Kangayam & Gir cow curd · Bagalur Green Belt, Hosur",
    image: "assets/img/ghee-dabba.jpg",
    features: [
      "Curd-churned Bilona method, never cream-separated",
      "Milk from 40+ grass-fed indigenous Kangayam & Gir cows",
      "Slow-simmered on low flame until granular & golden",
      "Packed in food-grade glass with batch ID & packed date",
    ],
  },

  categories: [
    { id: "all", label: "All" },
    { id: "malts", label: "Functional Malts" },
    { id: "soups", label: "Herbal Soups" },
    { id: "sweet", label: "Natural Sweeteners" },
    { id: "thokku", label: "Thokku & Wellness" },
  ],

  // Product artwork from rangaaroots.com, renamed to match what each image shows.
  products: [
    { id: "abc-malt", cat: "malts", name: "ABC Malt (Apple Beetroot Carrot)", note: "100% Home Made · No Preservatives", size: "500g", img: "rangaa-roots-abc-malt.jpg" },
    { id: "uradfit-men", cat: "malts", name: "UradFit Nutri Blend (For Men)", note: "28.1g Protein per 100g", size: "500g", img: "rangaa-roots-uradfit-men.jpg" },
    { id: "choco-kids", cat: "malts", name: "Choco Black Urad Growth Mix (Kids)", note: "21.8g Protein · Choco taste", size: "500g", img: "rangaa-roots-choco-black-urad-kids.jpg" },
    { id: "blackboozt", cat: "malts", name: "BlackBoozt Nutri+ (For Elders)", note: "19.8g Protein · Active ageing", size: "500g", img: "rangaa-roots-blackboozt-elder.jpg" },
    { id: "red-bliss", cat: "malts", name: "Red Bliss Functional Drink Mix", note: "12 Superfoods + 17 Micronutrients", size: "325g", img: "rangaa-roots-red-bliss-superfood.jpg" },
    { id: "banana-stem", cat: "soups", name: "Banana Stem Soup Blend", note: "Kidney & urinary care · High fibre", size: "200g", img: "banana-stem-soup.jpg" },
    { id: "coconut-sugar", cat: "sweet", name: "Coconut Blossom Sugar", note: "Low GI 35 · Unrefined Pollachi sap", size: "500g", img: "coconut-sugar.jpg" },
    { id: "palm-jaggery", cat: "sweet", name: "Udangudi Palm Jaggery Powder", note: "Unrefined karupatti · Rich in iron & minerals", img: "udangudi-palm-jaggery.jpg" },
    { id: "panankarkandu", cat: "sweet", name: "Panankarkandu Pal Mix", note: "Palm candy warm-milk mix · Soothes throat", size: "250g", img: "panankarkandu-pal-mix.jpg" },
    { id: "vallarai", cat: "thokku", name: "Vallarai Keerai Thokku", note: "Fresh Centella greens · Brain tonic relish", size: "300g", img: "vallarai-thokku.jpg" },
    { id: "black-cumin", cat: "thokku", name: "Black Cumin Digest-o-Care", note: "Relieves bloating & gas", size: "150g", img: "black-cumin-digest.jpg" },
  ],

  batches: [
    // sample:true marks a demo record that does not exist on rangaaroots.com
    { id: "RR-GHEE-2026-011", product: "A2 Bilona Desi Cow Ghee", farm: "Kangayam Heritage Cattle Farm, Bagalur Green Belt, Hosur", harvested: "02/02/2026", processed: "03/02/2026", packed: "04/02/2026", method: "Overnight clay-pot curdling, two-way rope Bilona churning before sunrise", purity: "100%", moisture: "0.2%", sample: true },
    { id: "RR-ABC-2026-001", product: "ABC Malt (Apple Beetroot Carrot)", farm: "Rangaa Roots Farm & In-House Processing Lab", harvested: "15/01/2026", processed: "22/01/2026", packed: "25/01/2026", method: "Slow dehydration of fresh produce & hand-stone milling with country sugar & nuts", purity: "99.8%", moisture: "3.4%" },
    { id: "RR-URAD-2026-004", product: "UradFit Nutri Blend (For Men)", farm: "Jawadhu Tribal Natural Millet Cluster", harvested: "10/01/2026", processed: "18/01/2026", packed: "20/01/2026", method: "Traditional dry roasting of native black urad, walnuts, almonds & ashwagandha", purity: "100%", moisture: "2.8%" },
    { id: "RR-RICE-2026-021", product: "Karuppu Kavuni Black Rice", farm: "Cauvery Delta Heritage Rice Collective", harvested: "28/12/2025", processed: "12/01/2026", packed: "15/01/2026", method: "Single-pass rubber dehulling to retain 100% bran & anthocyanin layer", purity: "99.5%", moisture: "11.8%" },
  ],

  reviews: [
    { name: "Priya Sundaram", place: "Coimbatore", title: "Authentic taste just like homemade!", text: "My two children refuse commercial malt drinks now. The colour from real beetroots and apples is natural and the aroma of cardamom and almonds is fantastic." },
    { name: "Karthik Raja", place: "Bengaluru", title: "Clean energy without bloat", text: "As a marathon trainee, regular whey gave me digestion issues. UradFit is a game changer — the black urad and dry ginger combination feels light yet powerful." },
    { name: "Anitha Venkatesh", place: "Hosur", title: "Kids love the chocolate taste!", text: "I worried my 7-year-old would taste the black urad, but the chocolate and palm jaggery blend tastes like premium hot cocoa." },
    { name: "S. Rajagopalan", place: "Madurai", title: "Very easy to digest for seniors", text: "I am 68 and take this in warm milk every morning. It gives me steady stamina for my morning walks without feeling heavy." },
  ],
};
