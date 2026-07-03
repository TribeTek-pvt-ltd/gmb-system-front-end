export type CoveringType =
  | "Roller Blinds" | "Curtain" | "Sheer" | "Roman Blind"
  | "Venetian" | "Plantation Shutter" | "No Covering" | "Other";

export interface CoveringRow {
  id: string;
  coveringType: CoveringType;
  opacity: string;
  qty: number;
  spec: string;
  // Specification
  sp1: string; sp2: string; sp3: string;
  // Control
  c1: string; c2: string; c3: string; c4: string;
  // Mounting Point
  m1: string; m3: string; m4: string; surface: string;
  // Components
  com1: string; brackets: string;
  // In Frame
  inWidth: number; inDrop: number;
  // Out Frame
  outWidth: number; outDrop: number;
  addL: number; addR: number; endToEnd: number;
  // Position
  above: string; uc: string; ceil: string; floor: string;
  // Notes
  productNote: string; productionNote: string; installNote: string;
  quotationNote: string; quotationSent: boolean; quotationChanged: boolean;
}

export interface WindowLocation {
  id: number;
  locationName: string;
  coverings: CoveringRow[];
}

export interface ClientInfo {
  customerType?: "New" | "Old";
  clientName: string;
  clientAddress: string;
  email: string;
  contactNumber: string;
  customer: string;
  jobId: string;
  depositPaid: boolean;
  date: string;
  parkingFlexibility: string;
  findUs: string;
  pets: string;
  explainProduct: string;
  clientUnderstandsLevel: string;
  customerOrigin: string;
  colourTheme: string;
  fabricSelection: string;
  componentsSelection: string;
  changesToGetDeposit: string;
  houseType: string;
  existingCovering: string;
  clearances: string;
  damageHoles: string;
  installationTimeframe: string;
  jobType: string;
  jobHardness: string;
  numberOfInstallers: string;
  measurementsNote: string;
  measuredOrder: string;
  windowsStats: string;
  floorStates: string;
  checkMeasurements: string;
  installationNote: string;
  productNote: string;
  photos: string;
  dateTime: string;
}
