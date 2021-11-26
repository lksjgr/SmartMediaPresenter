import React, { useState, useEffect } from 'react';
import { Box } from '../../smpUI/components';
import { usePresentationMode } from '../../hooks/useMainProcessMethods';
import { useLocation } from 'react-router-dom';
import { useSinglePresentation } from '../../hooks/useMainProcessMethods';
import SlideEditingBox from '../components/SlideEditingBox';

const PresentationMode = () => {
	const { slideNumber } = usePresentationMode();
	const location = useLocation();
	const [id, setId] = useState<string>('');
	const { storedPresentation } = useSinglePresentation(parseInt(id));

	useEffect(() => {
		const id = new URLSearchParams(location.search).get('id');
		setId(id ?? '');
	}, [location.search]);

	return (
		<Box sx={{ height: '100vh', width: '100vw', bgcolor: 'red' }}>
			{storedPresentation && (
				<SlideEditingBox
					slide={storedPresentation.slides[slideNumber]}
					presentationFrameEditingEnabled={false}
				/>
			)}
		</Box>
	);
};

export default PresentationMode;