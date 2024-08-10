// constants/dungeonsConfig.ts
interface DungeonConfig {
  name: string;
  size: number;
  walls: Set<string>;
  startRoom: { x: number, y: number };
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
  },
  {
    name: 'Cavern of Shadows',
    size: 30,
    walls: createWalls([[5, 5], [6, 5], [5, 6], [15, 15], [29, 29], [28, 29]]),
    startRoom: { x: 2, y: 2 },
  },
  // Добавляем ещё 6 подземелий с разными конфигурациями
  {
    name: 'Labyrinth of the Lost',
    size: 40,
    walls: createWalls([[10, 10], [10, 11], [11, 10], [30, 30], [39, 39]]),
    startRoom: { x: 5, y: 5 },
  },
  {
    name: 'Crypt of the Forgotten',
    size: 25,
    walls: createWalls([[12, 12], [12, 13], [13, 12], [15, 15]]),
    startRoom: { x: 3, y: 3 },
  },
  {
    name: 'Maze of Madness',
    size: 50,
    walls: createWalls([[20, 20], [21, 20], [20, 21], [40, 40], [49, 49]]),
    startRoom: { x: 10, y: 10 },
  },
  {
    name: 'Pit of Despair',
    size: 35,
    walls: createWalls([[5, 5], [5, 6], [6, 5], [34, 34]]),
    startRoom: { x: 4, y: 4 },
  },
  {
    name: 'Catacombs of Chaos',
    size: 45,
    walls: createWalls([[22, 22], [23, 22], [22, 23], [44, 44]]),
    startRoom: { x: 7, y: 7 },
  },
  {
    name: 'Den of Darkness',
    size: 60,
    walls: createWalls([[30, 30], [31, 30], [30, 31], [59, 59]]),
    startRoom: { x: 15, y: 15 },
  },
];

export default dungeonsConfig;
