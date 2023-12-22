import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';
// import { IndexeddbPersistence } from 'y-indexeddb';

// some random color in hex
export const userColors = [
	'#2C3E50',
	'#E74C3C',
	'#3498DB',
	'#1ABC9C',
	'#F39C12',
	'#9B59B6',
	'#34495E',
	'#D35400',
	'#95A5A6',
	'#27AE60',
	'#E67E22',
	'#2980B9',
	'#8E44AD',
	'#C0392B',
	'#16A085',
	'#F1C40F',
	'#7F8C8D',
	'#2ECC71',
	'#D35400',
	'#3498DB',
	'#BDC3C7',
	'#E74C3C',
	'#34495E',
	'#2C3E50',
	'#1ABC9C',
	'#F39C12',
	'#9B59B6',
	'#D35400',
	'#3498DB',
	'#E74C3C',
	'#27AE60',
	'#95A5A6',
	'#2980B9',
	'#34495E',
	'#16A085',
	'#E67E22',
	'#C0392B',
	'#8E44AD',
	'#F1C40F',
	'#7F8C8D',
	'#2ECC71',
	'#BDC3C7',
	'#D35400',
	'#3498DB',
	'#E74C3C',
	'#1ABC9C',
	'#F39C12',
	'#9B59B6',
	'#34495E',
	'#2C3E50',
];
const myColor = userColors[Math.floor(Math.random() * userColors.length)];

const YContext = createContext({});

const YContextProvider = (props) => {
	// Initialize Yjs document
	const [ydoc, setYdoc] = useState();
	const [provider, setProvider] = useState();
	const [todosArray, setTodosArray] = useState();
	const [awareness, setAwareness] = useState();
	const [connected, setConnected] = useState(false);
	// const [persisted, setPersisted] = useState();

	useEffect(() => {
		const doc = new Y.Doc();
		setYdoc(doc);
		const newProvider = new WebsocketProvider('ws://localhost:1234', 'todolist', doc);
		// console.log('newProvider', newProvider);
		newProvider.on('status', (event) => {
			console.log(event.status); // logs "connected" or "disconnected"
			if (event.status === 'connected') setConnected(true);
			else setConnected(false);
		});

		const newAwareness = newProvider.awareness;
		// init user
		newAwareness.setLocalStateField('username', '');
		newAwareness.setLocalStateField('usercolor', myColor);
		setAwareness(newAwareness);

		setProvider(newProvider);
		const persistence = new IndexeddbPersistence('todolistdb', doc);
		persistence.once('synced', () => {
			// persistence.clearData().then(() => console.log('persistence destroyed'));
			console.log('initial content synced');
		});
		const tArray = doc.getArray('todos');
		// const tArray = new Y.Array();
		// console.log('🚀 ~ file: YContext.js:28 ~ useEffect ~ tArray:', tArray.toArray());
		setTodosArray(tArray);
		// setPersisted(persistence);
		// console.log('Create Y stuff. todosArray: ', tArray.toArray(), 'ydoc: ', doc, 'provider: ', newProvider);

		return () => {
			newProvider.destroy();
			setConnected(false);
		};
	}, []);

	const returnVal = useMemo(
		() => ({ ydoc, provider, todosArray /** , persisted*/, awareness, connected }),
		[provider, todosArray, ydoc /**, persisted*/, awareness, connected]
	);
	return <YContext.Provider value={returnVal}>{props.children}</YContext.Provider>;
};

const useYContext = () => {
	const value = useContext(YContext);

	return value;
};

export { YContextProvider, useYContext };
