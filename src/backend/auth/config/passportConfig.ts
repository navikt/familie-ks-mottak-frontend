import { IOIDCStrategyOptionWithRequest } from 'passport-azure-ad';

interface IConfig {
    allowHttpForRedirectUrl: boolean;
    cookieDomain: string;
    logoutUri: string;
    redirectUrl: string;
    tenant: string;
}

const hentPassportConfig = () => {
    let config: IConfig = {
        allowHttpForRedirectUrl: false,
        cookieDomain: '',
        logoutUri: '',
        redirectUrl: '',
        tenant: '',
    };

    const host = 'familie-ks-mottak-frontend';
    switch (process.env.ENV) {
        case 'local':
            config = {
                allowHttpForRedirectUrl: true,
                cookieDomain: 'localhost',
                logoutUri: `https://login.microsoftonline.com/navq.onmicrosoft.com/oauth2/logout?post_logout_redirect_uri=http:\\\\localhost:8000`,
                redirectUrl: 'http://localhost:8000/auth/openid/callback',
                tenant: 'navq.onmicrosoft.com',
            };
            break;
        case 'preprod':
            config = {
                allowHttpForRedirectUrl: false,
                cookieDomain: `${host}.nais.preprod.local`,
                logoutUri: `https://login.microsoftonline.com/navq.onmicrosoft.com/oauth2/logout?post_logout_redirect_uri=https:\\\\${host}.nais.preprod.local`,
                redirectUrl: `https://${host}.nais.preprod.local/auth/openid/callback`,
                tenant: 'navq.onmicrosoft.com',
            };
            break;
        case 'production':
            config = {
                allowHttpForRedirectUrl: false,
                cookieDomain: `${host}.nais.adeo.no`,
                logoutUri: `https://login.microsoftonline.com/navno.onmicrosoft.com/oauth2/logout?post_logout_redirect_uri=https:\\\\${host}.nais.adeo.no`,
                redirectUrl: `https://${host}.nais.adeo.no/auth/openid/callback`,
                tenant: 'navno.onmicrosoft.com',
            };
            break;
        default:
            break;
    }

    const key1 = process.env.PASSPORTCOOKIE_KEY1 ? process.env.PASSPORTCOOKIE_KEY1 : '';
    const key2 = process.env.PASSPORTCOOKIE_KEY2 ? process.env.PASSPORTCOOKIE_KEY2 : '';
    const key3 = process.env.PASSPORTCOOKIE_KEY3 ? process.env.PASSPORTCOOKIE_KEY3 : '';
    const key4 = process.env.PASSPORTCOOKIE_KEY4 ? process.env.PASSPORTCOOKIE_KEY4 : '';

    return {
        ...config,
        clientID: process.env.CLIENT_ID ? process.env.CLIENT_ID : 'invalid',
        clientSecret: process.env.CLIENT_SECRET ? process.env.CLIENT_SECRET : '',
        cookieEncryptionKeys: [{ key: key1, iv: key3 }, { key: key2, iv: key4 }],
        identityMetadata: `https://login.microsoftonline.com/${config.tenant}/v2.0/.well-known/openid-configuration`,
        tokenURI: `https://login.microsoftonline.com/${config.tenant}/oauth2/v2.0/token`,
        useCookieInsteadOfSession: false,
        validateIssuer: true,
    };
};

export const nodeConfig = hentPassportConfig();

export const passportConfig: IOIDCStrategyOptionWithRequest = {
    allowHttpForRedirectUrl: nodeConfig.allowHttpForRedirectUrl,
    clientID: nodeConfig.clientID,
    clientSecret: nodeConfig.clientSecret,
    cookieEncryptionKeys: nodeConfig.cookieEncryptionKeys,
    identityMetadata: nodeConfig.identityMetadata,
    loggingLevel: 'warn',
    passReqToCallback: true,
    redirectUrl: nodeConfig.redirectUrl,
    responseMode: 'form_post',
    responseType: 'code',
    scope: 'profile offline_access',
    useCookieInsteadOfSession: nodeConfig.useCookieInsteadOfSession,
    validateIssuer: nodeConfig.validateIssuer,
};
