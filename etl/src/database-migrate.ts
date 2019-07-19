
import * as fs from 'fs-extra';
import * as path from 'path';
import * as config from 'config';

import { database } from 'lib';
import { asyncForEach } from 'lib';

const migrationConfig = { ...<DatabaseMigrationConfig>config.get(`migrations.strainsDb`) };

// trigger migration actions
export const migrateDatabase = async () => {
    console.log('//////////////////////////////////');
    console.log('MIGRATE DATABASE');
    console.log(migrationConfig);
    console.log('//////////////////////////////////');
    const files = getDatabaseMigrations();
    const pool = await database.strain.pool();
    await asyncForEach(files, async (migrationFile) => {
        console.log(`MIGRATION START ${migrationFile.filePath}`);
        if (migrationFile.sql) await database.strain.nonQuery(pool, migrationFile.sql);
        console.log(`MIGRATION DONE ${migrationFile.filePath}`);
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
    migrationConfig.rootDirectory = path.resolve(migrationConfig.rootDirectory || 'migrations');
    const migrationFiles: DatabaseMigration[] = [];
    // will fail here if file not found
    (migrationConfig.files || []).forEach((migrationFile) => {
        const filePath = path.join(migrationConfig.rootDirectory, migrationFile);
        console.log(`READING SQL FILE ${filePath}`);
        const sql = fs.readFileSync(filePath, { encoding: 'utf8' });
        // console.log(sql);
        migrationFiles.push(<DatabaseMigration>{
            filePath, sql: sql.trim()
        });
    });
    return migrationFiles;
}
