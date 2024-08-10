// components/World.tsx
import { generateSectorElements } from '@/constants/generateLandscape';
import { Position } from '@/types';
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';


interface WorldProps {
  playerPosition: Position;
  onMineClick: () => void;
}

const World: React.FC<WorldProps> = ({ playerPosition, onMineClick }) => {
  const renderWorld = () => {
    const sectorElements = generateSectorElements(playerPosition.x, playerPosition.y);
    return (
      <View style={styles.sector}>
        <View style={styles.grass} />
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
                onPress={onMineClick}
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

  return renderWorld();
};

const styles = StyleSheet.create({
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
});

export default World;
