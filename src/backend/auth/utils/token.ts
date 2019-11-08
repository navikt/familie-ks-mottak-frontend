import moment from 'moment-timezone';
import request from 'request-promise';
import { logError, logInfo } from '../../customLoglevel';
import { nodeConfig } from '../config/passportConfig';
import { SessionRequest } from './session';

// GET AND REFRESH OBO ACCESSTOKEN
export const validateRefreshAndGetOnBehalfOfToken = async (req: SessionRequest) => {
    if (!req.session) {
        logError(
            req,
            'No session found in validateRefreshAndGetOboToken. Returning invalid OBO accessToken.'
        );
        return '';
    }

    if (!req.session.oboAccessToken) {
        logInfo(req, 'No OBO accessToken, fetching new OBO accessToken.');

        const newOboAccessToken = await getOnBehalfOfToken(req);

        req.session.oboAccessToken = newOboAccessToken;
    } else if (moment().isAfter(moment(req.session.oboExpiryDate))) {
        logInfo(req, 'Expired token, fetching new OBO accessToken.');

        const newOboAccessToken = await getOnBehalfOfToken(req);

        if (req.session) {
            req.session.oboAccessToken = newOboAccessToken;
        }
    } else {
        logInfo(req, 'Valid OBO accessToken in cache.');
        return req.session.oboAccessToken;
    }
    req.session.oboExpiryDate = JSON.parse(decodeToken(req.session.oboAccessToken)).exp * 1000;

    req.session.save((error: Error) => {
        if (error) {
            logError(req, `Failed to save OBO access token to session: ${error}`);
        }
    });

    return req.session.oboAccessToken;
};

// GET AND REFRESH ACCESSTOKENS
export const validateRefreshAndGetToken = async (req: SessionRequest) => {
    if (!req.session) {
        logError(
            req,
            'No session found in validateRefreshAndGetToken. Returning invalid accessToken.'
        );
        return '';
    }

    if (!req.session.accessToken) {
        logInfo(req, 'not authenticated - no accessToken. Fetching new accessToken.');

        const newAccessToken = await getAccessTokenUser(req);

        req.session.accessToken = newAccessToken;
    } else if (moment().isAfter(moment(req.session.expiryDate))) {
        logInfo(req, 'not authenticated - expired token. Fetching new accessToken.');

        const newAccessToken = await getAccessTokenUser(req);

        if (req.session) {
            req.session.accessToken = newAccessToken;
        }
    } else {
        logInfo(req, 'authenticated.');
    }
    req.session.expiryDate = JSON.parse(decodeToken(req.session.accessToken)).exp * 1000;

    req.session.save((error: Error) => {
        if (error) {
            logError(req, `Failed to save access token to session: ${error}`);
        }
    });

    return req.session.accessToken;
};

// GET USER SPECIFIC ACCESSTOKEN
const getAccessTokenUser = async (req: SessionRequest) => {
    const data = {
        client_id: nodeConfig.clientID,
        client_secret: nodeConfig.clientSecret,
        grant_type: 'refresh_token',
        redirect_uri: nodeConfig.redirectUrl,
        refresh_token: req.session.refreshToken,
        scope: `${nodeConfig.clientID}/.default`,
    };

    return request
        .post({ url: nodeConfig.tokenURI, formData: data }, (err, httpResponse, body) => {
            return body;
        })
        .then(result => {
            return JSON.parse(result).access_token;
        })
        .catch(err => {
            logError(req, `Error during getAccessTokenUser: ${err}`);
            req.session.destroy((error: Error) => {
                if (error) {
                    logError(req, `Failed to destroy session: ${error}`);
                }
            });
            return '';
        });
};

// GET ON-BEHALF-OF ACCESSTOKEN
const getOnBehalfOfToken = async (req: SessionRequest) => {
    const data = {
        assertion: req.session.accessToken,
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        client_id: nodeConfig.clientID,
        client_secret: nodeConfig.clientSecret,
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        redirect_uri: nodeConfig.redirectUrl,
        requested_token_use: 'on_behalf_of',
        scope: process.env.KS_MOTTAK_SCOPE,
    };

    return request
        .post({ url: nodeConfig.tokenURI, formData: data }, (err, httpResponse, body) => {
            return body;
        })
        .then(result => {
            return JSON.parse(result).access_token;
        })
        .catch(err => {
            logError(req, `Error during getAccessTokenUser: ${err}`);
            req.session.destroy((error: Error) => {
                if (error) {
                    logError(req, `Failed to destroy session: ${error}`);
                }
            });
            return '';
        });
};

// DECODE TOKEN
const decodeToken = (encodedToken: string): string => {
    if (encodedToken) {
        if (encodedToken.startsWith('eyJ0') || process.env.NODE_ENV === 'development') {
            const tokenSplit = encodedToken.split('.');
            const tokenDecoded = Buffer.from(tokenSplit[1], 'base64').toString();
            return tokenDecoded;
        } else {
            throw new Error('not a valid accessToken or id_token');
        }
    } else {
        throw new Error('no token in input');
    }
};
