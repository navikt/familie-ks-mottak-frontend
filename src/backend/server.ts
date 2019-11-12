import { ensureAuthenticated, konfigurerBackend } from '@navikt/familie-backend';
import { getLogTimestamp } from '@navikt/familie-backend/lib/customLoglevel';
import { IFamilieBackend } from '@navikt/familie-backend/lib/typer';
import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import loglevel from 'loglevel';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { attachToken, doProxy } from './proxy';
import setupRouter from './router';

import { passportConfig, sessionConfig } from './config';

/* tslint:disable */
const config = require('../build_n_deploy/webpack/webpack.dev');
/* tslint:enable */

const familieBackend: IFamilieBackend = konfigurerBackend(passportConfig, sessionConfig);

familieBackend.app.use(helmet());
loglevel.setDefaultLevel(loglevel.levels.INFO);

const port = 8000;

let middleware;

if (process.env.NODE_ENV === 'development') {
    const compiler = webpack(config);
    middleware = webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
    });

    familieBackend.app.use(middleware);
    familieBackend.app.use(webpackHotMiddleware(compiler));
} else {
    familieBackend.app.use(
        '/assets',
        express.static(path.join(__dirname, '..', 'frontend_production'))
    );
}

familieBackend.app.use(
    '/familie-ks-mottak/api',
    ensureAuthenticated(true),
    attachToken(),
    doProxy()
);

// Sett opp bodyParser og router etter proxy. Spesielt viktig med tanke på større payloads som blir parset av bodyParser
familieBackend.app.use(bodyParser.json({ limit: '200mb' }));
familieBackend.app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
familieBackend.app.use('/', setupRouter(middleware));

familieBackend.app.listen(port, '0.0.0.0', (err: Error) => {
    if (err) {
        loglevel.error(`${getLogTimestamp()}: server startup failed - ${err}`);
    }
    loglevel.info(
        `${getLogTimestamp()}: server startet på port ${port}. Build version: ${
            process.env.APP_VERSION
        }.`
    );
});
