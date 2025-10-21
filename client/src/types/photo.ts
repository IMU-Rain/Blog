interface PhotoType {
  _id: string;
  camera: {
    make: string;
    model: string;
    iso: number;
    focalLength: number;
    shutterSpeed: number;
  };
  width: number;
  height: number;
  shotTime: string;
  filename: string;
  album: string;
  tags: string[];
  originalName: string;
  path: string;
  size: number;
  mimetype: string;
  description: string;
  isPublic: boolean;
  thumbnailPath: string;
  updateAt: string; // ISO 时间字符串
  __v: number;
  thumbnailUrl: string;
  url: string;
}
export type { PhotoType };
