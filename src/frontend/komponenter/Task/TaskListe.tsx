import * as moment from 'moment';
import AlertStripe from 'nav-frontend-alertstriper';
import * as React from 'react';
import { ITaskDTO } from '../../typer/task';
import TaskPanel from './TaskPanel';

interface IProps {
    tasksDTO: ITaskDTO[];
}

const TaskListe: React.StatelessComponent<IProps> = ({ tasksDTO }) => {
    return (
        <React.Fragment>
            {tasksDTO.length > 0 ? (
                tasksDTO
                    .sort((a, b) =>
                        moment(b.task.opprettetTidspunkt).diff(a.task.opprettetTidspunkt)
                    )
                    .map(taskDTO => {
                        return <TaskPanel key={taskDTO.task.id} taskDTO={taskDTO} />;
                    })
            ) : (
                <AlertStripe type={'info'} children={'Ingen feilede tasks'} />
            )}
        </React.Fragment>
    );
};

export default TaskListe;
