import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
// import { useDispatch, useSelector } from 'react-redux';
import { useYContext } from './YContext';
import * as Y from 'yjs';
import { v4 } from 'uuid';

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
	let { checked, texted, idx: index, color } = props;

	const { todosArray, awareness } = useYContext();

	const [rerendered, setRerendered] = useState({ rerendered: false, lastEvent: null });

	const classes = useStyles();

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

	const setYArrayElementAtIndex = (index, value) => {
		const ymap = todosArray.get(index);
		if (ymap) {
			const oldValue = ymap.get('value');
			ymap.set('value', { ...oldValue, ...value });
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();

			// addTodoList in Redux
			const toBeInsertedIndex = index + 1;

			// todosArray.insert(toBeInsertedIndex, [{ text: '', checked: false, toBeInsertedIndex, id: uuidv4() }]);

			const newYmap = new Y.Map();
			newYmap.set('value', { text: '', checked: false, index: todosArray.toArray().length, id: v4() });
			todosArray.insert(toBeInsertedIndex, [newYmap]);

			// after adding a todo entry, move cursor to the new entry.
			// this is done after rerendering / the new todo entry is rendered with the other entries.
			// for this, we use the useEffect hook with the help of some flags: rerendered & lastEvent

			setRerendered({ rerendered: true, lastEvent: e });
		}

		// backspace
		if (e.key === 'Backspace') {
			if (texted.length < 1) {
				e.preventDefault();
				if (index >= 0) {
					// if the current entry is the first entry, then focus on the next entry
					if (index === 0) {
						// if the current entry is the only entry, then don't focus on anything
						if (todosArray.length === 1) {
							e.target.blur();
						} else {
							const currentTextArea = getNextTextArea(e);
							currentTextArea.focus();
						}
					} else {
						const currentTextArea = getPrevTextArea(e);
						currentTextArea.focus();
					}

					todosArray.delete(index, 1);
					setRerendered({ rerendered: true, lastEvent: e });
				}
			}
		}

		// arrow up
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (index > 0) {
				const currentTextArea = getPrevTextArea(e);
				currentTextArea.focus();
			}
		}

		// arrow down
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (index < todosArray.length - 1) {
				const currentTextArea = getNextTextArea(e);
				currentTextArea.focus();
			}
		}
	};

	const handleBlur = (e) => {
		setYArrayElementAtIndex(index, { text: e.target.value });
	};

	const handleFocus = (e) => {
		e.target.setSelectionRange(e.target.value.length, e.target.value.length);
		awareness.setLocalStateField('focusing', { index: index, color: awareness.getLocalState().usercolor });
		// rerender
		setRerendered({ rerendered: true, lastEvent: e });
	};

	const handleCheck = () => {
		// check or uncheck the entry
		setYArrayElementAtIndex(index, { checked: !checked });
	};

	const handleEditText = (e) => {
		setYArrayElementAtIndex(index, { text: e.target.value });
	};

	// dynamically changes the height of the text area by changing the "rows" property
	const adjustSize = (e) => {
		// initially set to 1
		// a new line is added every 142 character.
		e.target.rows = 1 + Math.floor(e.target.value.length / 142);
	};

	// this hook is used solely for delaying the focus after adding a new entry
	useEffect(() => {
		if (rerendered.rerendered) {
			// only after the document is rendered will the text area of the new entry be focused
			if (rerendered.lastEvent.key === 'Enter') {
				const currentTextArea = getNextTextArea(rerendered.lastEvent);
				currentTextArea.focus();
				currentTextArea.setSelectionRange(currentTextArea.value.length, currentTextArea.value.length);
			}
			// else if (rerendered.lastEvent.key === 'Backspace') {
			// 	if (index === 0) {
			// 		getNextTextArea(rerendered.lastEvent).focus();
			// 	}
			// }

			// then reset the flags
			setRerendered({ rerendered: false, lastEvent: null });
		}
	}, [rerendered]);

	return (
		<div className={classes.todoentry} id='todoEntry'>
			{/** checkbox */}
			<div className={checked ? classes.checkboxChecked : classes.checkbox} onClick={handleCheck} id='checkBox'></div>

			{/** text */}
			<div className={classes.text} id='textContainer'>
				<textarea
					id={'todoText' + index}
					cols={142}
					rows={1}
					value={texted}
					onChange={handleEditText}
					style={{ color: checked ? '#AAA' : color }}
					disabled={checked}
					onKeyDown={handleKeyPress}
					onBlur={handleBlur}
					onInput={adjustSize}
					onFocus={handleFocus}
					spellCheck='false'
				/>
			</div>
		</div>
	);
};
