export const DEMO_USER = {
  id: 1,
  name: "Admin",
  email: "admin@print.com",
  role: "admin",
};

export const INITIAL_CUSTOMERS = [
  {
    id: 1,
    name: "Raj Printing Works",
    phone: "+91 98765 43210",
    email: "raj@printing.com",
    address: "Plot 21, Industrial Area, Mumbai",
  },
  {
    id: 2,
    name: "Shree Offset Press",
    phone: "+91 91234 56789",
    email: "shree@offset.com",
    address: "Ring Road, Ahmedabad",
  },
  {
    id: 3,
    name: "Kumar Graphics",
    phone: "+91 99887 77665",
    email: "kumar@graphics.com",
    address: "MG Road, Bengaluru",
  },
  // extra dummy entries (10–15 total)
  { id: 4, name: "Metro Print Hub", phone: "+91 98111 11111", email: "metro@print.com", address: "Pune" },
  { id: 5, name: "Violet Press Co.", phone: "+91 98222 22222", email: "violet@press.com", address: "Delhi" },
  { id: 6, name: "Cyan Ink Studio", phone: "+91 98333 33333", email: "cyan@ink.com", address: "Jaipur" },
  { id: 7, name: "Classic Letterpress", phone: "+91 98444 44444", email: "classic@letter.com", address: "Surat" },
  { id: 8, name: "Prime Packaging Prints", phone: "+91 98555 55555", email: "prime@pack.com", address: "Indore" },
  { id: 9, name: "Rapid Flyers", phone: "+91 98666 66666", email: "rapid@flyers.com", address: "Lucknow" },
  { id: 10, name: "Nexa Prints", phone: "+91 98777 77777", email: "nexa@prints.com", address: "Kolkata" },
  { id: 11, name: "Orbit Brochures", phone: "+91 98888 88888", email: "orbit@brochures.com", address: "Chennai" },
  { id: 12, name: "Spark Visiting Cards", phone: "+91 98999 99999", email: "spark@cards.com", address: "Nagpur" },
];

export const INITIAL_PRICING = {
  gsmRates: [
    { gsm: 80, paper_rate_per_sqm: 5 },
    { gsm: 100, paper_rate_per_sqm: 6 },
    { gsm: 120, paper_rate_per_sqm: 7.5 },
    { gsm: 250, paper_rate_per_sqm: 12 },
  ],
  printRates: {
    bw: 1,
    color: 3,
  },
  wastage_pct: 5,
  profit_pct: 15,
};

export const INITIAL_FINISHING = [
  { id: 1, name: "Binding", rate: 50 },
  { id: 2, name: "Lamination", rate: 30 },
  { id: 3, name: "Cutting", rate: 15 },
  { id: 4, name: "UV Coating", rate: 70 },
];

export const JOB_TYPES = ["Visiting Cards", "Posters", "Brochures"];

