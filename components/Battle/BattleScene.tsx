// components/Battle/BattleScene.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { Position } from '@/types';

interface BattleSceneProps {
  onExitBattle: () => void;
}

const GRID_SIZE = 10; // Размер сетки 10x10
const HEX_SIZE = 40; // Размер стороны шестиугольника

// Функция для создания шестиугольника с равными сторонами
const createHexagonPoints = (size: number) => {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i; // Угол 60 градусов для каждой точки
    const x = size * Math.cos(angle);
    const y = size * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return points.join(' ');
};

const BattleScene: React.FC<BattleSceneProps> = ({ onExitBattle }) => {
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 0, y: 0 });

  const movePlayer = (dx: number, dy: number) => {
    setPlayerPosition(prevPosition => {
      const newX = Math.max(0, Math.min(GRID_SIZE - 1, prevPosition.x + dx));
      const newY = Math.max(0, Math.min(GRID_SIZE - 1, prevPosition.y + dy));
      return { x: newX, y: newY };
    });
  };

  const renderHexagon = (x: number, y: number) => {
    const isPlayer = playerPosition.x === x && playerPosition.y === y;
    const color = isPlayer ? 'blue' : 'gray';
    const points = createHexagonPoints(HEX_SIZE);

    const xOffset = x * HEX_SIZE * 1.5;
    const yOffset = y * HEX_SIZE * Math.sqrt(3) + (x % 2) * (HEX_SIZE * Math.sqrt(3) / 2);

    return (
      <TouchableOpacity
        key={`${x}-${y}`}
        style={{
          position: 'absolute',
          left: xOffset,
          top: yOffset,
          width: HEX_SIZE * 2,
          height: HEX_SIZE * Math.sqrt(3),
        }}
        onPress={() => movePlayer(x - playerPosition.x, y - playerPosition.y)}
      >
        <Svg
          height={HEX_SIZE * Math.sqrt(3)}
          width={HEX_SIZE * 2}
          viewBox={`-${HEX_SIZE} -${HEX_SIZE * Math.sqrt(3) / 2} ${HEX_SIZE * 2} ${HEX_SIZE * Math.sqrt(3)}`}
        >
          <Polygon
            points={points}
            fill={color}
            stroke="black"
            strokeWidth={1} // Регулировка толщины линии
          />
        </Svg>
        <Text style={styles.hexagonText}>{`${x},${y}`}</Text>
      </TouchableOpacity>
    );
  };

  const renderGrid = () => {
    const hexagons = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        hexagons.push(renderHexagon(x, y));
      }
    }
    return hexagons;
  };

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>{renderGrid()}</View>
      <TouchableOpacity onPress={onExitBattle} style={styles.exitButton}>
        <Text style={styles.exitButtonText}>Exit Battle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gridContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  hexagonText: {
    color: '#fff',
    fontSize: 10,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  exitButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    zIndex: 1000,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BattleScene;
