import { NextFunction, Response } from 'express';
import passport from 'passport';
import { logError } from '../../customLoglevel';
import { nodeConfig } from '../config/passportConfig';
import { SessionRequest } from './session';

export const authenticateAzure = (req: SessionRequest, res: Response, next: NextFunction) => {
    const regex: RegExpExecArray | null = /redirectUrl=(.*)/.exec(req.url);
    const redirectUrl = regex ? regex[1] : 'invalid';

    const successRedirect = regex ? redirectUrl : '/';

    req.session.redirectUrl = successRedirect;
    try {
        passport.authenticate('azuread-openidconnect', {
            failureRedirect: '/error',
            successRedirect,
        })(req, res, next);
    } catch (err) {
        throw new Error(`Error during authentication: ${err}`);
    }
};

export const authenticateAzureCallback = () => {
    return (req: SessionRequest, res: Response, next: NextFunction) => {
        try {
            passport.authenticate('azuread-openidconnect', {
                failureRedirect: '/error',
                successRedirect: req.session.redirectUrl || '/',
            })(req, res, next);
        } catch (err) {
            throw new Error(`Error during authentication: ${err}`);
        }
    };
};

export const ensureAuthenticated = (sendUnauthorized: boolean) => {
    return async (req: SessionRequest, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            return next();
        }

        const pathname = req.originalUrl;
        if (sendUnauthorized) {
            res.status(401).send('Unauthorized');
        } else {
            res.redirect(`/login?redirectUrl=${pathname}`);
        }
    };
};

export const logout = (req: SessionRequest, res: Response) => {
    req.session.destroy(error => {
        logError(req, `error during logout: ${error}`);
        res.status(500).send(error);
    });
    res.redirect(nodeConfig.logoutUri);
};
