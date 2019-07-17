
import * as mysql from 'mysql';
import * as util from 'util';
import * as config from 'config';
import { DatabaseError } from '../errors/database-error';

export type MysqlDatabaseConfig = mysql.PoolConfig;

export class MysqlDatabase {
    private _connectionPool: any = null;
    private truncateStatement(statement: string) {
        return statement.substr(0, 400) + (statement.length > 400 - 1 ? ' ... ' : '');
    }
    constructor(db_config: MysqlDatabaseConfig) {
        try {
            this._connectionPool = mysql.createPool({
                host: db_config.host,
                user: db_config.user,
                password: db_config.password,
                database: db_config.database,
                connectionLimit: db_config.connectionLimit || 1,
                multipleStatements: true
            });
            // tried this and did not work well
            // this._connectionPool.query = util.promisify(this._connectionPool.query)
        }
        catch (err) {
            throw new DatabaseError(`${this.constructor.name}.constructor() - Connection ERROR`, err);
        }
    }
    async query(statement: string, values: any[] = []): Promise<any[]> {
        return new Promise<any[]>(async (resolve, reject) => {
            const ticks = Date.now();
            console.log(`${this.constructor.name}.query() ${ticks} START`);
            console.log(this.truncateStatement(statement), values);
            await this._connectionPool.query(statement, values, (err, rows, fields) => {
                if (err) {
                    // console.log(`${this.constructor.name}.query() ERROR`, ticks);
                    // console.error(err);
                    // reject(err);
                    reject(new DatabaseError(`${this.constructor.name} - Query ERROR`, err));
                    // throw err;
                    // throw new DatabaseError(`${this.constructor.name} - Query Error`, err);
                }
                else {
                    console.log(`${this.constructor.name}.query() ${ticks} END with RowCount: ${rows.length}`);
                    resolve(rows);
                }
            });
        });
    }
    async nonQuery(statement: string, values: any[] = []): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const ticks = Date.now();
            console.log(`${this.constructor.name}.nonQuery() ${ticks} START`);
            console.log(this.truncateStatement(statement), values);
            await this._connectionPool.query(statement, values, (err, rows, fields) => {
                if (err) {
                    // console.log(`${this.constructor.name}.query() ERROR`, ticks);
                    // console.error(err);
                    // reject(err);
                    reject(new DatabaseError(`${this.constructor.name} - NonQuery ERROR`, err));
                    // throw err;
                    // throw new DatabaseError(`${this.constructor.name} - NonQuery Error`, err);
                }
                else {
                    console.log(`${this.constructor.name}.nonQuery() ${ticks} END`);
                    resolve();
                }
            });
        });
    }
    async insertQuery(statement: string, values: any[] = []): Promise<number> {
        return new Promise(async (resolve, reject) => {
            const ticks = Date.now();
            console.log(`${this.constructor.name}.insertQuery() ${ticks} START`);
            console.log(this.truncateStatement(statement), values);
            await this._connectionPool.query(statement, values, (err, rows, fields) => {
                if (err) {
                    // console.log(`${this.constructor.name}.query() ERROR`, ticks);
                    // console.error(err);
                    // reject(err);
                    reject(new DatabaseError(`${this.constructor.name} - InsertQuery ERROR`, err));
                    // throw err;
                    // throw new DatabaseError(`${this.constructor.name} - InsertQuery Error`, err);
                }
                else {
                    console.log(`${this.constructor.name}.insertQuery() ${ticks} END with InsertId: ${rows.insertId}`);
                    resolve(rows.insertId);
                }
            });
        });
    }
}

// export let mysqlDatabase = new MysqlDatabase();


