import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from '../../firebase';
interface TaskState {
  idCount: number;
  tasks: { id: string; title: string; completed: boolean }[];
  selectedTask: { id: string; title: string; completed: boolean };
  isModalOpen: boolean;
}

const initialState: TaskState = {
  idCount: 1,
  tasks: [{ id: 'ifjairo', title: 'Task A', completed: false }],
  selectedTask: { id: 'fjiaeohjr', title: '', completed: false },
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
  async (title: string) => {
    try {
      await db.collection('tasks').add({ title: title, completed: false });
    } catch (err) {
      console.error('Error adding document: ', err);
    }
  }
);

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    // createTask: (state, action) => {
    //   state.idCount++;
    //   const newTask = {
    //     id: state.idCount,
    //     title: action.payload,
    //     completed: false,
    //   };
    //   state.tasks = [newTask, ...state.tasks];
    // },
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

export default taskSlice.reducer;
