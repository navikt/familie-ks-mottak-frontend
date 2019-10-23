import { Ressurs } from '../typer/ressurs';
import { ITaskDTO } from '../typer/task';
import { axiosRequest } from './axios';

export const hentTasks = (): Promise<Ressurs<ITaskDTO[]>> => {
    return axiosRequest({
        method: 'GET',
        url: '/familie-ks-mottak/api/task/feilede',
    });
};

export const rekjørTask = (taskId?: string): Promise<Ressurs<ITaskDTO[]>> => {
    return axiosRequest({
        method: 'PUT',
        url: `/familie-ks-mottak/api/task/rekjor${taskId ? `?taskId=${taskId}` : ''}`,
    });
};
