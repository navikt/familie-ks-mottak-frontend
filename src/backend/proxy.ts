import { validerEllerOppdaterOnBehalfOfToken } from '@navikt/familie-backend';
import { SessionRequest } from '@navikt/familie-backend/lib/typer';
import { NextFunction, Request, Response } from 'express';
import { ClientRequest } from 'http';
import proxy from 'http-proxy-middleware';
import uuid from 'uuid';
import { nodeConfig } from './config';
import { proxyUrl } from './Environment';

const restream = (proxyReq: ClientRequest, req: Request, res: Response) => {
    if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
};

export const doProxy = () => {
    return proxy('/familie-ks-mottak/api', {
        changeOrigin: true,
        logLevel: 'info',
        onProxyReq: restream,
        pathRewrite: (path, req) => {
            const newPath = path.replace('/familie-ks-mottak/api', '');
            return `/api${newPath}`;
        },
        secure: true,
        target: `${proxyUrl}`,
    });
};

export const attachToken = () => {
    return async (req: SessionRequest, res: Response, next: NextFunction) => {
        const accessToken = await validerEllerOppdaterOnBehalfOfToken(req, {
            clientId: nodeConfig.clientID,
            clientSecret: nodeConfig.clientSecret,
            redirectUrl: nodeConfig.redirectUrl,
            scope: process.env.KS_MOTTAK_SCOPE,
            tokenUri: nodeConfig.tokenURI,
        });
        req.headers['Nav-Call-Id'] = uuid.v1();
        req.headers.Authorization = `Bearer ${accessToken}`;
        return next();
    };
};
