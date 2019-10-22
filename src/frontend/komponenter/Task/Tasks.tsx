import AlertStripe from 'nav-frontend-alertstriper';
import { Systemtittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { RessursStatus } from '../../typer/ressurs';
import { useTaskContext } from '../TaskProvider';
import TaskListe from './TaskListe';

const Tasks: React.FunctionComponent = () => {
    const tasks = useTaskContext().tasks;

    switch (tasks.status) {
        case RessursStatus.SUKSESS:
            return (
                <React.Fragment>
                    <Systemtittel children={'Feilede tasks'} />
                    <br />
                    <TaskListe tasks={tasks.data} />
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
