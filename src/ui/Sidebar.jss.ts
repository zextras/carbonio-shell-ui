import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		fullHeight: {
			height: 'calc(100% - 56px)',
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
				easing: theme.transitions.easing.easeInOut,
				duration: theme.transitions.duration.complex,
			}),
		},
		listClose: {
			width: 0,
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.easeInOut,
				duration: theme.transitions.duration.complex,
			}),
			'& *': {
				display: 'none'
			},
		},
		listWrapper: {
			margin: 0,
			padding: 0,
			paddingLeft: theme.spacing(7),
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			borderRadius: 0,
			backgroundColor: theme.palette.background.default
		},
		barOpener: {
			width: theme.spacing(2),
			height: '100%',
			display: 'flex',
			alignContent: 'center',
			justifyContent: 'center',
			transition: 'width 300ms',
			'&:hover': {
				width: theme.spacing(4),
				'& div': {
					backgroundColor: theme.palette.grey[600]
				}
			}
		},
		barOpenerNotch: {
			height: theme.spacing(3),
			width: theme.spacing(1),
			backgroundColor: theme.palette.grey[400],
			transition: 'background-color 300ms',
			margin: 'auto 4px auto 4px',
			borderRadius: 2
		}
	})
);

export default useStyles;