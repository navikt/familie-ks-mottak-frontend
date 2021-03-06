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
        barnetrygd_mottak: 'http://localhost:8090',
        barnetrygd_sak: 'http://localhost:8089',
        kontantstøtte: 'http://localhost:8084',
    };
} else {
    proxyUrls = {
        barnetrygd_mottak: 'http://familie-ba-mottak',
        barnetrygd_sak: 'http://familie-ba-sak',
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
        displayName: 'Barnetrygd mottak',
        id: 'familie-ba-mottak',
        proxyPath: '/familie-ba-mottak/api',
        proxyUrl: proxyUrls.barnetrygd_mottak,
    },
    {
        azureScope: process.env.BA_SAK_SCOPE,
        displayName: 'Barnetrygd sak',
        id: 'familie-ba-sak',
        proxyPath: '/familie-ba-sak/api',
        proxyUrl: proxyUrls.barnetrygd_sak,
    },
];
