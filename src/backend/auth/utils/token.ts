import axios from 'axios';
import moment from 'moment-timezone';
import request from 'request-promise';
import { logError, logInfo } from '../../customLoglevel';
import { nodeConfig } from '../config/passportConfig';
import { SessionRequest } from './session';

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

    return req.session.accessToken;
};

// GET USER SPESIFIC ACCESSTOKEN
const getAccessTokenUser = async (req: SessionRequest) => {
    const data = {
        client_id: nodeConfig.clientID,
        client_secret: nodeConfig.clientSecret,
        grant_type: 'refresh_token',
        redirect_uri: nodeConfig.redirectUrl,
        refresh_token: req.session.refreshToken,
        resource: nodeConfig.clientID,
    };

    if (process.env.NODE_ENV === 'production') {
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
                    logError(req, `Failed to destroy session: ${error}`);
                });
                return '';
            });
    } else {
        return axios
            .get('http://localhost:8084/local/cookie')
            .then(result => {
                return result.data.value;
            })
            .catch(err => {
                logError(req, `Error during getAccessTokenUser: ${err}`);
                req.session.destroy((error: Error) => {
                    logError(req, `Failed to destroy session: ${error}`);
                });
                return '';
            });
    }
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
