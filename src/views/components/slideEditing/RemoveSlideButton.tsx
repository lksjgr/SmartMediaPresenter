import React from 'react';
import usePresentationEditingContext from '../../../hooks/usePresentationEditingContext';
import {
	getEmptySlide,
	SinglePresentation,
	Slide,
} from '../../../shared/types/presentation';
import { PresentationEditingActionIdentifiers } from '../../../types/identifiers';
import RemoveButton from './RemoveButton';

const RemoveSlideButton: React.FC<{}> = (props) => {
	const { state, dispatch } = usePresentationEditingContext();
	const { presentation, currentSlide } = state;

	return (
		<RemoveButton
			onClick={() => {
				const newPresentation: SinglePresentation = JSON.parse(
					JSON.stringify(presentation)
				);
				const slides: Slide[] = newPresentation.slides
					.filter((slide) => slide.id !== currentSlide)
					.map((slide) => ({
						...slide,
						id: slide.id > currentSlide ? slide.id - 1 : slide.id,
					}));

				const newInitialSlides = (
					JSON.parse(JSON.stringify(state.initialSlides)) as Slide[]
				)
					.filter((slide) => {
						return slide.id !== currentSlide;
					})
					.map((slide) => ({
						...slide,
						id: slide.id > currentSlide ? slide.id - 1 : slide.id,
					}));

				if (slides.length === 0)
					slides.push(
						getEmptySlide(undefined, presentation.theme?.defaultFormat)
					);

				newPresentation.slides = slides;

				dispatch({
					type: PresentationEditingActionIdentifiers.changeCurrentSlide,
					payload: {
						currentSlide: Math.max(currentSlide - 1, 0),
					},
				});
				dispatch({
					type: PresentationEditingActionIdentifiers.presentationSettingsUpdated,
					payload: {
						presentation: newPresentation,
						initialSlides: newInitialSlides,
					},
				});
			}}
			selected={false}
		/>
	);
};

export default RemoveSlideButton;
