
export interface CreativeFile {
  id: string;
  file: File;
  preview: string;
  width?: number;
  height?: number;
  clickUrl: string;
  impressionUrl1: string;
  impressionUrl2: string;
}

export interface GeneratedTest {
  id: string;
  name: string;
  timestamp: number;
  creativeCount: number;
  author: string;
  previewUrl: string;
  creatives: CreativeFile[];
}
