import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';
import { checkTodoByIndex, todoAdded, todoRemoved, updateTextByIndex } from '../redux/slices/TodoListSlice';
import { focusTo } from '../utils/textAreaFocus';

const useStyles = createUseStyles({
	todoentry: {
		margin: '10px 50px',
		display: 'flex',
		// alignItems: 'center',
		minHeight: '41px',
	},

	checkbox: {
		width: '21px',
		height: '21px',
		border: '1px solid #AAA',
		borderRadius: '5px',
		margin: '10px',
		flexShrink: 0,
	},

	checkboxChecked: {
		width: '21px',
		height: '21px',
		borderRadius: '5px',
		margin: '10px',
		border: '1px solid #AAA',
		background: '#AAA',
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

export const TodoEntry = (props) => {
	let { checked, texted, idx: index } = props;

	const todoCount = useSelector((state) => state.todoList.length);
	const [check, setCheck] = useState(checked);
	const [text, setText] = useState(texted);

	const [rerendered, setRerendered] = useState(false);
	const [lastEvent, setLastEvent] = useState();

	const classes = useStyles();

	const dispatch = useDispatch();

	const getNextTextArea = (e) => {
		const currentEntry = e.target.closest('#todoEntry');
		const nextEntry = currentEntry.nextElementSibling;
		const nextTextArea = nextEntry.querySelector('textarea');
		return nextTextArea || e;
	};

	const getPrevTextArea = (e) => {
		const currentEntry = e.target.closest('#todoEntry');
		const prevEntry = currentEntry.previousElementSibling;
		const prevTextArea = prevEntry.querySelector('textarea');
		return prevTextArea || e;
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();

			// addTodoList in Redux
			dispatch(todoAdded({ text: '', checked: false, index }));

			// after adding a todo entry, move cursor to the new entry.
			// this is done after rerendering / the new todo entry is rendered with the other entries.
			// for this, we use the useEffect hook with the help of some flags: rerendered & lastEvent

			setRerendered(true);
			setLastEvent(e);
		}

		// backspace
		if (e.key === 'Backspace') {
			if (text.length < 1) {
				e.preventDefault();
				if (index > 0) focusTo(getPrevTextArea(e));
				dispatch(todoRemoved(index));
			}
		}

		// arrow up
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			index > 0 && focusTo(getPrevTextArea(e));
		}

		// arrow down
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			index < todoCount - 1 && focusTo(getNextTextArea(e));
		}
	};

	const handleBlur = (e) => {
		// updateTodoList in Redux
		console.log('blur, saved at index;', index);
		dispatch(updateTextByIndex({ text: e.target.value, index }));
	};

	const handleCheck = () => {
		// check or uncheck the entry
		setCheck(!check);
		// updateTodoList in Redux
		dispatch(checkTodoByIndex({ check: !check, index }));
	};

	const handleEditText = (e) => {
		// update entry text
		setText(e.target.value);
	};

	// dynamically changes the height of the text area by changing the "rows" property
	const adjustSize = (e) => {
		// initially set to 1
		// a new line is added every 142 character.
		e.target.rows = 1 + Math.floor(e.target.value.length / 142);
	};

	// this hook is used solely for delaying the focus after adding a new entry
	useEffect(() => {
		if (rerendered) {
			// only after the document is rendered will the text area of the new entry be focused
			focusTo(getNextTextArea(lastEvent));

			// then reset the flags
			setRerendered(false);
			setLastEvent(null);
		}
	}, [rerendered, lastEvent]);

	return (
		<div className={classes.todoentry} id='todoEntry'>
			{/** checkbox */}
			<div className={check ? classes.checkboxChecked : classes.checkbox} onClick={handleCheck} id='checkBox'></div>

			{/** text */}
			<div className={classes.text} id='textContainer'>
				<textarea
					id={'todoText' + index}
					cols={142}
					rows={1}
					value={text}
					onChange={handleEditText}
					style={{ color: check ? '#AAA' : '#000' }}
					disabled={check}
					onKeyDown={handleKeyPress}
					onBlur={handleBlur}
					onInput={adjustSize}
				/>
			</div>
		</div>
	);
};
