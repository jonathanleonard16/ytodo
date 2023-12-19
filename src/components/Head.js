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

		'& .username-dialog': {
			display: 'none',
		},

		'& .username': {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'flex-start',
			position: 'absolute',
			top: '50px',
			right: '10px',
			borderRadius: '5px',
			padding: '15px',
			backgroundColor: '#191919',
			userSelect: 'none',

			gap: '7px',

			fontSize: '15px',

			zIndex: 2,

			'& input': {
				fontSize: '15px',
				// marginLeft: '10px',
				border: 'none',
				outline: 'none',
				padding: '7px',
				borderRadius: '5px',
			},

			'& .buttonGroup': {
				display: 'flex',
				// justifyContent: 'flex-end',
				marginLeft: 'auto',
				gap: '7px',

				'& button': {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: '5px',
					border: 'none',
					outline: 'none',
					padding: '7px',
					fontSize: '11px',
					fontWeight: 400,
					backgroundColor: '#fff',

					transition: 'background-color 0.2s ease-in-out',

					'&:hover': {
						backgroundColor: '#ddd',
					},
				},

				'& button.primary': {
					backgroundColor: '#1677FF',
					color: '#fff',

					// transition: 'background-color 0.2s ease-in-out',

					'&:hover': {
						backgroundColor: '#0e5ee6',
					},
				},
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

				userSelect: 'none',

				'&#own-user-icon': {
					cursor: 'pointer',
				},

				'& .user-icon-tooltip': {
					diplay: 'none',
					fontSize: '11px',
					backgroundColor: '#000',
					padding: '3px 5px',
					borderRadius: '3px',
					position: 'absolute',
					top: '30px',

					zIndex: 2,
				},
			},
		},
	},
});

export const Head = () => {
	const classes = useStyles();

	const { awareness } = useYContext();
	const [otherUserList, setOtherUserList] = useState([]);
	// const [currentUser, setCurrentUser] = useState();

	const [userDialogOpen, setUserDialogOpen] = useState(false);

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
		// awareness.setLocalStateField('username', e.target.value);
		// awareness.getStates().forEach((s) => console.log(s.user));
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			awareness.setLocalStateField('username', username);
			setUserDialogOpen(false);
		}
	};

	const showUserTooltip = (e) => {
		const tooltip = e.target.querySelector('.user-icon-tooltip');
		if (tooltip) {
			tooltip.style.display = 'flex';
			tooltip.style.left = e.clientX + 7 + 'px';
			tooltip.style.top = e.clientY + 7 + 'px';
		}
	};

	const hideUserTooltip = (e) => {
		const tooltip = e.target.querySelector('.user-icon-tooltip');
		if (tooltip) tooltip.style.display = 'none';
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

			<div className='user-icons'>
				{otherUserList.map((user, key) => {
					return (
						<div
							key={key}
							className='user-icon'
							style={{ backgroundColor: user?.color }}
							onMouseMove={showUserTooltip}
							onMouseOut={hideUserTooltip}
						>
							{user?.name[0]?.toUpperCase()}

							{user?.name?.length > 0 ? (
								<span className='user-icon-tooltip' style={{ display: 'none' }}>
									{user?.name}
								</span>
							) : null}
						</div>
					);
				})}

				{username !== undefined ? (
					<div
						onClick={() => setUserDialogOpen(!userDialogOpen)}
						className='user-icon'
						id='own-user-icon'
						style={{
							backgroundColor: awareness.getLocalState().usercolor,
							boxShadow: `0px 0px 0px 3px ${awareness.getLocalState().usercolor}bb`,
						}}
					>
						{awareness.getLocalState().username ? awareness.getLocalState().username[0]?.toUpperCase() : ''}
					</div>
				) : null}
			</div>
			<div className='username-dialog' style={{ display: userDialogOpen ? 'flex' : 'none' }}>
				<span className='username'>
					{/* username: */}
					Enter username:
					<input
						type='text'
						placeholder='Username'
						onInput={handleChangeUsername}
						defaultValue={awareness.getLocalState().username ?? ''}
						onKeyDown={handleKeyPress}
					/>
					<div className='buttonGroup'>
						<button onClick={() => setUserDialogOpen(false)}>cancel</button>
						<button
							className='primary'
							onClick={() => {
								awareness.setLocalStateField('username', username);
								setUserDialogOpen(false);
							}}
						>
							okay
						</button>
					</div>
				</span>
			</div>
		</div>
	);
};
