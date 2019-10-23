import { AxiosError } from 'axios';
import * as React from 'react';
import { hentTasks, rekjørTask } from '../api/task';
import { byggFeiletRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { ITaskDTO } from '../typer/task';

export enum actions {
    HENT_TASKS = 'HENT_TASKS',
    HENT_TASKS_FEILET = 'HENT_TASKS_FEILET',
    HENT_TASKS_SUKSESS = 'HENT_TASKS_SUKSESS',
    REKJØR_ALLE_TASKS = 'REKJØR_ALLE_TASKS',
    REKJØR_TASK = 'REKJØR_TASK',
}

interface IAction {
    payload?: any;
    type: actions;
}

type Dispatch = (action: IAction) => void;

interface IState {
    rekjørAlle: boolean;
    rekjørId: string;
    tasks: Ressurs<ITaskDTO[]>;
}

const TaskStateContext = React.createContext<IState | undefined>(undefined);
const TaskDispatchContext = React.createContext<Dispatch | undefined>(undefined);

const TaskReducer = (state: IState, action: IAction): IState => {
    switch (action.type) {
        case actions.HENT_TASKS: {
            return {
                ...state,
                tasks: {
                    status: RessursStatus.HENTER,
                },
            };
        }
        case actions.HENT_TASKS_SUKSESS: {
            return {
                ...state,
                tasks: action.payload,
            };
        }
        case actions.HENT_TASKS_FEILET: {
            return {
                ...state,
                tasks: action.payload,
            };
        }
        case actions.REKJØR_ALLE_TASKS: {
            return {
                ...state,
                rekjørAlle: action.payload,
            };
        }
        case actions.REKJØR_TASK: {
            return {
                ...state,
                rekjørId: action.payload,
            };
        }
        default: {
            throw new Error(`Uhåndtert action type: ${action.type}`);
        }
    }
};

const TaskProvider: React.StatelessComponent = ({ children }) => {
    const [state, dispatch] = React.useReducer(TaskReducer, {
        rekjørAlle: false,
        rekjørId: '',
        tasks: byggTomRessurs<ITaskDTO[]>(),
    });

    React.useEffect(() => {
        dispatch({ type: actions.HENT_TASKS });
        hentTasks()
            .then((tasks: Ressurs<ITaskDTO[]>) => {
                dispatch({
                    payload: tasks,
                    type: actions.HENT_TASKS_SUKSESS,
                });
            })
            .catch((error: AxiosError) => {
                dispatch({
                    payload: byggFeiletRessurs('Ukent feil ved innhenting av Task', error),
                    type: actions.HENT_TASKS_FEILET,
                });
            });
    }, []);

    React.useEffect(() => {
        if (state.rekjørAlle || state.rekjørId !== '') {
            rekjørTask(!state.rekjørAlle ? state.rekjørId : '')
                .then((tasks: Ressurs<ITaskDTO[]>) => {
                    dispatch({
                        payload: tasks,
                        type: actions.HENT_TASKS_SUKSESS,
                    });
                })
                .catch((error: AxiosError) => {
                    dispatch({
                        payload: byggFeiletRessurs('Ukent feil ved innhenting av Task', error),
                        type: actions.HENT_TASKS_FEILET,
                    });
                });

            dispatch({
                payload: '',
                type: actions.REKJØR_TASK,
            });

            dispatch({
                payload: false,
                type: actions.REKJØR_ALLE_TASKS,
            });
        }
    }, [state.rekjørId, state.rekjørAlle]);

    return (
        <TaskStateContext.Provider value={state}>
            <TaskDispatchContext.Provider value={dispatch}>{children}</TaskDispatchContext.Provider>
        </TaskStateContext.Provider>
    );
};

const useTaskContext = () => {
    const context = React.useContext(TaskStateContext);
    if (context === undefined) {
        throw new Error('useTaskContext må brukes inne i en TaskContext');
    }
    return context;
};

const useTaskDispatch = () => {
    const context = React.useContext(TaskDispatchContext);
    if (context === undefined) {
        throw new Error('useTaskDispatch må brukes inne i en TaskContext');
    }
    return context;
};

export { TaskProvider, useTaskContext, useTaskDispatch };
