import { configureStore } from '@reduxjs/toolkit';

import todoListReducer from './slices/TodoListSlice';

export default configureStore({
	reducer: {
		todoList: todoListReducer,
	},
});
