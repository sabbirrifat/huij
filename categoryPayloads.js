const topCountries = {
  us: "united states",
  uk: "united kingdom",
  au: "australia",
  nz: "new zealand",
  de: "germany",
  fr: "france",
  ca: "canada",
  ae: "united arab emirates",
  nl: "netherlands",
  ie: "ireland",
  it: "italy",
  es: "spain",
  mx: "mexico",
  se: "sweden",
  tr: "turkey",
  be: "belgium",
  ch: "switzerland",
  br: "brazil",
  dk: "denmark",
  no: "norway",
  sg: "singapore",
  id: "indonesia",
};


const selectedCountry = topCountries.us;


//size 2.8 million
const AccomodationServices = {
  filters: [
    { field: "location_country", operator: "ANY_OF_VALUES", values: [selectedCountry] },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "accommodation and food services",
        "bars, taverns, and nightclubs",
        "bed-and-breakfasts, hostels, homestays",
        "caterers",
        "food and beverage services",
        "hospitality",
        "hotels and motels",
        "leisure, travel & tourism",
        "mobile food services",
        "restaurants",
      ],
    },
  ],
};

//size 1.6 million
const AdministrativeAndSupportServices = {
  filters: [
    { field: "location_country", operator: "ANY_OF_VALUES", values: [selectedCountry] },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "collection agencies",
        "events services",
        "executive search services",
        "facilities services",
        "fundraising",
        "janitorial services",
        "landscaping services",
        "office administration",
        "security and investigations",
        "security guards and patrol services",
        "security systems services",
        "staffing and recruiting",
        "telephone call centers",
        "temporary help services",
        "translation and localization",
        "travel arrangements",
        "writing and editing",
      ],
    },
  ],
};

//size 400k
const Construction = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "building construction",
        "building equipment contractors",
        "building finishing contractors",
        "building materials",
        "building structure and exterior contractors",
        "civil engineering",
        "highway, street, and bridge construction",
        "nonresidential building construction",
        "residential building construction",
        "specialty trade contractors",
        "subdivision of land",
        "utility system construction",
      ],
    },
  ],
};

//size 75k only
const ConsumerGoods = {
  filters: [
    { field: "location_country", operator: "ANY_OF_VALUES", values: [selectedCountry] },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "arts & crafts",
        "business supplies & equipment",
        "consumer electronics",
        "cosmetics",
        "sporting goods",
        "tobacco",
      ],
    },
  ],
};

//size 1.5 million
const ConsumerServices = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "civic and social organizations",
        "commercial and industrial machinery maintenance",
        "consumer goods",
        "electronic and precision equipment maintenance",
        "footwear and leather goods repair",
        "household services",
        "industry associations",
        "laundry and drycleaning services",
        "non-profit organizations",
        "personal and laundry services",
        "personal care services",
        "pet services",
        "philanthropic fundraising services",
        "political organizations",
        "professional organizations",
        "religious institutions",
        "repair and maintenance",
        "reupholstery and furniture repair",
        "vehicle repair and maintenance",
      ],
    },
  ],
};

//size 5.4 million
const Education = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "cosmetology and barber schools",
        "e-learning",
        "e-learning providers",
        "education management",
        "fine arts schools",
        "flight training",
        "higher education",
        "language schools",
        "primary and secondary education",
        "professional training and coaching",
        "research",
        "secretarial schools",
        "sports and recreation instruction",
        "technical and vocational training",
      ],
    },
  ],
};

//size 1.4 million
const EntertainmnetProviders = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "amusement parks and arcades",
        "animation",
        "artists and writers",
        "circuses and magic shows",
        "dance companies",
        "entertainment",
        "fine art",
        "gambling facilities and casinos",
        "golf courses and country clubs",
        "historical sites",
        "movies, videos, and sound",
        "museums",
        "museums, historical sites, and zoos",
        "music",
        "musicians",
        "performing arts",
        "performing arts and spectator sports",
        "racetracks",
        "recreational facilities",
        "skiing facilities",
        "spectator sports",
        "sports teams and clubs",
        "theater companies",
        "wellness and fitness services",
        "zoos and botanical gardens",
      ],
    },
  ],
};

