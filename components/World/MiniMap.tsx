import { Position } from '@/types';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface MiniMapProps {
  playerPosition: Position;
  movePlayer: (dx: number, dy: number) => void;
}

const MiniMap: React.FC<MiniMapProps> = ({ playerPosition, movePlayer }) => {
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

  return renderMiniMap();
};

const styles = StyleSheet.create({
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
});

export default MiniMap;
