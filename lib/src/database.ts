
import * as mysql from 'mysql';

export type DatabaseConfig = mysql.ConnectionConfig;

class Database {
    connect({ host, user, password, database}: DatabaseConfig): mysql.Connection {
        try {
            return mysql.createConnection({
                host,
                user,
                password,
                database
            });
        }
        catch (err) {
            console.log('ERROR - Getting MySql Connection');
            console.error(err);
            throw err;
        }
    }
    async query(statement: string, config: DatabaseConfig): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            const connection = this.connect(config);
            connection.query(statement, function (err, rows, fields) {
                if (err) {
                    console.log(`ERROR - Running MySql Query against '${database}' - ${statement}`);
                    console.error(err);
                    throw err;
                    // reject([]);
                };
                console.log(`SUCCESS - ${statement}`);
                console.log(rows);
                connection.end();
                resolve(rows);
            });
        });
    }
    async nonQuery(statement: string, config: DatabaseConfig) {
        return new Promise((resolve, reject) => {
            const connection = this.connect(config);
            connection.query(statement, function (err, rows, fields) {
                if (err) {
                    console.log(`ERROR - Running MySql Query against '${database}' - ${statement}`);
                    console.error(err);
                    reject(err);
                };
                resolve();
                console.log(`SUCCESS - ${statement}`);
                connection.end();
            });
        });
    }
}

export let database = new Database();