//size 122k only
const FarmingRanchingAndForestry = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: ["farming", "fisheries", "forestry and logging", "horticulture", "ranching", "ranching and fisheries"],
    },
  ],
};

// size 2.7 million
const FinancialServices = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "banking",
        "capital markets",
        "claims adjusting, actuarial services",
        "credit intermediation",
        "funds and trusts",
        "insurance",
        "insurance agencies and brokerages",
        "insurance and employee benefit funds",
        "insurance carriers",
        "international trade and development",
        "investment advice",
        "investment banking",
        "investment management",
        "loan brokers",
        "pension funds",
        "savings institutions",
        "securities and commodity exchanges",
        "trusts and estates",
        "venture capital and private equity principals",
      ],
    },
  ],
};

//size 122k only
const FoodProduction = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: ["dairy", "food & beverages", "wine & spirits"],
    },
  ],
};

//size 2.7 million

const GovermentAdministration = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "administration of justice",
        "air, water, and waste program management",
        "armed forces",
        "community development and urban planning",
        "conservation programs",
        "correctional institutions",
        "courts of law",
        "economic programs",
        "education administration programs",
        "environmental quality programs",
        "executive offices",
        "fire protection",
        "government relations",
        "health and human services",
        "housing and community development",
        "housing programs",
        "international affairs",
        "law enforcement",
        "legislative offices",
        "military and international affairs",
        "public assistance programs",
        "public health",
        "public policy",
        "public policy offices",
        "public safety",
        "space research and technology",
        "transportation programs",
        "utilities administration",
      ],
    },
  ],
};

//size 247k only
const HealthCare = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: ["biotechnology", "health, wellness & fitness", "medical device", "veterinary"],
    },
  ],
};

//size 1.5 million
const hospitalsAndHealthCare = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "alternative medicine",
        "ambulance services",
        "child day care services",
        "chiropractors",
        "community services",
        "dentists",
        "emergency and relief services",
        "family planning centers",
        "home health care services",
        "hospitals",
        "individual and family services",
        "medical and diagnostic laboratories",
        "medical practices",
        "mental health care",
        "nursing homes and residential care facilities",
        "optometrists",
        "outpatient care centers",
        "physical, occupational and speech therapists",
        "physicians",
        "services for the elderly and disabled",
        "vocational rehabilitation services",
      ],
    },
  ],
};

// size 7.1 million

const Manufacturing = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "abrasives and nonmetallic minerals manufacturing",
        "accessible hardware manufacturing",
        "agricultural chemical manufacturing",
        "agriculture, construction, mining machinery manufacturing",
        "alternative fuel vehicle manufacturing",
        "animal feed manufacturing",
        "apparel manufacturing",
        "appliances, electrical, and electronics manufacturing",
        "architectural and structural metal manufacturing",
        "artificial rubber and synthetic fiber manufacturing",
        "audio and video equipment manufacturing",
        "automation machinery manufacturing",
        "automotive",
        "aviation and aerospace component manufacturing",
        "baked goods manufacturing",
        "beverage manufacturing",
        "boilers, tanks, and shipping container manufacturing",
        "breweries",
        "chemical manufacturing",
        "chemical raw materials manufacturing",
        "clay and refractory products manufacturing",
        "climate technology product manufacturing",
        "commercial and service industry machinery manufacturing",
        "communications equipment manufacturing",
        "computer hardware manufacturing",
        "computers and electronics manufacturing",
        "construction hardware manufacturing",
        "cutlery and handtool manufacturing",
        "dairy product manufacturing",
        "defense & space",
        "defense and space manufacturing",
        "distilleries",
        "electric lighting equipment manufacturing",
        "electrical equipment manufacturing",
        "engines and power transmission equipment manufacturing",
        "fabricated metal products",
        "fashion accessories manufacturing",
        "food and beverage manufacturing",
        "footwear manufacturing",
        "fruit and vegetable preserves manufacturing",
        "fuel cell manufacturing",
        "furniture",
        "furniture and home furnishings manufacturing",
        "glass product manufacturing",
        "glass, ceramics and concrete manufacturing",
        "household and institutional furniture manufacturing",
        "household appliance manufacturing",
        "hvac and refrigeration equipment manufacturing",
        "industrial automation",
        "industrial machinery manufacturing",
        "leather product manufacturing",
        "lime and gypsum products manufacturing",
        "machinery manufacturing",
        "magnetic and optical media manufacturing",
        "mattress and blinds manufacturing",
        "measuring and control instrument manufacturing",
        "meat products manufacturing",
        "mechanical or industrial engineering",
        "medical equipment manufacturing",
        "metal treatments",
        "metal valve, ball, and roller manufacturing",
        "metalworking machinery manufacturing",
        "motor vehicle manufacturing",
        "motor vehicle parts manufacturing",
        "office furniture and fixtures manufacturing",
        "oil and coal product manufacturing",
        "packaging & containers",
        "packaging and containers manufacturing",
        "paint, coating, and adhesive manufacturing",
        "paper & forest products",
        "paper and forest product manufacturing",
        "personal care product manufacturing",
        "pharmaceutical manufacturing",
        "plastics and rubber product manufacturing",
        "plastics manufacturing",
        "primary metal manufacturing",
        "printing services",
        "railroad equipment manufacturing",
        "renewable energy equipment manufacturing",
        "renewable energy semiconductor manufacturing",
        "robot manufacturing",
        "rubber products manufacturing",
        "seafood product manufacturing",
        "semiconductor manufacturing",
        "semiconductors",
        "shipbuilding",
        "smart meter manufacturing",
        "soap and cleaning product manufacturing",
        "sporting goods manufacturing",
        "spring and wire product manufacturing",
        "sugar and confectionery product manufacturing",
        "textile manufacturing",
        "tobacco manufacturing",
        "transportation equipment manufacturing",
        "turned products and fastener manufacturing",
        "wineries",
        "women's handbag manufacturing",
        "wood product manufacturing",
      ],
    },
  ],
};

