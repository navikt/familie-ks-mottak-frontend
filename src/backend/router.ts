import Backend from '@navikt/familie-backend';
import { SessionRequest } from '@navikt/familie-backend/lib/typer';
import { Response } from 'express';
import path from 'path';
import { buildPath, saksbehandlerTokenConfig } from './config';

export default (backend: Backend, middleware: any) => {
    backend.getRouter().get('/version', (req, res) => {
        res.status(200)
            .send({ version: process.env.APP_VERSION })
            .end();
    });

    // APP
    if (process.env.NODE_ENV === 'development') {
        backend
            .getRouter()
            .get(
                '*',
                backend.ensureAuthenticated(false, saksbehandlerTokenConfig),
                (req: SessionRequest, res: Response) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(
                        middleware.fileSystem.readFileSync(
                            path.join(__dirname, `${buildPath}/index.html`)
                        )
                    );
                    res.end();
                }
            );
    } else {
        backend
            .getRouter()
            .get(
                '*',
                backend.ensureAuthenticated(false, saksbehandlerTokenConfig),
                (req: SessionRequest, res: Response) => {
                    res.sendFile('index.html', { root: path.join(__dirname, buildPath) });
                }
            );
    }

    return backend.getRouter();
};
