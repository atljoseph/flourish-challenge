
import { database, DatabaseConfig } from 'lib';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as config from 'config';

export const migrateDatabase = async (folderPath: string) => {
    const db_config = <DatabaseConfig>config.get('database');
    console.log(db_config);
    // add a dynamic folder load action here instead of one-offs
    const filePath = path.resolve(folderPath, './01.CreateTestTable.sql');
    console.log(filePath);
    let sql = await fs.readFile(filePath, { encoding: 'utf8' });
    await database.nonQuery(sql, db_config);//.replace(/(\r\n|\n|\r)/gm, ""));
};
