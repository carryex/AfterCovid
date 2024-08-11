export const calculateActionPoints = (agility: number, endurance: number, currentWeight: number, carryingCapacity: number) => {
  const baseAP = agility + Math.floor(endurance / 2);
  const effectiveAP = baseAP * (1 - (currentWeight / (carryingCapacity * 2)));
  return Math.max(0, Math.floor(effectiveAP)); // AP не может быть меньше 0
};

export const calculateCarryingCapacity = (strength: number, endurance: number) => {
  return strength * 10 + endurance * 5;
};