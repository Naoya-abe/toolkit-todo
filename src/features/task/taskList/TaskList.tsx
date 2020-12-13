import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import TaskItem from '../taskItem/TaskItem';
import { fetchTasks } from '../taskSlice';
import styles from './TaskList.module.scss';

const TaskList: React.FC = () => {
  const { tasks } = useSelector((state: RootState) => state.task);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  return (
    <div className={styles.wrapper}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
