import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

const GRID_SIZE = 100;

export default function Index() {
  const [playerPosition, setPlayerPosition] = useState({ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) });

  const movePlayer = (dx: number, dy: number) => {
    setPlayerPosition(prevPosition => {
      const newX = Math.min(Math.max(prevPosition.x + dx, 0), GRID_SIZE - 1);
      const newY = Math.min(Math.max(prevPosition.y + dy, 0), GRID_SIZE - 1);
      return { x: newX, y: newY };
    });
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
      <Text>Player Position: ({playerPosition.x}, {playerPosition.y})</Text>
      {renderMiniMap()}
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
  miniMap: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 152,
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
