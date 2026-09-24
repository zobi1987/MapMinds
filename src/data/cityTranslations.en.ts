export interface EnglishCityTranslation {
  hints: [string, string, string]
  summary: string
  place: { name: string; country: string }
}

export const englishCityTranslations: Record<string, EnglishCityTranslation> = {
  'paris': {
    hints: ["River city", "Avenues radiate toward a central arch, and a river cuts through the middle of the grid.", "France"],
    summary: "Avenues radiate toward a central arch, and a river cuts through the middle of the grid.",
    place: { name: "Paris", country: "France" },
  },
  'london': {
    hints: ["Tidal river", "A broad tidal river bends through the middle and opens eastward into a wide estuary.", "United Kingdom"],
    summary: "A broad tidal river bends through the middle and opens eastward into a wide estuary.",
    place: { name: "London", country: "United Kingdom" },
  },
  'rom': {
    hints: ["River city", "Seven hills surround a river bend, where an oval amphitheater rises out of the dense blocks.", "Italy"],
    summary: "Seven hills surround a river bend, where an oval amphitheater rises out of the dense blocks.",
    place: { name: "Rome", country: "Italy" },
  },
  'barcelona': {
    hints: ["Coastal city", "A chessboard of blocks meets an older tangle of lanes right on the Mediterranean shore.", "Spain"],
    summary: "A chessboard of blocks meets an older tangle of lanes right on the Mediterranean shore.",
    place: { name: "Barcelona", country: "Spain" },
  },
  'amsterdam': {
    hints: ["Canal city", "Concentric canals cut a fan-shaped network of narrow plots.", "Netherlands"],
    summary: "Concentric canals cut a fan-shaped network of narrow plots.",
    place: { name: "Amsterdam", country: "Netherlands" },
  },
  'berlin': {
    hints: ["River city", "A wide river divides a sprawling city cut by large parks and straight clearings.", "Germany"],
    summary: "A wide river divides a sprawling city cut by large parks and straight clearings.",
    place: { name: "Berlin", country: "Germany" },
  },
  'prag': {
    hints: ["River city", "A river swings around a castle hill above a dense old town of red roofs.", "Czechia"],
    summary: "A river swings around a castle hill above a dense old town of red roofs.",
    place: { name: "Prague", country: "Czechia" },
  },
  'wien': {
    hints: ["River city", "A ring road encloses the old core, while a broad river passes wooded banks nearby.", "Austria"],
    summary: "A ring road encloses the old core, while a broad river passes wooded banks nearby.",
    place: { name: "Vienna", country: "Austria" },
  },
  'athen': {
    hints: ["Coastal city", "A dense white city wraps a rocky citadel hill and reaches toward a nearby bay.", "Greece"],
    summary: "A dense white city wraps a rocky citadel hill and reaches toward a nearby bay.",
    place: { name: "Athens", country: "Greece" },
  },
  'lissabon': {
    hints: ["River mouth", "Steep districts climb from a broad estuary that opens toward the Atlantic.", "Portugal"],
    summary: "Steep districts climb from a broad estuary that opens toward the Atlantic.",
    place: { name: "Lisbon", country: "Portugal" },
  },
  'istanbul': {
    hints: ["Strait city", "A narrow strait divides the built-up area, and a long inlet cuts into the northern shore.", "Turkey"],
    summary: "A narrow strait divides the built-up area, and a long inlet cuts into the northern shore.",
    place: { name: "Istanbul", country: "Turkey" },
  },
  'new-york': {
    hints: ["Port city", "A long island carries a tight grid of towers between two river arms.", "USA"],
    summary: "A long island carries a tight grid of towers between two river arms.",
    place: { name: "New York City", country: "USA" },
  },
  'los-angeles': {
    hints: ["Coastal city", "A vast low-rise street grid runs into mountain ranges and a long Pacific beach.", "USA"],
    summary: "A vast low-rise street grid runs into mountain ranges and a long Pacific beach.",
    place: { name: "Los Angeles", country: "USA" },
  },
  'chicago': {
    hints: ["Lake city", "A right-angled grid meets the shore of an enormous freshwater lake.", "USA"],
    summary: "A right-angled grid meets the shore of an enormous freshwater lake.",
    place: { name: "Chicago", country: "USA" },
  },
  'san-francisco': {
    hints: ["Bay city", "A hilly peninsula sits between a narrow strait and a wide bay.", "USA"],
    summary: "A hilly peninsula sits between a narrow strait and a wide bay.",
    place: { name: "San Francisco", country: "USA" },
  },
  'toronto': {
    hints: ["Lake city", "A tower core stands on a great lake, with islands lying just offshore.", "Canada"],
    summary: "A tower core stands on a great lake, with islands lying just offshore.",
    place: { name: "Toronto", country: "Canada" },
  },
  'tokio': {
    hints: ["Bay city", "Endless dense blocks wrap the head of a long bay.", "Japan"],
    summary: "Endless dense blocks wrap the head of a long bay.",
    place: { name: "Tokyo", country: "Japan" },
  },
  'peking': {
    hints: ["Grid city", "Huge ring roads and a strict north-south axis organize a very wide city.", "China"],
    summary: "Huge ring roads and a strict north-south axis organize a very wide city.",
    place: { name: "Beijing", country: "China" },
  },
  'dubai': {
    hints: ["Coastal city", "An artificially extended coast meets desert and a highway grid inland.", "United Arab Emirates"],
    summary: "An artificially extended coast meets desert and a highway grid inland.",
    place: { name: "Dubai", country: "United Arab Emirates" },
  },
  'bangkok': {
    hints: ["River city", "A wide river winds through an enormous flat sea of buildings and canals.", "Thailand"],
    summary: "A wide river winds through an enormous flat sea of buildings and canals.",
    place: { name: "Bangkok", country: "Thailand" },
  },
  'seoul': {
    hints: ["River city", "A river crosses a basin of tall housing blocks framed by mountains.", "South Korea"],
    summary: "A river crosses a basin of tall housing blocks framed by mountains.",
    place: { name: "Seoul", country: "South Korea" },
  },
  'mumbai': {
    hints: ["Coastal city", "A narrow peninsula carries an extremely dense city between a bay and the open sea.", "India"],
    summary: "A narrow peninsula carries an extremely dense city between a bay and the open sea.",
    place: { name: "Mumbai", country: "India" },
  },
  'delhi': {
    hints: ["River city", "A planned government district of broad axes sits beside a much older, tangled city.", "India"],
    summary: "A planned government district of broad axes sits beside a much older, tangled city.",
    place: { name: "Delhi", country: "India" },
  },
  'kairo': {
    hints: ["River city", "A huge city crowds the green ribbon of a desert river and spills into the sand.", "Egypt"],
    summary: "A huge city crowds the green ribbon of a desert river and spills into the sand.",
    place: { name: "Cairo", country: "Egypt" },
  },
  'kapstadt': {
    hints: ["Coastal city", "A flat-topped mountain stands over a curved harbor between two oceans.", "South Africa"],
    summary: "A flat-topped mountain stands over a curved harbor between two oceans.",
    place: { name: "Cape Town", country: "South Africa" },
  },
  'marrakesch': {
    hints: ["Oasis city", "A walled old town of red earth sits at the edge of a palm oasis before the mountains.", "Morocco"],
    summary: "A walled old town of red earth sits at the edge of a palm oasis before the mountains.",
    place: { name: "Marrakesh", country: "Morocco" },
  },
  'nairobi': {
    hints: ["Highland city", "A modern core sits on a cool highland plateau beside a large national park.", "Kenya"],
    summary: "A modern core sits on a cool highland plateau beside a large national park.",
    place: { name: "Nairobi", country: "Kenya" },
  },
  'rio-de-janeiro': {
    hints: ["Bay city", "Steep granite peaks rise straight out of a wide bay and out of the dense city.", "Brazil"],
    summary: "Steep granite peaks rise straight out of a wide bay and out of the dense city.",
    place: { name: "Rio de Janeiro", country: "Brazil" },
  },
  'mexiko-stadt': {
    hints: ["Highland city", "An enormous city fills a closed highland basin that was once a lake.", "Mexico"],
    summary: "An enormous city fills a closed highland basin that was once a lake.",
    place: { name: "Mexico City", country: "Mexico" },
  },
  'buenos-aires': {
    hints: ["River mouth", "A chessboard grid lies along an extremely wide river estuary.", "Argentina"],
    summary: "A chessboard grid lies along an extremely wide river estuary.",
    place: { name: "Buenos Aires", country: "Argentina" },
  },
  'sao-paulo': {
    hints: ["Highland city", "An endless sea of buildings covers rolling highland without a large body of water.", "Brazil"],
    summary: "An endless sea of buildings covers rolling highland without a large body of water.",
    place: { name: "São Paulo", country: "Brazil" },
  },
  'sydney': {
    hints: ["Port city", "A deep, branching natural harbor sits directly beside a dense downtown.", "Australia"],
    summary: "A deep, branching natural harbor sits directly beside a dense downtown.",
    place: { name: "Sydney", country: "Australia" },
  },
  'melbourne': {
    hints: ["Bay city", "A right-angled grid lies on the north shore of a large, nearly enclosed bay.", "Australia"],
    summary: "A right-angled grid lies on the north shore of a large, nearly enclosed bay.",
    place: { name: "Melbourne", country: "Australia" },
  },
  'edinburgh': {
    hints: ["Coastal city", "A castle rock and a steep volcanic crag divide a compact city on a firth.", "United Kingdom"],
    summary: "A castle rock and a steep volcanic crag divide a compact city on a firth.",
    place: { name: "Edinburgh", country: "United Kingdom" },
  },
  'budapest': {
    hints: ["River city", "A broad river separates a hilly castle bank from a flat, gridded shore.", "Hungary"],
    summary: "A broad river separates a hilly castle bank from a flat, gridded shore.",
    place: { name: "Budapest", country: "Hungary" },
  },
  'kopenhagen': {
    hints: ["Port city", "The center sits on islands and quays among shallow harbor basins.", "Denmark"],
    summary: "The center sits on islands and quays among shallow harbor basins.",
    place: { name: "Copenhagen", country: "Denmark" },
  },
  'dublin': {
    hints: ["Bay city", "A compact city lies on a wide bay, and a river divides the center.", "Ireland"],
    summary: "A compact city lies on a wide bay, and a river divides the center.",
    place: { name: "Dublin", country: "Ireland" },
  },
  'krakau': {
    hints: ["River city", "A huge market square and a castle hill sit inside a bend of a river.", "Poland"],
    summary: "A huge market square and a castle hill sit inside a bend of a river.",
    place: { name: "Kraków", country: "Poland" },
  },
  'hamburg': {
    hints: ["Port city", "A large seaport stretches with docks and warehouse blocks along a broad river.", "Germany"],
    summary: "A large seaport stretches with docks and warehouse blocks along a broad river.",
    place: { name: "Hamburg", country: "Germany" },
  },
  'munchen': {
    hints: ["River city", "A compact old town with twin church towers lies on a small river before the Alps.", "Germany"],
    summary: "A compact old town with twin church towers lies on a small river before the Alps.",
    place: { name: "Munich", country: "Germany" },
  },
  'stockholm': {
    hints: ["Island city", "The old center stands on islands between a lake and a coast of skerries.", "Sweden"],
    summary: "The old center stands on islands between a lake and a coast of skerries.",
    place: { name: "Stockholm", country: "Sweden" },
  },
  'valencia': {
    hints: ["Coastal city", "A dense city lies on a fertile coastal plain directly beside a Mediterranean beach.", "Spain"],
    summary: "A dense city lies on a fertile coastal plain directly beside a Mediterranean beach.",
    place: { name: "Valencia", country: "Spain" },
  },
  'brussel': {
    hints: ["River city", "A pentagonal ring encloses a small medieval core inside a sprawling city.", "Belgium"],
    summary: "A pentagonal ring encloses a small medieval core inside a sprawling city.",
    place: { name: "Brussels", country: "Belgium" },
  },
  'birmingham': {
    hints: ["Grid city", "A dense net of canals and rail lines runs through a wide inland industrial city.", "United Kingdom"],
    summary: "A dense net of canals and rail lines runs through a wide inland industrial city.",
    place: { name: "Birmingham", country: "United Kingdom" },
  },
  'vancouver': {
    hints: ["Coastal city", "Towers stand on a peninsula between mountains, a bay, and an island offshore.", "Canada"],
    summary: "Towers stand on a peninsula between mountains, a bay, and an island offshore.",
    place: { name: "Vancouver", country: "Canada" },
  },
  'montreal': {
    hints: ["River island", "The core lies on a large river island, with a single mountain rising behind it.", "Canada"],
    summary: "The core lies on a large river island, with a single mountain rising behind it.",
    place: { name: "Montreal", country: "Canada" },
  },
  'boston': {
    hints: ["Port city", "A tangled peninsula of filled land juts into a many-armed harbor.", "USA"],
    summary: "A tangled peninsula of filled land juts into a many-armed harbor.",
    place: { name: "Boston", country: "USA" },
  },
  'seattle': {
    hints: ["Bay city", "A narrow city lies between a long sound and a large inland lake.", "USA"],
    summary: "A narrow city lies between a long sound and a large inland lake.",
    place: { name: "Seattle", country: "USA" },
  },
  'calgary': {
    hints: ["River city", "A wide grid lies where two rivers meet at the foot of the Rocky Mountains.", "Canada"],
    summary: "A wide grid lies where two rivers meet at the foot of the Rocky Mountains.",
    place: { name: "Calgary", country: "Canada" },
  },
  'shanghai': {
    hints: ["Delta city", "A river arm divides an older bank from a forest of skyscrapers on the opposite shore.", "China"],
    summary: "A river arm divides an older bank from a forest of skyscrapers on the opposite shore.",
    place: { name: "Shanghai", country: "China" },
  },
  'kyoto': {
    hints: ["River city", "A right-angled, low-rise grid lies in a basin framed by forested mountains.", "Japan"],
    summary: "A right-angled, low-rise grid lies in a basin framed by forested mountains.",
    place: { name: "Kyoto", country: "Japan" },
  },
  'hongkong': {
    hints: ["Port city", "Skyscrapers crowd a steep island and the mainland shore across a harbor.", "China"],
    summary: "Skyscrapers crowd a steep island and the mainland shore across a harbor.",
    place: { name: "Hong Kong", country: "China" },
  },
  'hanoi': {
    hints: ["River city", "A lake and a tangled old town lie on the right bank of a great river.", "Vietnam"],
    summary: "A lake and a tangled old town lie on the right bank of a great river.",
    place: { name: "Hanoi", country: "Vietnam" },
  },
  'kathmandu': {
    hints: ["Highland city", "A dense brick city fills a high valley, surrounded by a ring of still higher mountains.", "Nepal"],
    summary: "A dense brick city fills a high valley, surrounded by a ring of still higher mountains.",
    place: { name: "Kathmandu", country: "Nepal" },
  },
  'busan': {
    hints: ["Port city", "Buildings climb steep slopes around a deep, almost circular harbor.", "South Korea"],
    summary: "Buildings climb steep slopes around a deep, almost circular harbor.",
    place: { name: "Busan", country: "South Korea" },
  },
  'amman': {
    hints: ["Highland city", "A dense city spreads across several hills on a dry plateau.", "Jordan"],
    summary: "A dense city spreads across several hills on a dry plateau.",
    place: { name: "Amman", country: "Jordan" },
  },
  'casablanca': {
    hints: ["Coastal city", "A large Atlantic port sits beside a sprawling, pale city on a straight coast.", "Morocco"],
    summary: "A large Atlantic port sits beside a sprawling, pale city on a straight coast.",
    place: { name: "Casablanca", country: "Morocco" },
  },
  'lagos': {
    hints: ["Lagoon city", "An extremely dense city spreads across islands and shores of a large lagoon.", "Nigeria"],
    summary: "An extremely dense city spreads across islands and shores of a large lagoon.",
    place: { name: "Lagos", country: "Nigeria" },
  },
  'accra': {
    hints: ["Coastal city", "A low, sprawling city follows a fairly straight gulf coast.", "Ghana"],
    summary: "A low, sprawling city follows a fairly straight gulf coast.",
    place: { name: "Accra", country: "Ghana" },
  },
  'addis-abeba': {
    hints: ["Highland city", "A sprawling capital sits on a high, cool plateau.", "Ethiopia"],
    summary: "A sprawling capital sits on a high, cool plateau.",
    place: { name: "Addis Ababa", country: "Ethiopia" },
  },
  'havanna': {
    hints: ["Bay city", "A colonial old town lines a long, narrow, sheltered harbor.", "Cuba"],
    summary: "A colonial old town lines a long, narrow, sheltered harbor.",
    place: { name: "Havana", country: "Cuba" },
  },
  'quito': {
    hints: ["Highland city", "A long, narrow city stretches through a high Andean valley directly below a volcano.", "Ecuador"],
    summary: "A long, narrow city stretches through a high Andean valley directly below a volcano.",
    place: { name: "Quito", country: "Ecuador" },
  },
  'lima': {
    hints: ["Coastal city", "A huge city sits on a cliff above the Pacific, in a desert that almost never sees rain.", "Peru"],
    summary: "A huge city sits on a cliff above the Pacific, in a desert that almost never sees rain.",
    place: { name: "Lima", country: "Peru" },
  },
  'bogota': {
    hints: ["Highland city", "A very large city lies on a cool plateau at the foot of a steep eastern cordillera.", "Colombia"],
    summary: "A very large city lies on a cool plateau at the foot of a steep eastern cordillera.",
    place: { name: "Bogotá", country: "Colombia" },
  },
  'auckland': {
    hints: ["Isthmus city", "A city spreads across a narrow isthmus between two large harbors.", "New Zealand"],
    summary: "A city spreads across a narrow isthmus between two large harbors.",
    place: { name: "Auckland", country: "New Zealand" },
  },
  'brisbane': {
    hints: ["River city", "A broad, sharply winding river snakes through a low, sprawling city.", "Australia"],
    summary: "A broad, sharply winding river snakes through a low, sprawling city.",
    place: { name: "Brisbane", country: "Australia" },
  },
  'bergen': {
    hints: ["Fjord city", "Wooden houses crowd a harbor set deep between steep mountains.", "Norway"],
    summary: "Wooden houses crowd a harbor set deep between steep mountains.",
    place: { name: "Bergen", country: "Norway" },
  },
  'riga': {
    hints: ["River city", "A Hanseatic city with a large art-nouveau district lies just before a broad river meets the sea.", "Latvia"],
    summary: "A Hanseatic city with a large art-nouveau district lies just before a broad river meets the sea.",
    place: { name: "Riga", country: "Latvia" },
  },
  'tallinn': {
    hints: ["Coastal city", "A walled upper town sits on a limestone cliff above a harbor on a gulf.", "Estonia"],
    summary: "A walled upper town sits on a limestone cliff above a harbor on a gulf.",
    place: { name: "Tallinn", country: "Estonia" },
  },
  'nizza': {
    hints: ["Coastal city", "A dense city curves along a famous bay at the foot of steep coastal hills.", "France"],
    summary: "A dense city curves along a famous bay at the foot of steep coastal hills.",
    place: { name: "Nice", country: "France" },
  },
  'reykjavik': {
    hints: ["Coastal city", "A low, colorful city lies on a steaming bay along a bare peninsula.", "Iceland"],
    summary: "A low, colorful city lies on a steaming bay along a bare peninsula.",
    place: { name: "Reykjavík", country: "Iceland" },
  },
  'brugge': {
    hints: ["Canal city", "An almost circular canal system encloses a medieval city of brick towers.", "Belgium"],
    summary: "An almost circular canal system encloses a medieval city of brick towers.",
    place: { name: "Bruges", country: "Belgium" },
  },
  'zagreb': {
    hints: ["River city", "A compact capital lies on a river below a wooded ridge.", "Croatia"],
    summary: "A compact capital lies on a river below a wooded ridge.",
    place: { name: "Zagreb", country: "Croatia" },
  },
  'ottawa': {
    hints: ["River city", "Government buildings stand beside a river that drops over a broad waterfall.", "Canada"],
    summary: "Government buildings stand beside a river that drops over a broad waterfall.",
    place: { name: "Ottawa", country: "Canada" },
  },
  'bukarest': {
    hints: ["River city", "A wide capital of broad boulevards lies on a flat plain.", "Romania"],
    summary: "A wide capital of broad boulevards lies on a flat plain.",
    place: { name: "Bucharest", country: "Romania" },
  },
  'osaka': {
    hints: ["Port city", "An extremely dense city fills a river delta on a large bay.", "Japan"],
    summary: "An extremely dense city fills a river delta on a large bay.",
    place: { name: "Osaka", country: "Japan" },
  },
  'phnom-penh': {
    hints: ["River city", "A city lies at the meeting of two great rivers on a wide plain.", "Cambodia"],
    summary: "A city lies at the meeting of two great rivers on a wide plain.",
    place: { name: "Phnom Penh", country: "Cambodia" },
  },
  'doha': {
    hints: ["Coastal city", "A fast-grown city of towers lies on a semicircular bay in the desert.", "Qatar"],
    summary: "A fast-grown city of towers lies on a semicircular bay in the desert.",
    place: { name: "Doha", country: "Qatar" },
  },
  'lahore': {
    hints: ["River city", "An old garden city with a great fort lies on a fertile river plain.", "Pakistan"],
    summary: "An old garden city with a great fort lies on a fertile river plain.",
    place: { name: "Lahore", country: "Pakistan" },
  },
  'beirut': {
    hints: ["Coastal city", "A dense city sits on a cape between mountains and a Mediterranean harbor.", "Lebanon"],
    summary: "A dense city sits on a cape between mountains and a Mediterranean harbor.",
    place: { name: "Beirut", country: "Lebanon" },
  },
  'riad': {
    hints: ["Desert city", "A very large, planned city lies in the middle of a plateau with no river and no sea.", "Saudi Arabia"],
    summary: "A very large, planned city lies in the middle of a plateau with no river and no sea.",
    place: { name: "Riyadh", country: "Saudi Arabia" },
  },
  'tiflis': {
    hints: ["River city", "A long city runs through a narrow gorge where hot springs emerge.", "Georgia"],
    summary: "A long city runs through a narrow gorge where hot springs emerge.",
    place: { name: "Tbilisi", country: "Georgia" },
  },
  'ulan-bator': {
    hints: ["Highland city", "A capital lies in a cold valley, ringed by mountains and steppe.", "Mongolia"],
    summary: "A capital lies in a cold valley, ringed by mountains and steppe.",
    place: { name: "Ulaanbaatar", country: "Mongolia" },
  },
  'tunis': {
    hints: ["Lagoon city", "A capital lies on a shallow lagoon behind a narrow coastal bar.", "Tunisia"],
    summary: "A capital lies on a shallow lagoon behind a narrow coastal bar.",
    place: { name: "Tunis", country: "Tunisia" },
  },
  'alexandria': {
    hints: ["Coastal city", "A long city stretches along a narrow ridge between the sea and a lagoon.", "Egypt"],
    summary: "A long city stretches along a narrow ridge between the sea and a lagoon.",
    place: { name: "Alexandria", country: "Egypt" },
  },
  'maputo': {
    hints: ["Bay city", "A port city lies on a deep bay, facing a long sand spit.", "Mozambique"],
    summary: "A port city lies on a deep bay, facing a long sand spit.",
    place: { name: "Maputo", country: "Mozambique" },
  },
  'windhoek': {
    hints: ["Highland city", "A small capital sits in a dry highland basin, surrounded by barren hills.", "Namibia"],
    summary: "A small capital sits in a dry highland basin, surrounded by barren hills.",
    place: { name: "Windhoek", country: "Namibia" },
  },
  'baku': {
    hints: ["Peninsula city", "A large city lies on a spit of land that juts into an oil-rich inland sea.", "Azerbaijan"],
    summary: "A large city lies on a spit of land that juts into an oil-rich inland sea.",
    place: { name: "Baku", country: "Azerbaijan" },
  },
  'sansibar': {
    hints: ["Island city", "A coral-stone old town lies on the west coast of a spice island.", "Tanzania"],
    summary: "A coral-stone old town lies on the west coast of a spice island.",
    place: { name: "Zanzibar City", country: "Tanzania" },
  },
  'valparaiso': {
    hints: ["Port city", "Colorful houses climb like an amphitheater around a steep Pacific port.", "Chile"],
    summary: "Colorful houses climb like an amphitheater around a steep Pacific port.",
    place: { name: "Valparaíso", country: "Chile" },
  },
  'cusco': {
    hints: ["Highland city", "An Inca city lies in a high valley basin, its streets still following an old pattern.", "Peru"],
    summary: "An Inca city lies in a high valley basin, its streets still following an old pattern.",
    place: { name: "Cusco", country: "Peru" },
  },
  'montevideo': {
    hints: ["Coastal city", "A capital lies on a point of land where a huge river meets the sea.", "Uruguay"],
    summary: "A capital lies on a point of land where a huge river meets the sea.",
    place: { name: "Montevideo", country: "Uruguay" },
  },
  'salvador': {
    hints: ["Bay city", "An upper town on a cliff and a lower town at the port divide a tropical bay.", "Brazil"],
    summary: "An upper town on a cliff and a lower town at the port divide a tropical bay.",
    place: { name: "Salvador", country: "Brazil" },
  },
  'manaus': {
    hints: ["River city", "A large city lies in the middle of the rainforest where two enormous rivers meet.", "Brazil"],
    summary: "A large city lies in the middle of the rainforest where two enormous rivers meet.",
    place: { name: "Manaus", country: "Brazil" },
  },
  'la-paz': {
    hints: ["Highland city", "The city clings to the steep walls of a canyon high above the altiplano.", "Bolivia"],
    summary: "The city clings to the steep walls of a canyon high above the altiplano.",
    place: { name: "La Paz", country: "Bolivia" },
  },
  'perth': {
    hints: ["Coastal city", "An isolated metropolis lies on a river just before it meets the Indian Ocean.", "Australia"],
    summary: "An isolated metropolis lies on a river just before it meets the Indian Ocean.",
    place: { name: "Perth", country: "Australia" },
  },
  'taschkent': {
    hints: ["Oasis city", "A large oasis city lies on an irrigated plain in front of a high mountain range.", "Uzbekistan"],
    summary: "A large oasis city lies on an irrigated plain in front of a high mountain range.",
    place: { name: "Tashkent", country: "Uzbekistan" },
  },
  'christchurch': {
    hints: ["River city", "A flat grid is crossed by a narrow river and lies before a volcanic coast.", "New Zealand"],
    summary: "A flat grid is crossed by a narrow river and lies before a volcanic coast.",
    place: { name: "Christchurch", country: "New Zealand" },
  },
  'pjongjang': {
    hints: ["River city", "A monumental, widely planned capital lies on a broad river.", "North Korea"],
    summary: "A monumental, widely planned capital lies on a broad river.",
    place: { name: "Pyongyang", country: "North Korea" },
  },
}

export const englishCityNames: Record<string, string> = {
  Q220: "Rome",
  Q1085: "Prague",
  Q1741: "Vienna",
  Q1524: "Athens",
  Q597: "Lisbon",
  Q60: "New York City",
  Q1490: "Tokyo",
  Q956: "Beijing",
  Q85: "Cairo",
  Q5465: "Cape Town",
  Q101625: "Marrakesh",
  Q1489: "Mexico City",
  Q1748: "Copenhagen",
  Q31487: "Kraków",
  Q1726: "Munich",
  Q239: "Brussels",
  Q8646: "Hong Kong",
  Q3624: "Addis Ababa",
  Q1563: "Havana",
  Q33959: "Nice",
  Q12994: "Bruges",
  Q19660: "Bucharest",
  Q3692: "Riyadh",
  Q994: "Tbilisi",
  Q23430: "Ulaanbaatar",
  Q2222874: "Zanzibar City",
  Q269: "Tashkent",
  Q18808: "Pyongyang",
}
