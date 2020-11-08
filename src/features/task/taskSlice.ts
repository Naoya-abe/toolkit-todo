import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface TaskState {
  idCount: number;
  tasks: { id: number; title: string; completed: boolean }[];
}

const initialState: TaskState = {
  idCount: 1,
  tasks: [{ id: 1, title: 'Task A', completed: false }],
};

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    createTask: (state, action) => {
      state.idCount++;
      const newTask = {
        id: state.idCount,
        title: action.payload,
        completed: false,
      };
      state.tasks = [newTask, ...state.tasks];
    },
    completeTask: (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.completed = !task.completed;
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload.id);
    },
  },
});

export const { createTask, completeTask, deleteTask } = taskSlice.actions;

export const selectTasks = (state: RootState) => state.task.tasks;

export default taskSlice.reducer;
