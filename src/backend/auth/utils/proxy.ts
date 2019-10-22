import { NextFunction, Request, Response } from 'express';
import { ClientRequest } from 'http';
import proxy from 'http-proxy-middleware';
import { proxyUrl } from '../../Environment';
import { SessionRequest } from './session';
import { validateRefreshAndGetToken } from './token';

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
        const accessToken = await validateRefreshAndGetToken(req);
        req.headers.Authorization = `Bearer ${accessToken}`;
        return next();
    };
};
