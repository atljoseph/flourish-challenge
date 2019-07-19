
import * as mysql from 'mysql';
import { DatabaseError } from '../../error/database-error';
import { MysqlConnectionConfig } from '../config/mysql-config';

export class MysqlConnector {
    private _pool: mysql.Pool;
    constructor(config: MysqlConnectionConfig) {
        this._pool = mysql.createPool({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            connectionLimit: config.connectionLimit || 1,
            multipleStatements: config.multipleStatements
        });
    }
    private async _connection(): Promise<mysql.PoolConnection> {
        return new Promise<mysql.PoolConnection>(async (resolve, reject) => {
            await this._pool.getConnection(async (err, conn) => {
                if (err) reject(new DatabaseError(`${this.constructor.name}Error Getting Connection`, err));
                resolve(conn);
            });
        });
    }
    async pool(): Promise<mysql.Pool> {
        return new Promise<mysql.Pool>(async (resolve, reject) => {
            resolve(this._pool);
        });
    }
    async query(conn: mysql.Pool | mysql.PoolConnection, statement: string, values: any[] = []): Promise<any[]> {
        return new Promise<any[]>(async (resolve, reject) => {
            const ticks = Date.now();
            // console.log(`${this.constructor.name}.query() ${ticks} START`);
            // console.log(this.truncateStatement(statement), values);
            await conn.query(statement, values, (err, rows, fields) => {
                if ('release' in conn) conn.release();
                if (err) reject(new DatabaseError(`${this.constructor.name} - Query ERROR`, err));
                else {
                    // console.log(`${this.constructor.name}.query() ${ticks} END with RowCount: ${rows.length}`);
                    resolve(rows);
                }
            });
        });
    }
    async nonQuery(conn: mysql.Pool | mysql.PoolConnection, statement: string, values: any[] = []): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            const ticks = Date.now();
            // console.log(`${this.constructor.name}.nonQuery() ${ticks} START`);
            // console.log(this.truncateStatement(statement), values);
            await conn.query(statement, values, (err, rows, fields) => {
                if ('release' in conn) conn.release();
                if (err) reject(new DatabaseError(`${this.constructor.name} - NonQuery ERROR`, err));
                else {
                    // console.log(`${this.constructor.name}.nonQuery() ${ticks} END`);
                    resolve();
                }
            });
        });
    }
    async insertQuery(conn: mysql.Pool | mysql.PoolConnection, statement: string, values: any[] = []): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            const ticks = Date.now();
            // console.log(`${this.constructor.name}.insertQuery() ${ticks} START`);
            // console.log(this.truncateStatement(statement), values);
            await conn.query(statement, values, (err, rows, fields) => {
                if ('release' in conn) conn.release();
                if (err) reject(new DatabaseError(`${this.constructor.name} - InsertQuery ERROR`, err));
                else {
                    // console.log(`${this.constructor.name}.insertQuery() ${ticks} END with InsertId: ${rows.insertId}`);
                    resolve(rows.insertId);
                }
            });
        });
    }
    async transaction(): Promise<mysql.PoolConnection> {
        return new Promise<mysql.PoolConnection>(async (resolve, reject) => {
            const conn = await this._connection();
            conn.beginTransaction(async (err) => {
                if (err) reject(new DatabaseError(`${this.constructor.name}Error Starting Transaction`, err));
                else {
                    resolve(conn);
                }
            });
        });
    }
    async rollback(mysqlTransaction: mysql.PoolConnection): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            await mysqlTransaction.rollback(async () => {
                // console.log(`${this.constructor.name} Transaction Rollback Successful`);
                mysqlTransaction.release();
                resolve();
            });
        });
    }
    async commit(mysqlTransaction: mysql.PoolConnection): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            await mysqlTransaction.commit(async (err) => {
                if (err) {
                    // console.log(`${this.constructor.name} Rolling Back Transaction`);
                    await this.rollback(mysqlTransaction);
                    reject(new DatabaseError(`${this.constructor.name}Error Committing - Transaction Rolled Back`, err));
                }
                else {
                    mysqlTransaction.release();
                    resolve();
                }
            });
        });
    }
}
