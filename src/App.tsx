import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TaskList from './features/task/taskList/TaskList';
import Header from './components/header/Header';
import styles from './App.module.scss';
import { AppDispatch } from './app/store';
import { fetchTasks } from './features/task/taskSlice';
import TaskForm from './features/task/taskForm/TaskForm';
import { auth } from './firebase';

const App: React.FC = (props: any) => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      !user && props.history.push('user-auth');
    });
    return () => unSub();
  }, []);

  useEffect(() => {
    const unSub = () => {
      dispatch(fetchTasks());
    };
    return () => unSub();
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <Header />
        <TaskForm />
        <TaskList />
      </div>
    </div>
  );
};

export default App;
