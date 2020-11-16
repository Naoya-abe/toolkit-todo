import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import { RootState } from '../../../app/store';
import { createTask, editTask } from '../taskSlice';
import styles from './TaskForm.module.scss';

type Inputs = {
  taskTitle: string;
};

type PropTypes = {
  edit?: boolean;
};

const TaskForm: React.FC<PropTypes> = ({ edit }) => {
  const dispatch = useDispatch();
  const editData = useSelector((state: RootState) => state.task.selectedTask);
  const { register, handleSubmit, reset } = useForm<Inputs>();

  const handleCreate = (data: Inputs) => {
    dispatch(createTask(data.taskTitle));
    reset();
  };

  const handleEdit = (data: Inputs) => {
    const sendData = { ...editData, title: data.taskTitle };
    dispatch(editTask(sendData));
  };

  return (
    <div className={styles.wrapper}>
      <form
        onSubmit={!edit ? handleSubmit(handleCreate) : handleSubmit(handleEdit)}
        className={styles.form}
      >
        <TextField
          label={!edit ? 'New Task' : editData.title}
          variant="outlined"
          inputRef={register}
          name="taskTitle"
          className={styles.text_field}
        />
        {edit ? (
          <div className={styles.button_wrapper}>
            <button type="submit" className={styles.submit_button}>
              Submit
            </button>
            <button type="button" className={styles.cancel_button}>
              Cancel
            </button>
          </div>
        ) : null}
      </form>
    </div>
  );
};

export default TaskForm;
