import { createUseStyles } from 'react-jss';
import { todoAdded } from '../redux/slices/TodoListSlice';
import { TodoEntry } from './TodoEntry';
import { connect, useDispatch } from 'react-redux';
import { focusTo } from '../utils/textAreaFocus';
import { useEffect, useState } from 'react';

const useStyles = createUseStyles({
	body: {
		overflowY: 'scroll',
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

const TodoList = (props) => {
	const { todoList } = props;
	const classes = useStyles();
	const dispatch = useDispatch();

	const [rerendered, setRerendered] = useState(false);
	const [lastEvent, setLastEvent] = useState();

	const addTodo = (e) => {
		dispatch(todoAdded({ text: '', checked: false, index: props.todoList.length - 1 }));

		setRerendered(true);
		setLastEvent(e);
	};

	const getNewTextArea = (e) => {
		const currentEntry = e.target.closest('#shadowEntry');
		const newEntry = currentEntry.previousElementSibling;
		const newTextArea = newEntry.querySelector('textarea');
		console.log('🚀 ~ file: TodoList.js:68 ~ getNewTextArea ~ newTextArea:', newTextArea);
		return newTextArea || e;
	};

	// this hook is used solely for delaying the focus after adding a new entry
	useEffect(() => {
		if (rerendered) {
			// only after the document is rendered will the text area of the new entry be focused
			focusTo(getNewTextArea(lastEvent));

			// then reset the flags
			setRerendered(false);
			setLastEvent(null);
		}
	}, [rerendered, lastEvent]);

	return (
		<div className={classes.body}>
			{todoList.map((entry, index) => (
				<TodoEntry texted={entry.text} checked={entry.checked} idx={index} key={entry.id} />
			))}

			<div className={classes.todoentry} onClick={addTodo} id='shadowEntry'>
				<div className={classes.checkbox}></div>

				<div className={classes.text}>
					<textarea id={`todoText${todoList.length}`} cols={142} rows={1} />
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	todoList: state.todoList,
});

export default connect(mapStateToProps)(TodoList);
