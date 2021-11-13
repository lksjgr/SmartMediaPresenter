import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

export default makeStyles<Theme>((theme: Theme) =>
	createStyles({
		img: {
			maxWidth: '100%',
			maxHeight: '100%',
			zIndex: 1,
			outlineWidth: '0px',
		},
		imgSelected: {
			maxWidth: '100%',
			maxHeight: '100%',
			zIndex: 2,
			outlineColor: theme.palette.primary.main,
			outline: '3px solid',
			overflow: 'overlay',
		},
	})
);