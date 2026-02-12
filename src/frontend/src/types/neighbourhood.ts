export interface Neighbourhood {
  id: number;
  name: string;
  description: string;
  rentMin: number;
  rentMax: number;
  commuteNote: string;
  tags: string[];
  imageFilename: string;
}
