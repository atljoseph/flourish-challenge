
import { migrateDatabase, seedDatabase } from './data';

(async () => {
    await migrateDatabase();
    await seedDatabase();
})();
