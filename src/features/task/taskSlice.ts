import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { db } from '../../firebase';
interface TaskState {
  idCount: number;
  tasks: { id: string; title: string; completed: boolean }[];
  selectedTask: { id: string; title: string; completed: boolean };
  isModalOpen: boolean;
}

const initialState: TaskState = {
  idCount: 1,
  tasks: [],
  selectedTask: { id: '0', title: '', completed: false },
  isModalOpen: false,
};

/* ============================
        Taskの全件取得
============================ */
export const fetchTasks = createAsyncThunk('task/getAllTasks', async () => {
  const res = await db.collection('tasks').get();
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
export const createTask = async (submitData: {
  title: string;
  idCount: number;
}): Promise<void> => {
  const { title, idCount } = submitData;
  try {
    await db
      .collection('tasks')
      .doc(`${idCount + 1}`)
      .set({ title: title, completed: false });
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
  try {
    await db
      .collection('tasks')
      .doc(`${id}`)
      .set({ title: title, completed: completed });
  } catch (err) {
    console.error('Error writing document: ', err);
  }
};

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload.id);
    },
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

export const { deleteTask, selectTask, handleModalOpen } = taskSlice.actions;

export const selectIdCount = (state: RootState): number => state.task.idCount;

export default taskSlice.reducer;
