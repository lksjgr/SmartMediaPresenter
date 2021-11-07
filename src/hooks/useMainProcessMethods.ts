import { useState, useEffect } from 'react';
import { MainProcessMethodIdentifiers } from '../shared/types/identifiers';
import {
	StoredPresentation,
	StoredPresentations,
	SinglePresentation,
} from '../shared/types/presentation';
const { ipcRenderer } = window.require('electron');

export const useStoredPresentations = () => {
	const [presentations, setPresentations] = useState<StoredPresentation[]>([]);

	useEffect(() => {
		ipcRenderer
			.invoke(MainProcessMethodIdentifiers.GetStoredPresentations)
			.then((r: StoredPresentations) => {
				// sorts the presentations so that the last changes are on top
				r.presentations.sort((f, s) => (f.created < s.created ? 1 : -1));
				setPresentations([...r.presentations]);
			});
	}, []);

	const createPresentation = (callback: (id: number) => any) => {
		ipcRenderer
			.invoke(MainProcessMethodIdentifiers.CreatePresentation)
			.then((r: StoredPresentation) => {
				setPresentations([...presentations, r]);
				callback(r.id);
			});
	};

	return { createPresentation, presentations };
};

export const useSinglePresentation = (id: number) => {
	const [presentationId, setId] = useState<number>(id);
	const [storedPresentation, setStroedPresentation] =
		useState<SinglePresentation>();

	useEffect(() => {
		if (id === NaN) {
			return;
		}
		setId(id);
		ipcRenderer
			.invoke(MainProcessMethodIdentifiers.GetSinglePresentation, id)
			.then((r: SinglePresentation) => {
				setStroedPresentation(r);
			});
	}, [id]);

	const saveChanges = (file: Partial<SinglePresentation>) => {
		ipcRenderer
			.invoke(
				MainProcessMethodIdentifiers.SaveChangesToPresentation,
				presentationId,
				file
			)
			.then((r: SinglePresentation) => {
				setStroedPresentation(r);
			});
	};

	return { storedPresentation, saveChanges };
};

export const useLocalFileSystem = () => {
	const getFilesInDir = async (path: string) => {
		const filesInDir = await ipcRenderer.invoke(
			MainProcessMethodIdentifiers.LoadFilesFromDirectory,
			path
		);
		return filesInDir;
	};

	return { getFilesInDir };
};