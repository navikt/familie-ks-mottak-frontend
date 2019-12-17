export interface IService {
    azureScope: string;
    displayName: string;
    proxyPath: string;
    id: string;
    proxyUrl: string;
}

let proxyUrls: { [key: string]: string } = {};
if (process.env.ENV === 'local') {
    proxyUrls = {
        barnetrygd: 'http://localhost:8090',
        kontantstøtte: 'http://localhost:8084',
    };
} else {
    proxyUrls = {
        barnetrygd: 'http://familie-ba-mottak',
        kontantstøtte: 'http://familie-ks-mottak',
    };
}

export const serviceConfig: IService[] = [
    {
        azureScope: process.env.KS_MOTTAK_SCOPE,
        displayName: 'Kontantstøtte',
        id: 'familie-ks-mottak',
        proxyPath: '/familie-ks-mottak/api',
        proxyUrl: proxyUrls.kontantstøtte,
    },
    {
        azureScope: process.env.BA_MOTTAK_SCOPE,
        displayName: 'Barnetrygd',
        id: 'familie-ba-mottak',
        proxyPath: '/familie-ba-mottak/api',
        proxyUrl: proxyUrls.barnetrygd,
    },
];
