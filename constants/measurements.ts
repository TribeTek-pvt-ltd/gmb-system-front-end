import { CoveringRow, CoveringType, WindowLocation } from "../types/measurements";

export const coveringTypes: CoveringType[] = [
  "Roller Blinds", "Curtain", "Sheer", "Roman Blind",
  "Venetian", "Plantation Shutter", "No Covering", "Other",
];

export const opacityOptions = ["Blackout", "Dim-Out", "Light-Filter", "See-Through", "Translucent", "N/A"];
export const sp1Options = ["Front Roll", "Back Roll", "Wave", "Pinch Pleat", "Eyelet", "Slats89Mm", "N/A"];
export const sp2Options = ["Rolling Up & Down", "Hinged", "Fixed", "N/A"];
export const sp3Options = ["stainless Chain", "By Wand", "By Hand", "Motorised", "Cord", "N/A"];
export const c4Options = ["bottom rail Ovel", "bottom rail Square", "direct mount window frame", "N/A"];
export const m1Options = ["window", "wall to wall", "N/A"];
export const m3Options = ["under cornise to floor", "floor to ceiling", "window", "N/A"];
export const m4Options = ["Under Cornice", "Ceiling", "In Frame", "Out Frame", "N/A"];
export const surfaceOptions = ["on plaster", "on timber / MDF", "on brick", "on concrete", "N/A"];
export const bracketOptions = [
  "Single standard BKT", "Extra double BKT", "Single face fix BKT",
  "Ceiling top fix BKT", "GMB STD track", "N/A",
];
export const com1ColorOptions = ["White", "Charcoal", "Black", "Cream", "Grey", "N/A"];
export const houseTypeOptions = [
  "House", "Townhouse", "Apartment", "Unit", "Villa", "Commercial", "Other"
];
export const jobTypeOptions = [
  "New Installation", "Replacement", "Repair", "Consultation", "Measure Only"
];
export const jobHardnessOptions = ["Easy", "Standard", "Complex", "Very Complex"];
export const measuredOrderOptions = ["Room by Room", "floor by floor", "Front to Back", "Other"];
export const floorOptions = ["Ground", "1st Floor", "2nd Floor", "Multi Level", "N/A"];
export const installersOptions = ["1", "2", "3", "4+"];

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const newCovering = (): CoveringRow => ({
  id: uid(), coveringType: "Roller Blinds", opacity: "Blackout", qty: 1,
  spec: "", sp1: "Front Roll", sp2: "Rolling Up & Down", sp3: "stainless Chain",
  c1: "", c2: "", c3: "", c4: "bottom rail Ovel",
  m1: "window", m3: "window", m4: "In Frame", surface: "on timber / MDF",
  com1: "White", brackets: "Single standard BKT",
  inWidth: 0, inDrop: 0, outWidth: 0, outDrop: 0,
  addL: 0, addR: 0, endToEnd: 0,
  above: "", uc: "", ceil: "", floor: "",
  productNote: "", productionNote: "", installNote: "",
  quotationNote: "", quotationSent: false, quotationChanged: false,
});

export const newLocation = (id: number): WindowLocation => ({
  id, locationName: "", coverings: [newCovering()],
});
