// constants/generateLandscape.ts
import { Position } from '../types';

export const GRID_SIZE = 100;

// Добавляем массив с позициями подземелий
export const DUNGEON_POSITIONS: Position[] = [
  { x: 50, y: 51 }, // Генерируемое подземелье
  { x: 50, y: 50 }, // Предустановленное подземелье 1
  { x: 51, y: 51 }, // Предустановленное подземелье 2
];

export const generateLandscape = () => {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({ type: 'grass' }))
  );
};

// Обновляем логику генерации элементов сектора для учета новых подземелий
export const generateSectorElements = (x: number, y: number) => {
  const dungeon = DUNGEON_POSITIONS.find(d => d.x === x && d.y === y);
  if (dungeon) {
    return [{ type: 'mine', id: `${x},${y}`, x: 40, y: 40, width: 30, height: 30 }];
  }
  return [];
};
