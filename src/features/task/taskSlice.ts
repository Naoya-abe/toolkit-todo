import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface TaskState {
  tasks: { id: number; title: string; completed: boolean }[];
  selectedTask: { id: number; title: string; completed: boolean };
  isModalOpen: boolean;
}

interface TaskTypes {
  id: number;
  title: string;
  completed: boolean;
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: { id: 0, title: '', completed: false },
  isModalOpen: false,
};

const apiUrl = 'http://localhost:3001/tasks';

/* ============================
      Taskの全件取得
============================ */
export const fetchTasks = createAsyncThunk('task/getAllTasks', async () => {
  const res = await axios.get(apiUrl);
  return res.data;
});

/* ============================
      Taskの投稿
============================ */
export const createTask = createAsyncThunk(
  'task/postTask',
  async (title: string) => {
    const params = { title: title, completed: false };
    const res = await axios.post(apiUrl, params);
    return res.data;
  }
);

/* ============================
      Taskのtitle編集
============================ */
export const editTaskTitle = createAsyncThunk(
  'task/EditTaskTitle',
  async (data: TaskTypes) => {
    const res = await axios.patch(`${apiUrl}/${data.id}`, data);
    return res.data;
  }
);

/* ============================
      Taskのcompleted編集
============================ */
export const editTaskCompleted = createAsyncThunk(
  'task/EditTaskCompleted',
  async (data: TaskTypes) => {
    const completed = !data.completed;
    const res = await axios.patch(`${apiUrl}/${data.id}`, { completed });
    return res.data;
  }
);

/* ============================
      Taskの削除
============================ */
export const deleteTask = createAsyncThunk(
  'task/DeleteTask',
  async (data: TaskTypes) => {
    await axios.delete(`${apiUrl}/${data.id}`);
    return data;
  }
);

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
      state.tasks = action.payload;
    });
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.tasks = [...state.tasks, action.payload];
    });
    builder.addCase(editTaskTitle.fulfilled, (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.title = action.payload.title;
      }
    });
    builder.addCase(editTaskCompleted.fulfilled, (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.completed = action.payload.completed;
      }
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload.id);
    });
  },
});

export const { selectTask, handleModalOpen } = taskSlice.actions;

export default taskSlice.reducer;
