import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import { RootState } from '../../app/store';
import { db } from '../../firebase';
interface TaskState {
  idCount: number;
  tasks: { id: string; title: string; completed: boolean }[];
  selectedTask: {
    id: string;
    title: string;
    completed: boolean;
  };
  isModalOpen: boolean;
}

const initialState: TaskState = {
  idCount: 1,
  tasks: [],
  selectedTask: { id: '', title: '', completed: false },
  isModalOpen: false,
};

/* ============================
        Taskの全件取得
============================ */
export const fetchTasks = createAsyncThunk('task/getAllTasks', async () => {
  const res = await db.collection('tasks').orderBy('dateTime', 'desc').get();
  const allTasks = res.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    completed: doc.data().completed,
  }));
  const taskNumber = allTasks.length;
  const passData = { allTasks, taskNumber };
  return passData;
});

/* ============================
          Taskの作成
============================ */
export const createTask = async (title: string): Promise<void> => {
  try {
    const dateTime = firebase.firestore.Timestamp.fromDate(new Date());
    await db
      .collection('tasks')
      .add({ title: title, completed: false, dateTime });
  } catch (err) {
    console.error('Error writing document: ', err);
  }
};

/* ============================
          Taskの編集
============================ */
export const editTask = async (submitData: {
  id: string;
  title: string;
  completed: boolean;
}): Promise<void> => {
  const { id, title, completed } = submitData;
  const dateTime = firebase.firestore.Timestamp.fromDate(new Date());
  try {
    await db
      .collection('tasks')
      .doc(id)
      .set({ title, completed, dateTime }, { merge: true });
  } catch (err) {
    console.error('Error writing document: ', err);
  }
};

/* ============================
          Taskの削除
============================ */
export const deleteTask = async (id: string): Promise<void> => {
  try {
    await db.collection('tasks').doc(id).delete();
  } catch (err) {
    console.error('Error removing document: ', err);
  }
};

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    handleModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload.allTasks;
      state.idCount = action.payload.taskNumber;
    });
  },
});

export const { selectTask, handleModalOpen } = taskSlice.actions;

export const selectIdCount = (state: RootState): number => state.task.idCount;

export default taskSlice.reducer;