// size 7k only

const NonProfitOrganizations = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: ["philanthropy"],
    },
  ],
};

// size 800k

const OilGasAndMining = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "coal mining",
        "metal ore mining",
        "mining",
        "natural gas extraction",
        "nonmetallic mineral mining",
        "oil and gas",
        "oil extraction",
      ],
    },
  ],
};

//size 7.5 million

const ProfessionalServices = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "accessible architecture and design",
        "accounting",
        "advertising services",
        "alternative dispute resolution",
        "architecture and planning",
        "biotechnology research",
        "business consulting and services",
        "computer and network security",
        "design",
        "design services",
        "digital accessibility services",
        "engineering services",
        "environmental services",
        "government relations services",
        "graphic design",
        "human resources",
        "human resources services",
        "interior design",
        "it services and it consulting",
        "it system custom software development",
        "it system data services",
        "it system design services",
        "it system installation and disposal",
        "it system operations and maintenance",
        "it system testing and evaluation",
        "it system training and support",
        "law practice",
        "legal services",
        "market research",
        "marketing services",
        "nanotechnology research",
        "operations consulting",
        "outsourcing and offshoring consulting",
        "photography",
        "program development",
        "public relations and communications services",
        "regenerative design",
        "research services",
        "robotics engineering",
        "services for renewable energy",
        "strategic management services",
        "surveying and mapping services",
        "think tanks",
        "veterinary services",
      ],
    },
  ],
};

// size 1.8 million
const RealEstateAndEquipmentRentalServices = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "commercial and industrial equipment rental",
        "commercial real estate",
        "consumer goods rental",
        "equipment rental services",
        "leasing non-residential real estate",
        "leasing residential real estate",
        "real estate",
        "real estate agents and brokers",
      ],
    },
  ],
};

// size 820k

const Retail = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "apparel & fashion",
        "food and beverage retail",
        "luxury goods & jewelry",
        "online and mail order retail",
        "retail apparel and fashion",
        "retail appliances, electrical, and electronic equipment",
        "retail art dealers",
        "retail art supplies",
        "retail books and printed news",
        "retail building materials and garden equipment",
        "retail florists",
        "retail furniture and home furnishings",
        "retail gasoline",
        "retail groceries",
        "retail health and personal care products",
        "retail luxury goods and jewelry",
        "retail motor vehicles",
        "retail musical instruments",
        "retail office equipment",
        "retail office supplies and gifts",
        "retail pharmacies",
        "retail recyclable materials & used merchandise",
      ],
    },
  ],
};

