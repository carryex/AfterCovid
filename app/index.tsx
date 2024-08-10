import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Position } from '../types';
import { GRID_SIZE, generateLandscape, generateSectorElements } from '../constants/generateLandscape';
import MiniMap from '@/components/World/MiniMap';


const DUNGEON_SIZE = 100;
const VISIBLE_RADIUS = 3;

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
        const newX = Math.min(Math.max(prevPosition.x + dx, 0), GRID_SIZE - 1);
        const newY = Math.min(Math.max(prevPosition.y + dy, 0), GRID_SIZE - 1);
        return { x: newX, y: newY };
      });
    } else if (gameState === GameState.Dungeon) {
      setDungeonPosition(prevPosition => {
        const newX = Math.min(Math.max(prevPosition.x + dx, 0), DUNGEON_SIZE - 1);
        const newY = Math.min(Math.max(prevPosition.y + dy, 0), DUNGEON_SIZE - 1);
        return { x: newX, y: newY };
      });
    }
  };

  const handleMineClick = () => {
    setGameState(GameState.Dungeon);
    setDungeonPosition({ x: 50, y: 50 });
  };

  const renderWorld = () => {
    const sectorElements = generateSectorElements(playerPosition.x, playerPosition.y);
    return (
      <View style={styles.sector}>
        {landscape[playerPosition.y][playerPosition.x].type === 'grass' && (
          <View style={styles.grass} />
        )}
        {sectorElements.map((element) => {
          if (element.type === 'mine') {
            return (
              <TouchableOpacity
                key={element.id}
                style={[
                  styles.mine,
                  {
                    position: 'absolute',
                    top: element.y,
                    left: element.x,
                    width: element.width,
                    height: element.height,
                  },
                ]}
                onPress={handleMineClick}
              >
                <Text style={styles.mineText}>Mine</Text>
              </TouchableOpacity>
            );
          }
          return null;
        })}
      </View>
    );
  };

  const renderDungeon = () => {
    const visibleRooms = [];
    for (let y = dungeonPosition.y - VISIBLE_RADIUS; y <= dungeonPosition.y + VISIBLE_RADIUS; y++) {
      for (let x = dungeonPosition.x - VISIBLE_RADIUS; x <= dungeonPosition.x + VISIBLE_RADIUS; x++) {
        if (x >= 0 && y >= 0 && x < DUNGEON_SIZE && y < DUNGEON_SIZE) {
          visibleRooms.push(
            <TouchableOpacity
              key={`${x}-${y}`}
              style={[
                styles.dungeonRoom,
                {
                  backgroundColor: x === dungeonPosition.x && y === dungeonPosition.y ? 'blue' : 'gray',
                  top: `${(y - (dungeonPosition.y - VISIBLE_RADIUS)) * (100 / (VISIBLE_RADIUS * 2 + 1))}%`,
                  left: `${(x - (dungeonPosition.x - VISIBLE_RADIUS)) * (100 / (VISIBLE_RADIUS * 2 + 1))}%`,
                },
              ]}
              onPress={() => movePlayer(x - dungeonPosition.x, y - dungeonPosition.y)}
            >
              <Text style={styles.roomText}>{`${x},${y}`}</Text>
            </TouchableOpacity>
          );
        }
      }
    }
    return <View style={styles.dungeonMap}>{visibleRooms}</View>;
  };

  return (
    <View style={styles.container}>
      {gameState === GameState.World ? (
        <>
          <Text>Player Position: ({playerPosition.x}, {playerPosition.y})</Text>
          <View style={[styles.landscapeContainer, { width: screenSize, height: screenSize }]}>
            {renderWorld()}
          </View>
          <MiniMap playerPosition={playerPosition} movePlayer={movePlayer} />
        </>
      ) : (
        <>
          <Text>Dungeon Position: ({dungeonPosition.x}, {dungeonPosition.y})</Text>
          <View style={[styles.landscapeContainer, { width: screenSize, height: screenSize }]}>
            {renderDungeon()}
          </View>
        </>
      )}
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
  sector: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  grass: {
    width: '100%',
    height: '100%',
    backgroundColor: 'green',
  },
  mine: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'brown',
  },
  mineText: {
    color: '#fff',
    fontSize: 12,
  },
  dungeonMap: {
    flex: 1,
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#000',
  },
  dungeonRoom: {
    position: 'absolute',
    width: `${100 / (VISIBLE_RADIUS * 2 + 1)}%`,
    height: `${100 / (VISIBLE_RADIUS * 2 + 1)}%`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  roomText: {
    color: '#fff',
    fontSize: 10,
  },
});
