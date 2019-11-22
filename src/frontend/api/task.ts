import { Ressurs } from '../typer/ressurs';
import { IService } from '../typer/service';
import { IAvvikshåndteringDTO, ITaskDTO, taskStatus } from '../typer/task';
import { axiosRequest } from './axios';

export const hentTasks = (
    valgtService: IService,
    statusFilter: taskStatus
): Promise<Ressurs<ITaskDTO[]>> => {
    return axiosRequest({
        headers: {
            status: statusFilter,
        },
        method: 'GET',
        url: `${valgtService.proxyPath}/task`,
    });
};

export const rekjørTask = (
    valgtService: IService,
    statusFilter: taskStatus,
    taskId?: string
): Promise<Ressurs<ITaskDTO[]>> => {
    if (taskId) {
        return axiosRequest({
            method: 'PUT',
            url: `${valgtService.proxyPath}i/task/rekjor${taskId ? `?taskId=${taskId}` : ''}`,
        });
    } else {
        return axiosRequest({
            headers: {
                status: statusFilter,
            },
            method: 'PUT',
            url: `${valgtService.proxyPath}i/task/rekjorAlle`,
        });
    }
};

export const avvikshåndterTask = (
    valgtService: IService,
    avvikshåndteringDTO: IAvvikshåndteringDTO
): Promise<Ressurs<ITaskDTO[]>> => {
    return axiosRequest({
        data: {
            avvikstype: avvikshåndteringDTO.avvikstype,
            årsak: avvikshåndteringDTO.årsak,
        },
        method: 'PUT',
        url: `${valgtService.proxyPath}i/task/avvikshaandter?taskId=${avvikshåndteringDTO.taskId}`,
    });
};
