import React from 'react';
import { useSelector } from 'react-redux';
import TaskItem from '../taskItem/TaskItem';
import { selectTasks } from '../taskSlice';
import styles from './TaskList.module.scss';

const TaskList: React.FC = () => {
  const tasks = useSelector(selectTasks);
  return (
    <div className={styles.wrapper}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
