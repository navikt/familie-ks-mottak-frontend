import dotenv from 'dotenv';
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '/var/run/secrets/nais.io/vault/.env' });
} else {
    dotenv.config();
}

import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import loglevel from 'loglevel';
import passport from 'passport';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import setupPassportConfig from './auth/config/passport';
import { ensureAuthenticated } from './auth/utils/authenticate';
import { attachToken, doProxy } from './auth/utils/proxy';
import setupSession from './auth/utils/session';
import { getLogTimestamp } from './customLoglevel';
import setupRouter from './router';

/* tslint:disable */
const config = require('../build_n_deploy/webpack/webpack.dev');
/* tslint:enable */

setupPassportConfig(passport);
loglevel.setDefaultLevel(loglevel.levels.INFO);

const port = 8000;
const app = express();
app.use(helmet());
app.get('/isAlive', (req: Request, res: Response) => res.status(200).end());
app.get('/isReady', (req: Request, res: Response) => res.status(200).end());

let middleware;

if (process.env.NODE_ENV === 'development') {
    const compiler = webpack(config);
    middleware = webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
} else {
    app.use('/assets', express.static(path.join(__dirname, '..', 'frontend_production')));
}

setupSession(app, passport);

app.use('/familie-ks-mottak/api', ensureAuthenticated(true), attachToken(), doProxy());

// Sett opp bodyParser og router etter proxy. Spesielt viktig med tanke på større payloads som blir parset av bodyParser
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
app.use('/', setupRouter(middleware));

app.listen(port, '0.0.0.0', (err: Error) => {
    if (err) {
        loglevel.error(`${getLogTimestamp()}: server startup failed - ${err}`);
    }
    loglevel.info(
        `${getLogTimestamp()}: server startet på port ${port}. Build version: ${
            process.env.APP_VERSION
        }.`
    );
});
