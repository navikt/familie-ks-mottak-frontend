import AlertStripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import { Select } from 'nav-frontend-skjema';
import { Systemtittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { RessursStatus } from '../../typer/ressurs';
import { taskStatus } from '../../typer/task';
import { actions, useTaskContext, useTaskDispatch } from '../TaskProvider';
import TaskListe from './TaskListe';

const Tasks: React.FunctionComponent = () => {
    const tasks = useTaskContext().tasks;
    const statusFilter = useTaskContext().statusFilter;
    const tasksDispatcher = useTaskDispatch();

    switch (tasks.status) {
        case RessursStatus.SUKSESS:
            return (
                <React.Fragment>
                    <div className={'tasks__topbar'}>
                        <Systemtittel children={'Tasks'} />

                        {statusFilter === taskStatus.FEILET && (
                            <Knapp
                                mini={true}
                                onClick={() =>
                                    tasksDispatcher({
                                        payload: true,
                                        type: actions.REKJØR_ALLE_TASKS,
                                    })
                                }
                            >
                                Rekjør alle tasks
                            </Knapp>
                        )}

                        <Select
                            onChange={event =>
                                tasksDispatcher({
                                    payload: event.target.value,
                                    type: actions.SETT_FILTER,
                                })
                            }
                            value={statusFilter}
                            label={'Vis saker med status'}
                        >
                            {Object.keys(taskStatus).map(status => {
                                return (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                );
                            })}
                        </Select>
                    </div>

                    <br />
                    <TaskListe tasksDTO={tasks.data} />
                </React.Fragment>
            );
        case RessursStatus.HENTER:
            return <AlertStripe children={`Laster tasker`} type={'info'} />;
        case RessursStatus.FEILET:
            return (
                <AlertStripe
                    children={`Innhenting av feilede tasker feilet. Feilmelding: ${tasks.melding}`}
                    type={'feil'}
                />
            );
        default:
            return <div />;
    }
};

export default Tasks;
