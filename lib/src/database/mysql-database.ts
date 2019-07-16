
import * as mysql from 'mysql';
import * as util from 'util';

export type MysqlDatabaseConfig = mysql.PoolConfig;

export class MysqlDatabase {
    private _connectionPool: any = null;
    constructor({ host, user, password, database, connectionLimit }: MysqlDatabaseConfig) {
        try {
            this._connectionPool = mysql.createPool({
                host,
                user,
                password,
                database,
                connectionLimit: connectionLimit || 1,
                multipleStatements: true
            });
            // tried this and did not work well
            // this._connectionPool.query = util.promisify(this._connectionPool.query)
        }
        catch (err) {
            console.log('ERROR - Getting MySql Connection');
            console.error(err);
            throw err;
        }
    }
    async query(statement: string, values: any[] = []): Promise<any[]> {
        return new Promise<any[]>(async (resolve, reject) => {
            const ticks = Date.now();
            console.log('DB START', ticks);
            const charLimit = 400;
            console.log(statement.substr(0, charLimit) + (statement.length > charLimit - 1 ? ' ... ' : ''), values);
            await this._connectionPool.query(statement, values, function (err, rows, fields) {
                if (err) {
                    console.log('DB ERROR', ticks);
                    reject(err);
                }
                else {
                    console.log('DB SUCCESS', ticks);
                    console.log(rows);
                    resolve(rows);
                }
            });
        });
    }
    async nonQuery(statement: string, values: any[] = []): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const ticks = Date.now();
            console.log('DB START', ticks);
            const charLimit = 400;
            console.log(statement.substr(0, charLimit) + (statement.length > charLimit - 1 ? ' ... ' : ''), values);
            await this._connectionPool.query(statement, values, function (err, rows, fields) {
                if (err) {
                    console.log('DB ERROR', ticks);
                    console.error(err);
                    reject(err);
                }
                else {
                    console.log('DB SUCCESS', ticks);
                    resolve();
                }
            });
        });
    }
    async insertQuery(statement: string, values: any[] = []): Promise<number> {
        return new Promise(async (resolve, reject) => {
            const ticks = Date.now();
            console.log('DB START', ticks);
            const charLimit = 400;
            console.log(statement.substr(0, charLimit) + (statement.length > charLimit - 1 ? ' ... ' : ''), values);
            await this._connectionPool.query(statement, values, function (err, rows, fields) {
                if (err) {
                    console.log('DB ERROR', ticks);
                    console.error(err);
                    reject(err);
                }
                else {
                    console.log('DB SUCCESS', ticks);
                    console.log(rows);
                    resolve(rows.insertId);
                }
            });
        });
    }
}

// export let mysqlDatabase = new MysqlDatabase();


