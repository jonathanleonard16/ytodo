import { createSlice } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

const initialState = [
	// {
	// 	text: 'walk the dog',
	// 	checked: false,
	// 	id: v4(),
	// },
	// {
	// 	text: 'clean the car',
	// 	checked: false,
	// 	id: v4(),
	// },
];

const todoListSlice = createSlice({
	name: 'todoList',
	initialState,
	reducers: {
		todoAdded(state, action) {
			const indexToInsert = action.payload.index + 1;
			if (indexToInsert === state.length) {
				console.log('pushed');
				state.push({ ...action.payload, id: v4() });
			} else {
				console.log('inserted at', indexToInsert);
				let newArray = [
					...state.slice(0, indexToInsert),
					{ text: action.payload.text, checked: action.payload.checked, id: v4() },
					...state.slice(indexToInsert),
				];
				console.log('🚀 ~ file: TodoListSlice.js:37 ~ todoAdded ~ newArray:', newArray);
				// state.splice(indexToInsert, 0, { text: action.payload.text, checked: action.payload.checked, id: v4() });
				return newArray;
			}
		},

		todoUpdated(state, action) {
			state = action.payload;
		},

		checkTodoByIndex(state, action) {
			state[action.payload.index].checked = action.payload.check;
		},

		updateTextByIndex(state, action) {
			state[action.payload.index].text = action.payload.text;
		},

		todoRemoved(state, action) {
			const indexToRemove = action.payload;
			state.splice(indexToRemove, 1);
		},
	},
});

export const { todoAdded, todoUpdated, checkTodoByIndex, updateTextByIndex, todoRemoved } = todoListSlice.actions;

export default todoListSlice.reducer;
