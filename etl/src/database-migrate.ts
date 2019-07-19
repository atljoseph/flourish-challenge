
import * as fs from 'fs-extra';
import * as path from 'path';
import * as config from 'config';

import { database } from 'lib';
import { asyncForEach } from 'lib';

const migration = { ...<DatabaseMigrationConfig>config.get(`migrations.strainsDb`) };

// trigger migration actions
export const migrateDatabase = async () => {
    console.log('//////////////////////////////////');
    console.log('MIGRATE DATABASE');
    console.log(migration);
    console.log('//////////////////////////////////');
    const files = getDatabaseMigrations();
    const pool = await database.strain.pool();
    await asyncForEach(files, async (migration) => {
        console.log(`MIGRATION START ${migration.filePath}`);
        if (migration.sql) await database.strain.nonQuery(pool, migration.sql);
        console.log(`MIGRATION DONE ${migration.filePath}`);
    });
};

// config type
interface DatabaseMigrationConfig {
    rootDirectory: string;
    files: string[];
}

// internally used
interface DatabaseMigration {
    filePath: string;
    sql: string;
}

// get migrations from file
const getDatabaseMigrations = (): DatabaseMigration[] => {
    migration.rootDirectory = path.resolve(migration.rootDirectory || 'migrations');
    const migrationFiles: DatabaseMigration[] = [];
    // will fail here if file not found
    (migration.files || []).forEach((migrationFile) => {
        const filePath = path.join(migration.rootDirectory, migrationFile);
        console.log(`READING SQL FILE ${filePath}`);
        const sql = fs.readFileSync(filePath, { encoding: 'utf8' });
        // console.log(sql);
        migrationFiles.push(<DatabaseMigration>{
            filePath, sql: sql.trim()
        });
    });
    return migrationFiles;
}
