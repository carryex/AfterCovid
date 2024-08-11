// types.ts
export interface Position {
  x: number;
  y: number;
}
export interface PlayerStats {
  level: number;
  strength: number;
  agility: number;
  intuition: number;
  endurance: number;
  accuracy: number;
  intelligence: number;
  health: number;
  mana: number;
  currentWeight: number; // Текущий вес снаряжения
}