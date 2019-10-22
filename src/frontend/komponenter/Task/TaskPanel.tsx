import * as classNames from 'classnames';
import * as moment from 'moment';
import { Knapp } from 'nav-frontend-knapper';
import PanelBase from 'nav-frontend-paneler';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { ITask, taskStatusTekster, taskTypeTekster } from '../../typer/task';

interface IProps {
    task: ITask;
}

const TaskPanel: React.StatelessComponent<IProps> = ({ task }) => {
    return (
        <PanelBase className={'taskpanel'} border={true}>
            <div className={classNames('taskpanel__status', task.status)}>
                <Element children={taskStatusTekster[task.status]} />
            </div>
            <Knapp mini={true} className={'taskpanel__rekjør'}>
                Rekjør
            </Knapp>

            <div className={'taskpanel__innhold'}>
                <Undertittel children={taskTypeTekster[task.type]} />
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
