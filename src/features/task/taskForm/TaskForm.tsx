import React from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import { createTask } from '../taskSlice';
import styles from './TaskForm.module.scss';

type Inputs = {
  NewTask: string;
};

const TaskForm: React.FC = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm<Inputs>();

  const createNewTask = (data: Inputs) => {
    dispatch(createTask(data.NewTask));
    reset();
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit(createNewTask)} className={styles.form}>
        <TextField
          label="New Task"
          variant="outlined"
          inputRef={register}
          name="NewTask"
          className={styles.text_field}
        />
      </form>
    </div>
  );
};

export default TaskForm;
