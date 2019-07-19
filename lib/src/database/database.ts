
import * as config from 'config';

import { MysqlConnector } from "./connection/mysql-connection";
import { MysqlConnectionConfig } from './config';

export const database = {
    strain: new MysqlConnector(<MysqlConnectionConfig>config.get('databases.strainsDb'))
}
