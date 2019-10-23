import * as classNames from 'classnames';
import * as moment from 'moment';
import { Knapp } from 'nav-frontend-knapper';
import PanelBase from 'nav-frontend-paneler';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { ITaskDTO, taskStatusTekster, taskTypeTekster } from '../../typer/task';
import { actions, useTaskDispatch } from '../TaskProvider';

interface IProps {
    taskDTO: ITaskDTO;
}

const TaskPanel: React.StatelessComponent<IProps> = ({ taskDTO }) => {
    const tasksDispatcher = useTaskDispatch();
    const task = taskDTO.task;

    return (
        <PanelBase className={'taskpanel'} border={true}>
            <div className={classNames('taskpanel__status', task.status)}>
                <Element children={taskStatusTekster[task.status]} />
            </div>
            <Knapp
                mini={true}
                onClick={() => tasksDispatcher({ payload: task.id, type: actions.REKJØR_TASK })}
                className={'taskpanel__rekjør'}
            >
                Rekjør
            </Knapp>

            <div className={'taskpanel__innhold'}>
                <Undertittel children={`#${task.id}: ${taskTypeTekster[task.type]}`} />
                <Normaltekst children={`Søkers fødselsnummer: ${taskDTO.søkerFødselsnummer}`} />
                <Normaltekst
                    children={`Journalpost: ${
                        taskDTO.journalpostID ? taskDTO.journalpostID : 'ukjent'
                    }`}
                />
                <Normaltekst
                    children={`Saksnummer: ${taskDTO.saksnummer ? taskDTO.saksnummer : 'ukjent'}`}
                />
            </div>

            <div className={'taskpanel__metadata'}>
                <Normaltekst
                    children={moment(task.opprettetTidspunkt).format('DD.MM.YYYY HH:mm')}
                />
            </div>
        </PanelBase>
    );
};

export default TaskPanel;
