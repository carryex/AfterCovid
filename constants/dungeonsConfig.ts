// constants/dungeonsConfig.ts
import { Position } from "@/types";

interface DungeonConfig {
  name: string;
  size: number;
  walls: Set<string>;
  startRoom: { x: number, y: number };
  exitRoom: { x: number, y: number };
  surfaceLocation: Position;
}

const createWalls = (positions: Array<[number, number]>): Set<string> => {
  return new Set(positions.map(pos => `${pos[0]},${pos[1]}`));
};
const dungeonsConfig: DungeonConfig[] = [
  {
    name: 'Dungeon of Trials',
    size: 20,
    walls: createWalls([[1, 1], [1, 2], [1, 3], [2, 1], [3, 1], [5, 5], [10, 10], [19, 19]]),
    startRoom: { x: 0, y: 0 },
    exitRoom: { x: 0, y: 0 },  // Выход там же, где вход
    surfaceLocation: { x: 50, y: 50 },
  },
  {
    name: 'Cavern of Shadows',
    size: 30,
    walls: createWalls([[5, 5], [6, 5], [5, 6], [15, 15], [29, 29], [28, 29]]),
    startRoom: { x: 2, y: 2 },
    exitRoom: { x: 2, y: 2 },  // Выход там же, где вход
    surfaceLocation: { x: 51, y: 51 },
  },
];

export default dungeonsConfig;
