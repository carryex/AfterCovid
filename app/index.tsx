// app/index.tsx
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Position } from '../types';
import { generateLandscape, GRID_SIZE } from '../constants/generateLandscape';
import Dungeon from '@/components/Dungeon/Dungeon';
import MiniMap from '@/components/World/MiniMap';
import World from '@/components/World/World';
import BattleScene from '@/components/Battle/BattleScene';
import { dungeonsConfig } from '@/constants/dungeonsConfig';


const getScreenSize = () => {
  const { width, height } = Dimensions.get('window');
  const size = Math.min(width, height) * 0.8;
  return size;
};

enum GameState {
  World,
  Dungeon,
  Battle
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
        const newPosition = { x: Math.min(Math.max(newX, 0), currentDungeon.size - 1), y: Math.min(Math.max(newY, 0), currentDungeon.size - 1) };

        if (!currentDungeon.safeRooms.has(`${newPosition.x},${newPosition.y}`)) {
          setGameState(GameState.Battle);
        }

        return newPosition;
      });
    }
  };

  const handleMineClick = () => {
    setGameState(GameState.Dungeon);

    const selectedDungeon = dungeonsConfig.find(
      dungeon => dungeon.surfaceLocation.x === playerPosition.x && dungeon.surfaceLocation.y === playerPosition.y
    );

    if (selectedDungeon) {
      setCurrentDungeon(selectedDungeon);
      setDungeonPosition(selectedDungeon.startRoom);
    } else {
      console.warn('No dungeon found at this location');
    }
  };

  const exitDungeon = () => {
    if (currentDungeon) {
      setPlayerPosition(currentDungeon.surfaceLocation);
      setGameState(GameState.World);
      setCurrentDungeon(null); // Сбрасываем текущее подземелье
    }
  };

  const exitBattle = () => {
    setGameState(GameState.Dungeon);
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
      ) : gameState === GameState.Dungeon && currentDungeon ? (
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
      ) : gameState === GameState.Battle ? (
        <BattleScene onExitBattle={exitBattle} />
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
