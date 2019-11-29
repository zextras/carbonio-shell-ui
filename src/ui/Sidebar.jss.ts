import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		fullHeight: {
			height: 'calc(100% - 56px)'
		},
		'@media (min-width:0px) and (orientation: landscape)': {
			fullHeight: {
				height: 'calc(100% - 48px)'
			}
		},
		'@media (min-width:600px)': {
			fullHeight: {
				height: 'calc(100% - 64px)'
			}
		},
		list: {
			height: '100%',
			alignSelf: 'top'
		},
		listOpen: {
			width: 360,
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
		},
		listClose: {
			width: 0,
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			'& *': {
				display: 'none'
			}
		},
		listWrapper: {
			margin: 0,
			padding: 0,
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			borderRadius: 0,
			backgroundColor: theme.palette.background.default
		},
		barOpener: {
			height: '100%',
			display: 'flex'
		},
		barOpenerNotch: {
			height: 24,
			width: 8,
			backgroundColor: theme.palette.text.secondary,
			margin: 'auto 4px auto 4px',
			borderRadius: 2
		}
	})
);

export default useStyles;