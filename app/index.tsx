import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Position } from '../types';
import { generateLandscape, GRID_SIZE } from '../constants/generateLandscape';
import Dungeon from '@/components/Dungeon/Dungeon';
import MiniMap from '@/components/World/MiniMap';
import World from '@/components/World/World';
import dungeonsConfig from '@/constants/dungeonsConfig';


const getScreenSize = () => {
  const { width, height } = Dimensions.get('window');
  const size = Math.min(width, height) * 0.8;
  return size;
};

enum GameState {
  World,
  Dungeon
}

export default function Index() {
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) });
  const [gameState, setGameState] = useState<GameState>(GameState.World);
  const [landscape, setLandscape] = useState(generateLandscape());
  const [currentDungeon, setCurrentDungeon] = useState<null | typeof dungeonsConfig[0]>(null);
  const [dungeonPosition, setDungeonPosition] = useState<Position>({ x: 50, y: 50 });
  const [screenSize, setScreenSize] = useState(getScreenSize());

  useEffect(() => {
    const handleResize = () => setScreenSize(getScreenSize());
    const subscription = Dimensions.addEventListener('change', handleResize);
    return () => subscription?.remove();
  }, []);

  const movePlayer = (dx: number, dy: number) => {
    if (gameState === GameState.World) {
      setPlayerPosition(prevPosition => {
        const newX = prevPosition.x + dx;
        const newY = prevPosition.y + dy;
        return { x: Math.min(Math.max(newX, 0), GRID_SIZE - 1), y: Math.min(Math.max(newY, 0), GRID_SIZE - 1) };
      });
    } else if (gameState === GameState.Dungeon && currentDungeon) {
      setDungeonPosition(prevPosition => {
        const newX = prevPosition.x + dx;
        const newY = prevPosition.y + dy;
        return { x: Math.min(Math.max(newX, 0), currentDungeon.size - 1), y: Math.min(Math.max(newY, 0), currentDungeon.size - 1) };
      });
    }
  };

  const handleMineClick = () => {
    setGameState(GameState.Dungeon);

    if (playerPosition.x === 50 && playerPosition.y === 51) {
      // Генерация случайного подземелья
      setCurrentDungeon({
        name: 'Generated Dungeon',
        size: 100,
        walls: new Set(), // Без стен для случайного подземелья
        startRoom: { x: 50, y: 50 },
        exitRoom: { x: 50, y: 50 }, // Выход там же, где вход
        surfaceLocation: { x: 50, y: 51 }, // Возвращение на поверхность в ту же точку
      });
      setDungeonPosition({ x: 50, y: 50 });
    } else {
      // Поиск подземелья по точным координатам
      const selectedDungeon = dungeonsConfig.find(
        dungeon => dungeon.surfaceLocation.x === playerPosition.x && dungeon.surfaceLocation.y === playerPosition.y
      );

      if (selectedDungeon) {
        setCurrentDungeon(selectedDungeon);
        setDungeonPosition(selectedDungeon.startRoom);
      } else {
        console.warn('No dungeon found at this location');
      }
    }
  };

  const exitDungeon = () => {
    if (currentDungeon) {
      setPlayerPosition(currentDungeon.surfaceLocation);
      setGameState(GameState.World);
      setCurrentDungeon(null); // Сбрасываем текущее подземелье
    }
  };

  return (
    <View style={styles.container}>
      {gameState === GameState.World ? (
        <>
          <Text>Player Position: ({playerPosition.x}, {playerPosition.y})</Text>
          <View style={[styles.landscapeContainer, { width: screenSize, height: screenSize }]}>
            <World playerPosition={playerPosition} onMineClick={handleMineClick} />
          </View>
          <MiniMap playerPosition={playerPosition} movePlayer={movePlayer} />
        </>
      ) : currentDungeon ? (
        <>
          <Text>Dungeon: {currentDungeon.name}</Text>
          <Text>Dungeon Position: ({dungeonPosition.x}, {dungeonPosition.y})</Text>
          <View style={[styles.landscapeContainer, { width: screenSize, height: screenSize }]}>
            <Dungeon
              dungeonConfig={currentDungeon}
              dungeonPosition={dungeonPosition}
              movePlayer={movePlayer}
              exitDungeon={exitDungeon}
            />
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  landscapeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
  },
});