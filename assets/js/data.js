/* Rangaa Roots — catalogue data
 * Products and reviews are taken from rangaaroots.com.
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

  // Home page wording for some products. The home page lists the whole catalogue (catalog.js);
  // `of` names the catalogue entry a photo product stands in for. Entries without `of` are not
  // in the catalogue, so they name their own family.
  products: [
    { id: "a2-ghee", of: "a2-ghee", name: "A2 Bilona Desi Cow Ghee", note: "Curd-churned from Kangayam & Gir cow milk, simmered until granular.", size: "500ml", img: "a2-cow-ghee.jpg" },
    { id: "abc-malt", of: "abc-malt", name: "ABC Malt (Apple Beetroot Carrot)", note: "100% Home Made · No Preservatives", size: "500g", img: "rangaa-roots-abc-malt.jpg" },
    { id: "uradfit-men", of: "uradfit-nutri-blend", name: "UradFit Nutri Blend (For Men)", note: "28.1g Protein per 100g", size: "500g", img: "rangaa-roots-uradfit-men.jpg" },
    { id: "choco-kids", of: "choco-black-urad", name: "Choco Black Urad Growth Mix (Kids)", note: "21.8g Protein · Choco taste", size: "500g", img: "rangaa-roots-choco-black-urad-kids.jpg" },
    { id: "blackboozt", of: "blackboozt-nutri-plus", name: "BlackBoozt Nutri+ (For Elders)", note: "19.8g Protein · Active ageing", size: "500g", img: "rangaa-roots-blackboozt-elder.jpg" },
    { id: "red-bliss", family: "malts", name: "Red Bliss Functional Drink Mix", note: "12 Superfoods + 17 Micronutrients", size: "325g", img: "rangaa-roots-red-bliss-superfood.jpg" },
    { id: "black-cumin", family: "malts", name: "Black Cumin Digest-o-Care", note: "Relieves bloating & gas", size: "150g", img: "black-cumin-digest.jpg" },
    { id: "panankarkandu", family: "malts", name: "Panankarkandu Pal Mix", note: "Palm candy warm-milk mix · Soothes throat", size: "250g", img: "panankarkandu-pal-mix.jpg" },
    { id: "banana-stem", of: "banana-stem-soup", name: "Banana Stem Soup Blend", note: "Kidney & urinary care · High fibre", size: "200g", img: "banana-stem-soup.jpg" },
    { id: "coconut-sugar", of: "coconut-sugar", name: "Coconut Blossom Sugar", note: "Low GI 35 · Unrefined Pollachi sap", size: "500g", img: "coconut-sugar.jpg" },
    { id: "palm-jaggery", of: "palm-sugar", name: "Udangudi Palm Jaggery Powder", note: "Unrefined karupatti · Rich in iron & minerals", img: "udangudi-palm-jaggery.jpg" },
    { id: "vallarai", of: "vallarai-thokku", name: "Vallarai Keerai Thokku", note: "Fresh Centella greens · Brain tonic relish", size: "300g", img: "vallarai-thokku.jpg" },
  ],

  reviews: [
    { name: "Priya Sundaram", place: "Coimbatore", title: "Authentic taste just like homemade!", text: "My two children refuse commercial malt drinks now. The colour from real beetroots and apples is natural and the aroma of cardamom and almonds is fantastic." },
    { name: "Karthik Raja", place: "Bengaluru", title: "Clean energy without bloat", text: "As a marathon trainee, regular whey gave me digestion issues. UradFit is a game changer — the black urad and dry ginger combination feels light yet powerful." },
    { name: "Anitha Venkatesh", place: "Hosur", title: "Kids love the chocolate taste!", text: "I worried my 7-year-old would taste the black urad, but the chocolate and palm jaggery blend tastes like premium hot cocoa." },
    { name: "S. Rajagopalan", place: "Madurai", title: "Very easy to digest for seniors", text: "I am 68 and take this in warm milk every morning. It gives me steady stamina for my morning walks without feeling heavy." },
  ],
};
