import Dexie from 'dexie';

const db = new Dexie('Challenge06');
db.version(1).stores({ fruits: '++id, userId, nombre' });
export default db;
