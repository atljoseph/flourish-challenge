
import * as fs from 'fs-extra';
import * as path from 'path';
import * as config from 'config';

import { MysqlDatabase, MysqlDatabaseConfig } from 'lib';
import { asyncForEach } from 'lib';

const db_connection_name = 'strainsDb';
const migration = { ...<DatabaseMigrationConfig>config.get(`migrations.${db_connection_name}`) };
const db_config = <MysqlDatabaseConfig>config.get(`databases.${db_connection_name}`);
const db = new MysqlDatabase(db_config);

export const migrateDatabase = async () => {
    console.log('//////////////////////////////////');
    console.log('MIGRATE DATABASE');
    console.log(migration);
    console.log('//////////////////////////////////');
    const files = getDatabaseMigration();
    await asyncForEach(files, async (migration) => {
        console.log(`MIGRATION START ${migration.filePath}`);
        if (migration.sql) await db.nonQuery(migration.sql);
        console.log(`MIGRATION DONE ${migration.filePath}`);
    });
};

interface DatabaseMigrationConfig {
    rootDirectory: string;
    files: string[];
}

interface DatabaseMigration {
    filePath: string;
    sql: string;
}

const getDatabaseMigration = (): DatabaseMigration[] => {
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
