// components/Battle/BattleScene.tsx
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Dimensions, ScrollView, Button } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { Position, PlayerStats } from '@/types';
import { calculateActionPoints, calculateCarryingCapacity } from '@/utils/calculateStats';
import { axialDistance, calculateMovementCost, getReachableHexes, maxStepsForAP } from '@/utils/calculateMovement';

interface BattleSceneProps {
  onExitBattle: () => void;
}

const TOTAL_ROWS = 50;
const TOTAL_COLS = 100;
const HEX_SIZE = 40;
const TURN_DURATION = 30;

const createHexagonPoints = (size: number) => {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x = size * Math.cos(angle);
    const y = size * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return points.join(' ');
};

const BattleScene: React.FC<BattleSceneProps> = ({ onExitBattle }) => {
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [selectedHex, setSelectedHex] = useState<Position | null>(null);
  const [turnTimer, setTurnTimer] = useState(TURN_DURATION);
  const [turnCount, setTurnCount] = useState(1);
  const [isPlanningPhase, setIsPlanningPhase] = useState(true);

  const [playerStats] = useState<PlayerStats>({
    level: 1,
    strength: 10,
    agility: 10,
    intuition: 10,
    endurance: 10,
    accuracy: 10,
    intelligence: 10,
    health: 100,
    mana: 50,
    currentWeight: 20,
  });

  const carryingCapacity = calculateCarryingCapacity(playerStats.strength, playerStats.endurance);
  const actionPoints = calculateActionPoints(playerStats.agility, playerStats.endurance, playerStats.currentWeight, carryingCapacity);

  const maxSteps = maxStepsForAP(actionPoints);
  const reachableHexes = getReachableHexes(playerPosition, maxSteps, TOTAL_ROWS, TOTAL_COLS);

  useEffect(() => {
    const { width, height } = Dimensions.get('window');
    setScreenSize({ width, height });
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlanningPhase && turnTimer > 0) {
      timer = setTimeout(() => setTurnTimer(turnTimer - 1), 1000);
    } else if (turnTimer === 0 || !isPlanningPhase) {
      endTurn();
    }
    return () => clearTimeout(timer);
  }, [turnTimer, isPlanningPhase]);

  const endTurn = () => {
    if (selectedHex) {
      const distance = axialDistance(playerPosition, selectedHex);
      const movementCost = calculateMovementCost(distance);
      if (movementCost <= actionPoints) {
        setPlayerPosition(selectedHex);
      }
    }
    setTurnTimer(TURN_DURATION);
    setSelectedHex(null);
    setIsPlanningPhase(true);
    setTurnCount(turnCount + 1);
  };

  const handleHexClick = (x: number, y: number) => {
    if (isPlanningPhase && reachableHexes.some(hex => hex.x === x && hex.y === y)) {
      setSelectedHex({ x, y });
    }
  };

  const renderHexagon = (x: number, y: number) => {
    const isPlayer = playerPosition.x === x && playerPosition.y === y;
    const isSelected = selectedHex?.x === x && selectedHex?.y === y;
    const isReachable = reachableHexes.some(hex => hex.x === x && hex.y === y);
    const color = isPlayer ? 'blue' : isSelected ? 'green' : isReachable ? 'lightblue' : 'gray';
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
        onPress={() => handleHexClick(x, y)}
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
            strokeWidth={1}
          />
        </Svg>
        <Text style={styles.hexagonText}>{`${x},${y}`}</Text>
      </TouchableOpacity>
    );
  };

  const renderGrid = () => {
    const hexagons = [];
    for (let y = 0; y < TOTAL_ROWS; y++) {
      for (let x = 0; x < TOTAL_COLS; x++) {
        hexagons.push(renderHexagon(x, y));
      }
    }
    return hexagons;
  };

  const gridWidth = TOTAL_COLS * HEX_SIZE * 1.5 + HEX_SIZE;
  const gridHeight = TOTAL_ROWS * HEX_SIZE * Math.sqrt(3) + HEX_SIZE;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={{ width: screenSize.width, height: screenSize.height }}
        contentContainerStyle={{ width: gridWidth + HEX_SIZE / 2 }}
      >
        <ScrollView
          contentContainerStyle={{ height: gridHeight }}
        >
          <View style={{ width: gridWidth + HEX_SIZE / 2, height: gridHeight, position: 'relative' }}>
            {renderGrid()}
          </View>
        </ScrollView>
      </ScrollView>
      <View style={styles.turnInfo}>
        <Text style={styles.turnText}>Turn: {turnCount}</Text>
        <Text style={styles.timerText}>Time Left: {turnTimer}s</Text>
        <Button title="End Turn" onPress={endTurn} />
        <Button title="Exit Battle" onPress={onExitBattle} />
      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Player Stats</Text>
        <Text style={styles.statsText}>Level: {playerStats.level}</Text>
        <Text style={styles.statsText}>Strength: {playerStats.strength}</Text>
        <Text style={styles.statsText}>Agility: {playerStats.agility}</Text>
        <Text style={styles.statsText}>Intuition: {playerStats.intuition}</Text>
        <Text style={styles.statsText}>Endurance: {playerStats.endurance}</Text>
        <Text style={styles.statsText}>Accuracy: {playerStats.accuracy}</Text>
        <Text style={styles.statsText}>Intelligence: {playerStats.intelligence}</Text>
        <Text style={styles.statsText}>Health: {playerStats.health}</Text>
        <Text style={styles.statsText}>Mana: {playerStats.mana}</Text>
        <Text style={styles.statsText}>Carrying Capacity: {carryingCapacity}</Text>
        <Text style={styles.statsText}>Current Weight: {playerStats.currentWeight}</Text>
        <Text style={styles.statsText}>Action Points: {actionPoints}</Text>
      </View>
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
  hexagonText: {
    color: '#fff',
    fontSize: 10,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  turnInfo: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    rowGap: 5
  },
  turnText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  timerText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  statsContainer: {
    position: 'absolute',
    top: 180,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
    color: '#fff',
    rowGap: 5
  },
  statsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsText: {
    color: '#fff'
  }
});

export default BattleScene;
