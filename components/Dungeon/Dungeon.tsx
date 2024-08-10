// components/Dungeon.tsx
import { Position } from '@/types';
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';


interface DungeonProps {
  dungeonConfig: {
    name: string;
    size: number;
    walls: Set<string>;
    startRoom: { x: number, y: number };
  };
  dungeonPosition: Position;
  movePlayer: (dx: number, dy: number) => void;
}

const VISIBLE_RADIUS = 3;

const Dungeon: React.FC<DungeonProps> = ({ dungeonConfig, dungeonPosition, movePlayer }) => {
  const { size, walls } = dungeonConfig;

  const isAdjacent = (x: number, y: number) => {
    const dx = Math.abs(x - dungeonPosition.x);
    const dy = Math.abs(y - dungeonPosition.y);
    return dx <= 1 && dy <= 1;
  };

  const isWall = (x: number, y: number) => walls.has(`${x},${y}`);

  const renderDungeon = () => {
    const visibleRooms = [];
    for (let y = dungeonPosition.y - VISIBLE_RADIUS; y <= dungeonPosition.y + VISIBLE_RADIUS; y++) {
      for (let x = dungeonPosition.x - VISIBLE_RADIUS; x <= dungeonPosition.x + VISIBLE_RADIUS; x++) {
        if (x >= 0 && y >= 0 && x < size && y < size) {
          const isCurrent = x === dungeonPosition.x && y === dungeonPosition.y;
          const canMove = isAdjacent(x, y) && !isWall(x, y);
          if (isWall(x, y)) {
            visibleRooms.push(
              <View
                key={`${x}-${y}`}
                style={[
                  styles.dungeonRoom,
                  styles.wall,
                  {
                    top: `${(y - (dungeonPosition.y - VISIBLE_RADIUS)) * (100 / (VISIBLE_RADIUS * 2 + 1))}%`,
                    left: `${(x - (dungeonPosition.x - VISIBLE_RADIUS)) * (100 / (VISIBLE_RADIUS * 2 + 1))}%`,
                  },
                ]}
              />
            );
          } else {
            visibleRooms.push(
              <TouchableOpacity
                key={`${x}-${y}`}
                style={[
                  styles.dungeonRoom,
                  {
                    backgroundColor: isCurrent ? 'blue' : canMove ? 'darkgray' : 'gray',
                    top: `${(y - (dungeonPosition.y - VISIBLE_RADIUS)) * (100 / (VISIBLE_RADIUS * 2 + 1))}%`,
                    left: `${(x - (dungeonPosition.x - VISIBLE_RADIUS)) * (100 / (VISIBLE_RADIUS * 2 + 1))}%`,
                    opacity: canMove ? 1 : 0.5,
                  },
                ]}
                onPress={() => canMove && movePlayer(x - dungeonPosition.x, y - dungeonPosition.y)}
                disabled={!canMove}
              >
                <Text style={styles.roomText}>{`${x},${y}`}</Text>
              </TouchableOpacity>
            );
          }
        }
      }
    }
    return <View style={styles.dungeonMap}>{visibleRooms}</View>;
  };

  return renderDungeon();
};

const styles = StyleSheet.create({
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
  wall: {
    backgroundColor: '#222', // Цвет стен совпадает с цветом границ
  },
  roomText: {
    color: '#fff',
    fontSize: 10,
  },
});

export default Dungeon;
