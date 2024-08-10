import { Position } from '../types';

export const GRID_SIZE = 100;

export const MINE_POSITION: Position = { x: 50, y: 51 };

export const generateLandscape = () => {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({ type: 'grass' }))
  );
};

export const generateSectorElements = (x: number, y: number) => {
  if (x === MINE_POSITION.x && y === MINE_POSITION.y) {
    return [{ type: 'mine', id: 1, x: 40, y: 40, width: 30, height: 30 }];
  }
  return [];
};
