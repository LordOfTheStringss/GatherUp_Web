export interface Point {
  lat: number;
  lng: number;
  intensity: number;
}

export class HeatmapData {
  points: Point[];
  generatedAt: Date;

  constructor(points: Point[], generatedAt: Date) {
    this.points = points;
    this.generatedAt = generatedAt;
  }
}
