import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import TaskItem from '../taskItem/TaskItem';
import styles from './TaskList.module.scss';

const TaskList: React.FC = () => {
  const { tasks } = useSelector((state: RootState) => state.task);

  return (
    <div className={styles.wrapper}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
