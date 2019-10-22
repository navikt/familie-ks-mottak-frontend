import { Ressurs } from '../typer/ressurs';
import { ITask } from '../typer/task';
import { axiosRequest } from './axios';

export const hentTasks = (): Promise<Ressurs<ITask[]>> => {
    return axiosRequest({
        method: 'GET',
        url: '/familie-ks-mottak/api/task/feilede',
    });
};
