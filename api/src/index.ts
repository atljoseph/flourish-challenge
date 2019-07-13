
import app from './app';

const port = 8888;
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise ', p, reason)
});

server.on('listening', () => {
    console.log('Express API started on http://localhost:%d', port);
});