// size 4.6 million

const TechnologyInformationAndMedia = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "animation and post-production",
        "blockchain services",
        "blogs",
        "book and periodical publishing",
        "book publishing",
        "broadcast media production and distribution",
        "business content",
        "business intelligence platforms",
        "cable and satellite programming",
        "climate data and analytics",
        "computer games",
        "computer hardware",
        "computer networking",
        "computer networking products",
        "data infrastructure and analytics",
        "data security software products",
        "desktop computing software products",
        "embedded software products",
        "information services",
        "information technology & services",
        "internet marketplace platforms",
        "internet news",
        "internet publishing",
        "libraries",
        "media and telecommunications",
        "media production",
        "mobile computing software products",
        "mobile gaming apps",
        "movies and sound recording",
        "newspaper publishing",
        "online audio and video media",
        "online media",
        "periodical publishing",
        "radio and television broadcasting",
        "satellite telecommunications",
        "sheet music publishing",
        "social networking platforms",
        "software development",
        "sound recording",
        "technology, information and internet",
        "telecommunications",
        "telecommunications carriers",
        "wireless services",
      ],
    },
  ],
};

//size 1.5 million

const TransportationLogisticsAndSupplyChain = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "airlines and aviation",
        "aviation & aerospace",
        "freight and package transportation",
        "ground passenger transportation",
        "interurban and rural bus services",
        "maritime",
        "maritime transportation",
        "outsourcing/offshoring",
        "pipeline transportation",
        "postal services",
        "rail transportation",
        "school and employee bus services",
        "shuttles and special needs transportation services",
        "sightseeing transportation",
        "taxi and limousine services",
        "transportation/trucking/railroad",
        "truck transportation",
        "urban transit services",
        "warehousing",
        "warehousing and storage",
      ],
    },
  ],
};

// size 92k only

const Utilities = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "biomass electric power generation",
        "electric power generation",
        "electric power transmission, control, and distribution",
        "fossil fuel electric power generation",
        "geothermal electric power generation",
        "hydroelectric power generation",
        "natural gas distribution",
        "nuclear electric power generation",
        "renewable energy power generation",
        "renewables & environment",
        "solar electric power generation",
        "steam and air-conditioning supply",
        "waste collection",
        "waste treatment and disposal",
        "water supply and irrigation systems",
        "water, waste, steam, and air conditioning services",
        "wind electric power generation",
      ],
    },
  ],
};

// size 355k

const Wholesale = {
  filters: [
    {
      field: "location_country",
      operator: "ANY_OF_VALUES",
      values: [selectedCountry],
    },
    {
      field: "job_company_industry",
      operator: "ANY_OF_VALUES",
      values: [
        "import & export",
        "wholesale alcoholic beverages",
        "wholesale apparel and sewing supplies",
        "wholesale appliances, electrical, and electronics",
        "wholesale building materials",
        "wholesale chemical and allied products",
        "wholesale computer equipment",
        "wholesale drugs and sundries",
        "wholesale food and beverage",
        "wholesale footwear",
        "wholesale furniture and home furnishings",
        "wholesale hardware, plumbing, heating equipment",
        "wholesale import and export",
        "wholesale luxury goods and jewelry",
        "wholesale machinery",
        "wholesale metals and minerals",
        "wholesale motor vehicles and parts",
        "wholesale paper products",
        "wholesale petroleum and petroleum products",
        "wholesale photography equipment and supplies",
        "wholesale raw farm products",
        "wholesale recyclable materials",
      ],
    },
  ],
};

module.exports = {
  AccomodationServices,
  AdministrativeAndSupportServices,
  Construction,
  ConsumerGoods,
  ConsumerServices,
  Education,
  EntertainmnetProviders,
  FarmingRanchingAndForestry,
  FinancialServices,
  FoodProduction,
  GovermentAdministration,
  HealthCare,
  hospitalsAndHealthCare,
  Manufacturing,
  NonProfitOrganizations,
  OilGasAndMining,
  ProfessionalServices,
  RealEstateAndEquipmentRentalServices,
  Retail,
  TechnologyInformationAndMedia,
  TransportationLogisticsAndSupplyChain,
  Utilities,
  Wholesale,
};
