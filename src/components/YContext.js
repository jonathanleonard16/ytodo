import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
// import { IndexeddbPersistence } from 'y-indexeddb';

const YContext = createContext({});

const YContextProvider = (props) => {
	// Initialize Yjs document
	const [ydoc, setYdoc] = useState();
	const [provider, setProvider] = useState();
	const [todosArray, setTodosArray] = useState();
	// const [persisted, setPersisted] = useState();

	useEffect(() => {
		const doc = new Y.Doc();
		setYdoc(doc);
		const newProvider = new WebsocketProvider('ws://localhost:1234', 'todolist', doc);
		newProvider.on('status', (event) => {
			console.log(event.status); // logs "connected" or "disconnected"
		});
		// const persistence = new IndexeddbPersistence('todolist', doc);
		// persistence.once('synced', () => {
		// 	console.log('initial content synced');
		// });
		setProvider(newProvider);
		const tArray = doc.getArray('todos');
		// const tArray = new Y.Array();
		// console.log('🚀 ~ file: YContext.js:28 ~ useEffect ~ tArray:', tArray.toArray());
		setTodosArray(tArray);
		// setPersisted(persistence);
		// console.log('Create Y stuff. todosArray: ', tArray.toArray(), 'ydoc: ', doc, 'provider: ', newProvider);

		const socket = new WebSocket('ws://localhost:1234');

		return () => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.close();
				newProvider.destroy();
			}
		};
	}, []);

	const returnVal = useMemo(
		() => ({ ydoc, provider, todosArray /** , persisted*/ }),
		[provider, todosArray, ydoc /**, persisted*/]
	);
	return <YContext.Provider value={returnVal}>{props.children}</YContext.Provider>;
};

const useYContext = () => {
	const value = useContext(YContext);

	return value;
};

export { YContextProvider, useYContext };
