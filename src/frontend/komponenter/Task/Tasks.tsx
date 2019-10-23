import AlertStripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import { Systemtittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { RessursStatus } from '../../typer/ressurs';
import { actions, useTaskContext, useTaskDispatch } from '../TaskProvider';
import TaskListe from './TaskListe';

const Tasks: React.FunctionComponent = () => {
    const tasks = useTaskContext().tasks;
    const tasksDispatcher = useTaskDispatch();

    switch (tasks.status) {
        case RessursStatus.SUKSESS:
            return (
                <React.Fragment>
                    <div className={'tasks__topbar'}>
                        <Systemtittel children={'Feilede tasks'} />
                        <Knapp
                            onClick={() =>
                                tasksDispatcher({ payload: true, type: actions.REKJØR_ALLE_TASKS })
                            }
                        >
                            Rekjør alle tasks
                        </Knapp>
                    </div>
                    <br />
                    <TaskListe tasksDTO={tasks.data} />
                </React.Fragment>
            );
        case RessursStatus.HENTER:
            return <AlertStripe children={`Laster feilede tasker`} type={'info'} />;
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
