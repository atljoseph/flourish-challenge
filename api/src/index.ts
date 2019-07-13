
import * as config from 'config';

import app from './app';

const port = config.get('api_port');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise ', p, reason)
});

server.on('listening', async () => {
    console.log('Express API started on http://localhost:%d', port);
});
