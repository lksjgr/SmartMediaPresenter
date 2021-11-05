import React, { useState, useEffect } from 'react';
import { Box } from '../../.././smpUI/components';
import { MediaRessource, Slide } from '../../../shared/types/presentation';
import { IBoxProps } from '../../../smpUI/components/Box';
import MediaDropBox from '../MediaDropBox';
import useStyels from './styles';

interface ISlideEditingBoxProps extends IBoxProps {
	slide: Slide;
	didReceiveMediaFile: (file: File, id: number) => void;
}

const SlideEditingBox: React.FC<ISlideEditingBoxProps> = (props) => {
	const { slide, didReceiveMediaFile } = props;
	const [media, setMedia] = useState<MediaRessource[]>([...slide.media]);
	const classes = useStyels();

	useEffect(() => {
		setMedia([...slide.media]);
	}, [slide]);

	return (
		<Box className={classes.container} sx={{ bgcolor: 'black' }}>
			<Box className={classes.mediaContainer}>
				{Array.apply(null, Array(slide.rows)).map((_, i) => (
					<Box key={i} className={classes.rowContainer}>
						{[...media]
							.splice(i * slide.columns, i * slide.columns + slide.columns)
							.map((media, n) => (
								<MediaDropBox
									key={`${i}-${n}`}
									id={i * slide.columns + i}
									media={media}
									width={`${100 / slide.columns}%`}
									aspectRatio='16/9'
									didReceiveMediaFile={didReceiveMediaFile}
								/>
							))}
					</Box>
				))}
			</Box>
		</Box>
	);
};

export default SlideEditingBox;