// In types/case.ts

export interface Case {
  _id: string; // MongoDB ID
  Case_Number: string;
  Police_Station: string;
  District: string;
  Investigating_Officer: string;
  Rank: string;
  Accused_Name: string;
  Sections_of_Law: string;
  Crime_Type: string;
  Court_Name: string;
  Date_of_Registration: string;
  Date_of_Chargesheet: string;
  Date_of_Judgement: string;
  Duration_of_Trial_days: number;
  Result: "Conviction" | "Acquitted" | string; // Allow other strings
  Nature_of_Offence: string;
  // Add any other fields that come from the backend
}
