import express, { NextFunction, Response } from 'express';
import path from 'path';
import {
    authenticateAzure,
    authenticateAzureCallback,
    ensureAuthenticated,
    logout,
} from './auth/utils/authenticate';
import { SessionRequest } from './auth/utils/session';
import { getUserProfile } from './auth/utils/user';
import { buildPath } from './Environment';

const router = express.Router();

/* tslint:disable */
const packageJson = require('../package.json');
/* tslint:enable */

export default (middleware: any) => {
    router.get('/version', (req, res) => {
        res.status(200)
            .send({ version: process.env.APP_VERSION })
            .end();
    });

    // AUTHENTICATION
    router.get('/login', (req: SessionRequest, res: Response, next: NextFunction) => {
        authenticateAzure(req, res, next);
    });
    router.post('/auth/openid/callback', authenticateAzureCallback());
    router.get('/auth/logout', logout);

    // USER
    router.get('/user/profile', ensureAuthenticated(true), getUserProfile());

    // APP
    if (process.env.NODE_ENV === 'development') {
        router.get('*', ensureAuthenticated(false), (req: SessionRequest, res: Response) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(
                middleware.fileSystem.readFileSync(path.join(__dirname, `${buildPath}/index.html`))
            );
            res.end();
        });
    } else {
        router.get('*', ensureAuthenticated(false), (req: SessionRequest, res: Response) => {
            res.sendFile('index.html', { root: path.join(__dirname, buildPath) });
        });
    }

    return router;
};
