import React from 'react';
import { useDispatch } from 'react-redux';
import { completeTask, deleteTask } from '../taskSlice';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import EventNoteIcon from '@material-ui/icons/EventNote';
import styles from './TaskItem.module.scss';

interface PropTypes {
  task: { id: number; title: string; completed: boolean };
}

const TaskItem: React.FC<PropTypes> = ({ task }) => {
  const dispatch = useDispatch();

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <EventNoteIcon />
        <div className={styles.title_text}>{task.title}</div>
      </div>
      <div className={styles.right_item}>
        <Checkbox
          checked={task.completed}
          onClick={() => dispatch(completeTask(task))}
          className={styles.checkbox}
        />
        <button
          onClick={() => dispatch(deleteTask(task))}
          className={styles.button}
        >
          <DeleteIcon className={styles.icon} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
