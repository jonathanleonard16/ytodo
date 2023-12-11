import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
	head: {
		display: 'flex',
		padding: '0 30px',
		alignItems: 'center',
		backgroundColor: '#000',
		color: '#FFF',
		fontWeight: 800,
		fontSize: '21px',
		height: '55px',
	},
});

export const Head = () => {
	const classes = useStyles();
	return <div className={classes.head}>Y-TODO</div>;
};
