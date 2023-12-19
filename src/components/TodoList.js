import { createUseStyles } from 'react-jss';
// import { todoAdded } from '../redux/slices/TodoListSlice';
import { TodoEntry } from './TodoEntry';
import { useEffect, useState } from 'react';
import { useYContext } from './YContext';
import { v4 } from 'uuid';
import * as Y from 'yjs';
// yjs

const useStyles = createUseStyles({
	body: {
		overflowY: 'auto',
		height: 'calc(100vh - 55px)',
	},

	todoentry: {
		margin: '10px 50px',
		display: 'flex',
		// alignItems: 'center',
		minHeight: '41px',
		opacity: 0,

		'&:hover': {
			opacity: 0.7,
		},
	},

	checkbox: {
		width: '21px',
		height: '21px',
		border: '1px solid #AAA',
		borderRadius: '5px',
		margin: '10px',
		flexShrink: 0,
	},

	text: {
		marginTop: '10px',
		display: 'flex',
		height: '100%',
		alignItems: 'center',
		flex: 1,

		'& > textarea': {
			// color: 'red',
			border: 'none',
			outline: 'none',
			resize: 'none',
			flex: 1,

			'&:disabled': {
				backgroundColor: '#0000',
				// fontWeight: 600,
			},
		},
	},
});

const TodoList = () => {
	const classes = useStyles();

	const { todosArray, connected, awareness } = useYContext();

	// const indexToColor :
	// {index: Number,
	// color: String}[]
	const [someState, setSomeState] = useState(false);

	const [colorArray, setColorArray] = useState([]);

	const [nameTagArray, setNametagArray] = useState([]);

	const [rerendered, setRerendered] = useState({ rerendered: false, lastEvent: null });

	// const [todoList, setTodoList] = useState([]);

	const addTodo = (e) => {
		// todosArray.push([{ text: '', checked: false, index: todosArray.toArray().length, id: v4() }]);

		// const newYmap = ydoc.getMap('arraymember');
		const newYmap = new Y.Map();
		newYmap.set('value', { text: '', checked: false, index: todosArray.toArray().length, id: v4() });
		// console.log('🚀 ~ file: TodoList.js:74 ~ addTodo ~ newYmap:', newYmap.get('value'));
		todosArray.push([newYmap]);
		// console.log('🚀 ~ file: TodoList.js:75 ~ addTodo ~ todosArray:', todosArray.toArray());

		setRerendered({ rerendered: true, lastEvent: e });
	};

	const getNewTextArea = (e) => {
		const currentEntry = e.target.closest('#shadowEntry');
		const newEntry = currentEntry.previousElementSibling;
		const newTextArea = newEntry.querySelector('textarea');
		return newTextArea || e;
	};

	useEffect(() => {
		// console.log('TodoList: useEffect called', todosArray?.toArray());
		if (todosArray) {
			const observer = (update) => {
				// console.log('🚀 ~ file: TodoList.js:89 ~ observer ~ update:', update[0].changes);
				// call a function to force render the page
				// console.log('rerendering todolist');
				setSomeState(!someState);
				// console.log('observer called and rerendering');
			};

			todosArray.observeDeep(observer);

			return () => {
				todosArray.unobserveDeep(observer);
			};
		}
	}, [someState, todosArray, connected]);

	useEffect(() => {
		if (rerendered.rerendered) {
			getNewTextArea(rerendered.lastEvent).focus();
			setRerendered({ rerendered: false, lastEvent: null });
		}
	}, [rerendered, todosArray]);

	useEffect(() => {
		if (awareness) {
			const createColorArray = () => {
				const inputArray = Array.from(awareness.getStates().values());
				const mappedArray = inputArray
					.filter((item) => 'focusing' in item)
					.map((item) => ({ index: item.focusing.index, color: item.usercolor }));
				// console.log('🚀 ~ file: TodoList.js:130 ~ mappedArray ~ mappedArray:', mappedArray);
				const colorArray = mappedArray.reduce((result, { index, color }) => {
					result[index] = color;
					return result;
				}, Array(todosArray.toArray().length).fill(null));

				setColorArray(colorArray);
			};

			const createNameTagArray = () => {
				const inputArray = Array.from(awareness.getStates().values());
				const mappedArray = inputArray
					.filter((item) => 'nametag' in item)
					.map((item) => ({ index: item.nametag.index, element: item.nametag.element }));
				// console.log('🚀 ~ file: TodoList.js:142 ~ createNameTagArray ~ mappedArray:', mappedArray);

				const nametagArray = mappedArray.reduce((result, { index, element }) => {
					result[index] = element;
					return result;
				}, Array(todosArray.toArray().length).fill(null));
				console.log('🚀 ~ file: TodoList.js:150 ~ nametagArray ~ nametagArray:', nametagArray);

				setNametagArray(nametagArray);
			};

			awareness.on('change', () => {
				console.log(Array.from(awareness.getStates().values()));

				createColorArray();
				createNameTagArray();
			});
		}
	}, [awareness, todosArray]);

	// if (todosArray) {
	// 	console.log('rerendered', todosArray.toArray());
	// }

	// console.log('🚀 ~ file: TodoList.js:135 ~ TodoList ~ todoList:', todosArray.toArray());

	if (todosArray) {
		return (
			<div className={classes.body}>
				{todosArray.toArray().map((ymap, index) => {
					const entry = ymap.get('value');
					return (
						<TodoEntry
							texted={entry.text}
							checked={entry.checked}
							idx={index}
							key={entry.id}
							color={colorArray[index]}
							nametag={nameTagArray[index]}
						/>
					);
				})}

				<div className={classes.todoentry} onClick={addTodo} id='shadowEntry'>
					<div className={classes.checkbox}></div>

					<div className={classes.text}>
						<textarea id={`todoText${todosArray.length}`} cols={142} rows={1} />
					</div>
				</div>
			</div>
		);
	}
};

// const mapStateToProps = (state) => ({
// 	todoList: state.todoList,
// });

// export default connect(mapStateToProps)(TodoList);

export default TodoList;
