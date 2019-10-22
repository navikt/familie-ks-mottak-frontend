import { Ressurs } from '../typer/ressurs';
import { ISaksbehandler } from '../typer/saksbehandler';
import { ITask } from '../typer/task';
import { axiosRequest } from './axios';

export const hentTasks = (innloggetSaksbehandler?: ISaksbehandler): Promise<Ressurs<ITask[]>> => {
    return axiosRequest(
        {
            method: 'GET',
            url: '/familie-ks-mottak/api/task',
        },
        innloggetSaksbehandler
    );
};
