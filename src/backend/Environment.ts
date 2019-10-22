const Environment = () => {
    if (process.env.ENV === 'local') {
        return {
            buildPath: '../frontend_development',
            namespace: 'local',
            proxyUrl: 'http://localhost:8084',
        };
    } else if (process.env.ENV === 'preprod') {
        return {
            buildPath: '../frontend_production',
            namespace: 'preprod',
            proxyUrl: 'http://familie-ks-mottak',
        };
    }

    return {
        buildPath: '../frontend_production',
        namespace: 'production',
        proxyUrl: 'http://familie-ks-mottak',
    };
};
const env = Environment();

export const buildPath = env.buildPath;
export const proxyUrl = env.proxyUrl;
export const namespace = env.namespace;
