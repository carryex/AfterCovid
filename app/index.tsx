import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Position } from '../types';
import { GRID_SIZE, MINE_POSITION, generateLandscape, generateSectorElements } from '../constants/generateLandscape';

const DUNGEON_SIZE = 100;
const VISIBLE_RADIUS = 3;  // Уменьшили радиус видимости до 3 клеток

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
  const [dungeonPosition, setDungeonPosition] = useState<Position>({ x: 50, y: 50 }); // Начальная позиция в подземелье
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
    setDungeonPosition({ x: 50, y: 50 }); // Перемещение игрока в начальную точку подземелья
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

  const renderMiniMap = () => {
    const segments = [];
    for (let y = playerPosition.y - 1; y <= playerPosition.y + 1; y++) {
      for (let x = playerPosition.x - 1; x <= playerPosition.x + 1; x++) {
        segments.push(
          <TouchableOpacity
            key={`${x},${y}`}
            style={[styles.mapSegment, { backgroundColor: x === playerPosition.x && y === playerPosition.y ? 'blue' : 'lightgrey' }]}
            onPress={() => movePlayer(x - playerPosition.x, y - playerPosition.y)}
          >
            <Text style={styles.segmentText}>{`${x},${y}`}</Text>
          </TouchableOpacity>
        );
      }
    }
    return <View style={styles.miniMap}>{segments}</View>;
  };

  return (
    <View style={styles.container}>
      {gameState === GameState.World ? (
        <>
          <Text>Player Position: ({playerPosition.x}, {playerPosition.y})</Text>
          <View style={[styles.landscapeContainer, { width: screenSize, height: screenSize }]}>
            {renderWorld()}
          </View>
          {renderMiniMap()}
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
  miniMap: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 152,
    height: 152,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: '#000',
  },
  mapSegment: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  segmentText: {
    fontSize: 10,
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
    flex: 1, // Занимает все доступное пространство
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#000',
  },
  dungeonRoom: {
    position: 'absolute',
    width: `${100 / (VISIBLE_RADIUS * 2 + 1)}%`, // Рассчитывает размер каждой комнаты относительно контейнера
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
