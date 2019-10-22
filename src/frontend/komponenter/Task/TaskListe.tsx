import * as React from 'react';
import { ITask } from '../../typer/task';
import TaskPanel from './TaskPanel';

interface IProps {
    tasks: ITask[];
}

const TaskListe: React.StatelessComponent<IProps> = ({ tasks }) => {
    return (
        <React.Fragment>
            {tasks.map(task => {
                return <TaskPanel key={task.id} task={task} />;
            })}
        </React.Fragment>
    );
};

export default TaskListe;
