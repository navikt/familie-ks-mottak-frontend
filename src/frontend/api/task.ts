import { Ressurs } from '../typer/ressurs';
import { IAvvikshåndteringDTO, ITaskDTO, taskStatus } from '../typer/task';
import { axiosRequest } from './axios';

export const hentTasks = (statusFilter: taskStatus): Promise<Ressurs<ITaskDTO[]>> => {
    return axiosRequest({
        headers: {
            status: statusFilter,
        },
        method: 'GET',
        url: `/familie-ks-mottak/api/task`,
    });
};

export const rekjørTask = (
    statusFilter: taskStatus,
    taskId?: string
): Promise<Ressurs<ITaskDTO[]>> => {
    if (taskId) {
        return axiosRequest({
            method: 'PUT',
            url: `/familie-ks-mottak/api/task/rekjor${taskId ? `?taskId=${taskId}` : ''}`,
        });
    } else {
        return axiosRequest({
            headers: {
                status: statusFilter,
            },
            method: 'PUT',
            url: `/familie-ks-mottak/api/task/rekjorAlle`,
        });
    }
};

export const avvikshåndterTask = (
    avvikshåndteringDTO: IAvvikshåndteringDTO
): Promise<Ressurs<ITaskDTO[]>> => {
    return axiosRequest({
        data: {
            avvikstype: avvikshåndteringDTO.avvikstype,
            årsak: avvikshåndteringDTO.årsak,
        },
        method: 'PUT',
        url: `/familie-ks-mottak/api/task/avvikshaandter?taskId=${avvikshåndteringDTO.taskId}`,
    });
};
