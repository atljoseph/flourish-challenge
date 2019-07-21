
import * as mysql from 'mysql';
import { MysqlConnectionConfig } from '../config/mysql-config';

/**
 * Connector designed to service Mysql.
 * Other database types can be added at any time.
 */
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
    /**
     * Use this to get a transactable connectin from the pool.
     */
    private async _connection(): Promise<mysql.PoolConnection> {
        return new Promise<mysql.PoolConnection>(async (resolve, reject) => {
            await this._pool.getConnection(async (err, conn) => {
                if (err) reject(err);
                resolve(conn);
            });
        });
    }
    /**
     * Get a queryable pool connection.
     */
    async pool(): Promise<mysql.Pool> {
        return new Promise<mysql.Pool>(async (resolve, reject) => {
            resolve(this._pool);
        });
    }
    /**
     * Query a Mysql Database with a Transaction (PoolConnection) or with the Pool itself.
     * Note: Returns an array of castable rows, and throws error upon failure.
     */
    async query(conn: mysql.Pool | mysql.PoolConnection, statement: string, values: any[] = []): Promise<any[]> {
        return new Promise<any[]>(async (resolve, reject) => {
            await conn.query(statement, values, (err, rows, fields) => {
                if (err) reject(err);
                else {
                    resolve(rows);
                }
            });
        });
    }
    /**
     * Query a Mysql Database with a Transaction (PoolConnection) or with the Pool itself.
     * Note: Returns void, but throws error if failure.
     */
    async nonQuery(conn: mysql.Pool | mysql.PoolConnection, statement: string, values: any[] = []): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            await conn.query(statement, values, (err, rows, fields) => {
                if (err) reject(err);
                else {
                    resolve();
                }
            });
        });
    }
    /**
     * Query a Mysql Database with a Transaction (PoolConnection) or with the Pool itself.
     * Note: Returns the last inserted ID, but throws error if failure.
     */
    async insertQuery(conn: mysql.Pool | mysql.PoolConnection, statement: string, values: any[] = []): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            await conn.query(statement, values, (err, rows, fields) => {
                if (err) reject(err);
                else {
                    resolve(rows.insertId);
                }
            });
        });
    }
    /**
     * Get a transactable connectino and begin a transaction.
     * Note: Throws an error upon failure.
     */
    async transaction(): Promise<mysql.PoolConnection> {
        return new Promise<mysql.PoolConnection>(async (resolve, reject) => {
            const conn = await this._connection();
            conn.beginTransaction(async (err) => {
                if (err) reject(err);
                else {
                    resolve(conn);
                }
            });
        });
    }
    /**
     * Rollback a transaction.
     * Note: Throws an error upon failure.
     */
    async rollback(mysqlTransaction: mysql.PoolConnection): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            await mysqlTransaction.rollback(async () => {
                mysqlTransaction.release();
                resolve();
            });
        });
    }
    /**
     * Commit a transaction.
     * Note: Throws an error upon failure, with automatic rollback.
     */
    async commit(mysqlTransaction: mysql.PoolConnection): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            await mysqlTransaction.commit(async (err) => {
                if (err) {
                    await this.rollback(mysqlTransaction);
                    reject(err);
                }
                else {
                    mysqlTransaction.release();
                    resolve();
                }
            });
        });
    }
}
