export interface Neighbourhood {
  id: number;
  name: string;
  description: string;
  vibeSummary: string;
  rentMin: number;
  rentMax: number;
  commuteNote: string;
  tags: string[];
  imageFilename: string;
  lat: number;
  lng: number;
  landmarks: string[];
  transportOptions: string[];
}
