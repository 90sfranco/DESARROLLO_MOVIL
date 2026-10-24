export const TARGET_METERS = 50;
export const STILL_SECONDS = 10;
export const MOTION_THRESHOLD = 2;
export const MISSIONS = [
  { id: 1, title: 'Evidencia', description: 'Toma una foto y guarda la imagen.', points: 40 },
  { id: 2, title: 'Movimiento real', description: `Aléjate ${TARGET_METERS} metros de tu posición inicial.`, points: 40 },
  { id: 3, title: 'Permanencia activa', description: `Después del recorrido, permanece quieto ${STILL_SECONDS} segundos.`, points: 40 },
];

export function mergeProgress(...sources) {
  const missions = MISSIONS.map(({ id }) => ({
    id, completed: sources.some(source => source?.missions?.some(m => m.id === id && m.completed === true)),
  }));
  // Una misión completada en otro dispositivo tampoco se pierde al reconectar.
  if (!missions[1].completed) missions[2].completed = false;
  const points = MISSIONS.reduce((sum, mission, index) => sum + (missions[index].completed ? mission.points : 0), 0);
  return { points, missions };
}

export function sameProgress(a, b) {
  return a.points === b.points && a.missions.every((m, i) => m.completed === b.missions[i]?.completed);
}

export function distanceInMeters(origin, current) {
  const radians = degrees => degrees * Math.PI / 180;
  const dLat = radians(current.latitude - origin.latitude);
  const dLon = radians(current.longitude - origin.longitude);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(origin.latitude))
    * Math.cos(radians(current.latitude)) * Math.sin(dLon / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}
