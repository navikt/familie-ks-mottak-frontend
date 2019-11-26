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
        kontantstøtte: 'http://localhost:8084',
    };
} else {
    proxyUrls = {
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
];
