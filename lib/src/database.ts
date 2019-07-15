
import * as mysql from 'mysql';
import * as util from 'util';

export type DatabaseConfig = mysql.PoolConfig;

class Database {
    private _connectionPool: any = null;
    private _connect({ host, user, password, database, connectionLimit }: DatabaseConfig) {
        try {
            if (!this._connectionPool) {
                this._connectionPool = mysql.createPool({
                    host,
                    user,
                    password,
                    database,
                    connectionLimit: connectionLimit || 1,
                    multipleStatements: true
                });
                // this._connectionPool.query = util.promisify(this._connectionPool.query)
            }
        }
        catch (err) {
            console.log('ERROR - Getting MySql Connection');
            console.error(err);
            throw err;
        }
    }
    async query(config: DatabaseConfig, statement: string, values: any[] = []): Promise<any[]> {
        return new Promise<any[]>(async (resolve, reject) => {
            this._connect(config);
            const ticks = Date.now();
            console.log('DB START', ticks);
            const charLimit = 400;
            console.log(statement.substr(0, charLimit) + (statement.length > charLimit - 1 ? ' ... ' : ''));
            await this._connectionPool.query(statement, values, function (err, rows, fields) {
                if (err) {
                    console.log('DB ERROR', ticks);
                    reject(err);
                }
                else {
                    console.log(rows);
                    console.log('DB SUCCESS', ticks);
                    resolve(rows);
                }
            });
        });
    }
    async nonQuery(config: DatabaseConfig, statement: string, values: any[] = []) {
        return new Promise(async (resolve, reject) => {
            this._connect(config);
            const ticks = Date.now();
            console.log('DB START', ticks);
            const charLimit = 400;
            console.log(statement.substr(0, charLimit) + (statement.length > charLimit - 1 ? ' ... ' : ''));
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
}

export let database = new Database();


