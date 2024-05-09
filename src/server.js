import setupApp from './app';

const port = 8080;

(async () => {
    try {
        const app = await setupApp();
        const server = app.listen(port, () => {
            console.log(`app running on port ${port}`);
        });
        const exitSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
        exitSignals.map(sign =>
            process.on(sign, () =>
                server.close(err => {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    app.database.connection.close(function() {
                        console.info('Database connection closed!');
                        process.exit(0);
                    });
                })
            )
        );
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
