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
export const createTask = createAsyncThunk(
  'task/postTask',
  async (submitData: { title: string; idCount: number }) => {
    const { title, idCount } = submitData;
    try {
      await db
        .collection('tasks')
        .doc(`${idCount + 1}`)
        .set({ title: title, completed: false });
      return title;
    } catch (err) {
      console.error('Error writing document: ', err);
    }
  }
);

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    completeTask: (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.completed = !task.completed;
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload.id);
    },
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    editTask: (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.title = action.payload.title;
      }
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
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.idCount++;
      const newTask = {
        id: String(state.idCount),
        title: action.payload || '',
        completed: false,
      };
      state.tasks = [...state.tasks, newTask];
    });
  },
});

export const {
  // createTask,
  completeTask,
  deleteTask,
  selectTask,
  editTask,
  handleModalOpen,
} = taskSlice.actions;

export const selectIdCount = (state: RootState): number => state.task.idCount;

export default taskSlice.reducer;
