// utils/calculateMovement.ts

import { Position } from "@/types";

// Функция для конвертации осевых координат в кубические
export const axialToCube = (q: number, r: number) => {
  const x = q;
  const z = r;
  const y = -x - z;
  return { x, y, z };
};

// Функция для расчета расстояния между двумя кубическими координатами
export const cubeDistance = (a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }): number => {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z));
};

// Функция для расчета расстояния между двумя осевыми координатами
export const axialDistance = (a: Position, b: Position): number => {
  const ac = axialToCube(a.x, a.y);
  const bc = axialToCube(b.x, b.y);
  return cubeDistance(ac, bc);
};

// Функция для получения доступных гексов
export const getReachableHexes = (playerPosition: Position, maxSteps: number, totalRows: number, totalCols: number): Position[] => {
  const reachableHexes: Position[] = [];
  for (let y = 0; y < totalRows; y++) {
    for (let x = 0; x < totalCols; x++) {
      const distance = axialDistance(playerPosition, { x, y });
      if (distance <= maxSteps) {
        reachableHexes.push({ x, y });
      }
    }
  }
  return reachableHexes;
};

export const maxStepsForAP = (availableAP: number): number => {
  let steps = 0;
  let cost = 0;
  while (cost + Math.pow(2, steps) <= availableAP) {
    cost += Math.pow(2, steps);
    steps += 1;
  }
  return steps;
};


export const calculateMovementCost = (steps: number): number => {
  let cost = 0;
  for (let i = 1; i <= steps; i++) {
    cost += Math.pow(2, i - 1); // Нелинейная стоимость движения
  }
  return cost;
};
