import React from 'react';
import { DataTransferIdentifiers } from '../../../shared/types/identifiers';
import { QuickCreateMediaResource } from '../../../shared/types/quickCreate';
import { Box, Text } from '../../../smpUI/components';
import { useSlideRowMediaHolderStyles } from './styles';

interface ISlideRowMediaHolder {
	id: number;
	src?: string;
	width: string;
	onMediaReceived: (id: number, path: string) => void;
}

const SlideRowMediaHolder: React.FC<ISlideRowMediaHolder> = (props) => {
	const { id, src, width, onMediaReceived } = props;
	const classes = useSlideRowMediaHolderStyles();

	return (
		<Box
			className={classes.container}
			sx={{
				width: width,
			}}
			onDragOver={(e) => {
				e.preventDefault();
			}}
			onDragLeave={(e) => {
				e.preventDefault();
			}}
			onDragEnter={(e) => {
				e.preventDefault();
			}}
			onDrop={(e) => {
				e.preventDefault();
				console.log(
					e.dataTransfer.getData(DataTransferIdentifiers.MediaFileInfo)
				);
				const media: QuickCreateMediaResource = JSON.parse(
					e.dataTransfer.getData(DataTransferIdentifiers.MediaFileInfo)
				);
				onMediaReceived(
					id,
					media.location.local ?? media.location.remote ?? ''
				);
			}}
		>
			{src ? (
				<Box className={classes.mediaPresentContainer}>
					<img src={src} className={classes.mediaPresentImg} />
					<Text overflow='hidden' textOverflow='ellipsis' variant='caption'>
						{src.split('/').pop()}
					</Text>
				</Box>
			) : (
				<Box className={classes.noMediaPresentContainer}>
					<Box className={classes.noMediaPresentIndicatorBox}>
						<Text variant='caption'>drop media here</Text>
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default SlideRowMediaHolder;