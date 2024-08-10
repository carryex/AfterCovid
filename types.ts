// types.ts
export interface Position {
  x: number;
  y: number;
}

export interface Element {
  type: string;
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}
