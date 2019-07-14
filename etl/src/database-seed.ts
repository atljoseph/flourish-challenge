
import { database, DatabaseConfig } from 'lib';
import * as config from 'config';

export const seedDatabase = async () => {
    const db_config = <DatabaseConfig>config.get('database');
    console.log(db_config);
    // query or queries will be built here and inserted
    await database.nonQuery(`insert into testy (test_name) values ('derka');`, db_config);
    await database.nonQuery(`insert into testy (test_name) values ('derk');`, db_config);
    await database.query('select * from testy;', db_config)
};
