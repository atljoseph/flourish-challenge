
import { migrateDatabase } from './database-migrate';
import { seedDatabase } from './database-seed';
import * as path from 'path';

(async () => {
    await migrateDatabase(path.resolve(__dirname, '../migrations'));
    await seedDatabase();
})();
