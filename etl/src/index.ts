
import { migrateDatabase } from './database-migrate';
import { seedDatabase } from './database-seed';
import * as path from 'path';

(async () => {
    await migrateDatabase();
    await seedDatabase();
})();
