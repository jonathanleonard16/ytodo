import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
// import { useDispatch, useSelector } from 'react-redux';
import { useYContext } from './YContext';
import * as Y from 'yjs';
import { v4 } from 'uuid';

const useStyles = createUseStyles({
	todoentry: {
		margin: '20px 50px',
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
		position: 'relative',

		'& > textarea': {
			// color: 'red',
			border: 'none',
			outline: 'none',
			resize: 'none',
			maxWidth: '100%',
			flex: 1,

			// height: '45px',
			height: 'auto',

			fontSize: '17px',
			// fontFamily: 'Arial',

			'&:disabled': {
				backgroundColor: '#0000',
				// fontWeight: 600,
			},
		},
		'& .nametag': {
			position: 'absolute',

			fontSize: '9px',
			// backgroundColor: '#000',
			color: '#AAA',
			padding: '3px 5px',
			borderRadius: '3px',
			zIndex: 3,
			top: '-25px',
		},
	},
});

export const TodoEntry = (props) => {
	let { checked, texted, idx: index, info } = props;

	// info: {name: String, color: String, style: {backgroundColor: String, color: String, top: String, left: String}}

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
							currentTextArea.setSelectionRange(currentTextArea.value.length, currentTextArea.value.length);
						}
					} else {
						const currentTextArea = getPrevTextArea(e);
						currentTextArea.focus();
						currentTextArea.setSelectionRange(currentTextArea.value.length, currentTextArea.value.length);
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
				currentTextArea.setSelectionRange(currentTextArea.value.length, currentTextArea.value.length);
			}
		}

		// arrow down
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (index < todosArray.length - 1) {
				const currentTextArea = getNextTextArea(e);
				currentTextArea.focus();
				currentTextArea.setSelectionRange(currentTextArea.value.length, currentTextArea.value.length);
			}
		}
	};

	const handleBlur = (e) => {
		setYArrayElementAtIndex(index, { text: e.target.value });
	};

	const handleFocus = (e) => {
		// awareness.setLocalStateField('focusing', { index: index, color: awareness.getLocalState().usercolor });

		// move name tag to the end of the text
		updateAwareness(e);

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
		const textArea = e.target;

		textArea.style.height = 'auto';

		// if (e.target.scrollHeight >= 41) {
		textArea.style.height = `${textArea.scrollHeight}px`;
		// }

		updateAwareness(e);
	};

	// const updateNametagPosition = (e) => {
	// 	const text = e.target.value;

	// 	const maxCharsPerLine = 145;
	// 	const indexAtLine = text.length % maxCharsPerLine;

	// 	// awareness.setLocalStateField('nametag', {
	// 	// 	index: index,
	// 	// 	element: {
	// 	// 		style: {
	// 	// 			backgroundColor: color ? color : 'none',
	// 	// 			color: 'white',
	// 	// 			top: e.target.style.height,
	// 	// 			left: `${indexAtLine * 10}px`,
	// 	// 		},
	// 	// 		username: awareness.getLocalState().username,
	// 	// 	},
	// 	// });

	// 	return {
	// 		index: index,
	// 		element: {
	// 			style: {
	// 				backgroundColor: color ? color : 'none',
	// 				color: 'white',
	// 				top: e.target.style.height,
	// 				left: `${indexAtLine * 10}px`,
	// 			},
	// 			username: awareness.getLocalState().username,
	// 		},
	// 	};

	// 	// }
	// };

	const updateAwareness = (e) => {
		console.log('🚀 ~ file: TodoEntry.js:262 ~ updateAwareness ~ e:', e);
		const text = e.target.value;
		console.log('🚀 ~ file: TodoEntry.js:248 ~ updateAwareness ~ text:', text.length);

		// const maxCharsPerLine = 145;
		// const indexAtLine = text.length % maxCharsPerLine;

		// const lineWidth = e.target.getBoundingClientRect().width;
		// const steps = lineWidth / maxCharsPerLine;

		// const caretPosition = e.target.selectionStart;
		// console.log('🚀 ~ file: TodoEntry.js:254 ~ updateAwareness ~ caretPosition:', caretPosition);

		awareness.setLocalStateField('focusing', {
			index: index,
			nametagStyle: {
				color: 'white',
				// top: e.target.style.height,
				// top: '0px',
				// top: `${y}px`,
				// left: `${indexAtLine}rem`,

				// left should be the position of the last character in the text area
				// left: `${indexAtLine * steps}px`,
				// left: `${x}px`,
			},
		});
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

	useEffect(() => {
		// adjust size of the text area
		const textArea = document.querySelector(`#todoText${index}`);
		textArea.style.height = 'auto';
		textArea.style.height = `${textArea.scrollHeight}px`;
	});

	return (
		<div className={classes.todoentry} id='todoEntry'>
			{/** checkbox */}
			<div className={checked ? classes.checkboxChecked : classes.checkbox} onClick={handleCheck} id='checkBox'></div>

			{/** text */}
			<div className={classes.text} id='textContainer'>
				<textarea
					id={'todoText' + index}
					// cols={10}
					rows={1}
					value={texted}
					onChange={handleEditText}
					style={{ color: checked ? '#AAA' : info ? info.color : 'black' }}
					disabled={checked}
					onKeyDown={handleKeyPress}
					onBlur={handleBlur}
					onInput={adjustSize}
					onFocus={handleFocus}
					spellCheck='false'
				/>

				{info && info.name.length > 0 ? (
					<span className='nametag' style={{ ...info.style, backgroundColor: info.color }}>
						{info.name}
					</span>
				) : null}
			</div>
		</div>
	);
};
