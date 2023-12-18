import { createUseStyles } from 'react-jss';
import { useYContext } from './YContext';
import { useEffect, useState } from 'react';

const useStyles = createUseStyles({
	head: {
		display: 'flex',
		// justifyContent: 'space-between',
		padding: '0 30px',
		alignItems: 'center',
		backgroundColor: '#000',
		color: '#FFF',
		// fontWeight: 800,
		// fontSize: '21px',
		height: '55px',

		'& .appname': {
			fontWeight: 800,
			fontSize: '21px',
		},
		'& .username': {
			display: 'flex',
			alignItems: 'center',
			marginLeft: '200px',
			// marginLeft: 'auto',

			fontSize: '15px',

			'& input': {
				fontSize: '15px',
				marginLeft: '10px',
				border: 'none',
				outline: 'none',
				padding: '5px',
				borderRadius: '5px',
			},
		},

		'& .user-icons': {
			display: 'flex',
			// put user icons to the right
			marginLeft: 'auto',
			gap: '7px',

			'& .user-icon': {
				// marginLeft: '5px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontSize: '15px',
				fontWeight: 500,
				width: '30px',
				height: '30px',
				borderRadius: '50%',
			},
		},
	},
});

export const Head = () => {
	const classes = useStyles();

	const { awareness } = useYContext();
	const [otherUserList, setOtherUserList] = useState([]);
	// const [currentUser, setCurrentUser] = useState();

	const [username, setUsername] = useState('');

	// awareness?.on('change', () => {
	// setRerendered(!rerendered);
	// 	const newUserList = [];
	// 	awareness.getStates().forEach((s) => {
	// 		newUserList.push(s.user);
	// 	});
	// 	setUserList(newUserList);
	// });

	const handleChangeUsername = (e) => {
		setUsername(e.target.value);
		awareness.setLocalStateField('username', e.target.value);
		// awareness.getStates().forEach((s) => console.log(s.user));
	};

	useEffect(() => {
		// console.log('🚀 ~ file: Head.js:89 ~ useEffect ~ awareness:', awareness);
		if (awareness) {
			const drawUserIcons = () => {
				// const newCurrentUser = {
				// 	name: awareness.getLocalState()?.username,
				// 	color: awareness.getLocalState()?.usercolor,
				// };
				// setCurrentUser(newCurrentUser);

				const newOtherUserList = [];
				awareness.getStates().forEach((s) => {
					if (s !== awareness.getLocalState()) {
						newOtherUserList.push({ name: s.username, color: s.usercolor });
					}
				});
				// console.log('🚀 ~ file: Head.js:94 ~ init ~ newOtherUserList:', newOtherUserList);
				setOtherUserList(newOtherUserList);
			};

			awareness.on('change', () => {
				// console.log('here');
				drawUserIcons();
				// console.log('🚀 ~ file: Head.js:109 ~ awareness.on ~ awareness:', Array.from(awareness.getStates().values()));
			});

			drawUserIcons();
		}
	}, [awareness]);

	if (!awareness) return <></>;

	return (
		<div className={classes.head}>
			<span className='appname'>Y-TODO</span>
			<span className='username'>
				{/* username: */}
				<input type='text' placeholder='Username' onInput={handleChangeUsername} />
			</span>
			<div className='user-icons'>
				{otherUserList.map((user, key) => {
					return (
						<div key={key} className='user-icon' style={{ backgroundColor: user?.color }} title={user?.name}>
							{user?.name[0]?.toUpperCase()}
						</div>
					);
				})}

				{username !== undefined ? (
					<div
						className='user-icon'
						style={{
							backgroundColor: awareness.getLocalState().usercolor,
							boxShadow: `0px 0px 0px 3px ${awareness.getLocalState().usercolor}bb`,
						}}
					>
						{username[0]?.toUpperCase()}
					</div>
				) : null}
			</div>
		</div>
	);
};
