import { useState, useEffect, useCallback } from 'react';
import { FileExplorerType } from '../shared/types/fileExplorer';
import { MainProcessMethodIdentifiers } from '../shared/types/identifiers';
import {
	StoredPresentation,
	StoredPresentations,
	SinglePresentation,
	Slide,
} from '../shared/types/presentation';
import { UserSettings } from '../shared/types/userSettings';
import { WorkspaceChangeResult } from '../shared/types/workspace';
const { ipcRenderer } = window.require('electron');

export const useStoredPresentations = () => {
	const [presentations, setPresentations] = useState<StoredPresentation[]>([]);

	const loadPresentations = useCallback(() => {
		ipcRenderer
			.invoke(MainProcessMethodIdentifiers.GetStoredPresentations)
			.then((r: StoredPresentations) => {
				// sorts the presentations so that the ones with the most recent changes are on top
				r.presentations.sort((f, s) => (f.created < s.created ? 1 : -1));
				setPresentations([...r.presentations]);
			});
	}, []);

	useEffect(() => {
		loadPresentations();
	}, []);

	const retrieveSinglePresentationOnce = (
		id: number,
		callback: (presentation: SinglePresentation) => void
	) => {
		if (isNaN(id)) return;
		ipcRenderer
			.invoke(MainProcessMethodIdentifiers.GetSinglePresentation, id)
			.then((r: SinglePresentation) => {
				callback(r);
			});
	};

	const createPresentation = (
		callback: (id: number) => any,
		pres?: SinglePresentation,
		created?: number
	) => {
		ipcRenderer
			.invoke(MainProcessMethodIdentifiers.CreatePresentation, pres, created)
			.then((r: StoredPresentation) => {
				setPresentations([...presentations, r]);
				callback(r.id);
			});
	};

	const createQuickCreatePresentation = (
		name: string,
		slides: Slide[],
		callback: (id: number) => any
	) => {
		ipcRenderer
			.invoke(
				MainProcessMethodIdentifiers.CreateQuickCreatePresentation,
				name,
				slides
			)
			.then((r: StoredPresentation) => {
				setPresentations([...presentations, r]);
				callback(r.id);
			});
	};

	const removeSinglePresentation = (id: number) => {
		ipcRenderer.invoke(
			MainProcessMethodIdentifiers.deleteSinglePresentation,
			id
		);
		const filteredPres = [...presentations].filter((pres) => {
			return pres.id !== id;
		});
		setPresentations(filteredPres);
	};

	return {
		retrieveSinglePresentationOnce,
		createPresentation,
		createQuickCreatePresentation,
		presentations,
		removeSinglePresentation,
		reloadPresentations: loadPresentations,
	};
};

export const useSinglePresentation = (id: number) => {
	const [presentationId, setId] = useState<number>(id);
	const [storedPresentation, setStroedPresentation] =
		useState<SinglePresentation>();

	useEffect(() => {
		if (isNaN(id)) {
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

	const openFileSelectorDialog = async (type: FileExplorerType) => {
		const files = await ipcRenderer.invoke(
			MainProcessMethodIdentifiers.OpenFileSelectorDialog,
			type
		);
		return files;
	};

	const openSaveFileDialog = async (
		title: string,
		presentation: SinglePresentation
	) => {
		ipcRenderer.invoke(
			MainProcessMethodIdentifiers.openSavePresentationDialog,
			title,
			presentation
		);
	};

	const importPresentationFromFileSystem = async (path: string) => {
		const pres = (await ipcRenderer.invoke(
			MainProcessMethodIdentifiers.importPresentationFromFS,
			path
		)) as SinglePresentation;
		return pres;
	};

	const retriveFullFile = async (path: string) => {
		return await ipcRenderer.invoke(
			MainProcessMethodIdentifiers.retriveFullFile,
			path
		);
	};

	return {
		getFilesInDir,
		openFileSelectorDialog,
		openSaveFileDialog,
		importPresentationFromFileSystem,
		retriveFullFile,
	};
};

export const useDisplays = () => {
	const displaysAvailable = async () => {
		return await ipcRenderer.invoke(
			MainProcessMethodIdentifiers.DisplaysAvailable
		);
	};

	const startPresentationMode = async (
		slide: number,
		id?: number,
		remoteId?: string,
		display?: number
	) => {
		ipcRenderer.invoke(
			MainProcessMethodIdentifiers.StartPresenterMode,
			slide,
			id,
			remoteId,
			display
		);
	};

	return { displaysAvailable, startPresentationMode };
};

export const usePresentationMode = (startingSlide: number) => {
	const [slideNumber, setSlide] = useState<number>(startingSlide);
	const [nextSlide] = useState<() => void>(() => () => {
		ipcRenderer.invoke(MainProcessMethodIdentifiers.NextSlideTrigger);
	});
	const [previousSlide] = useState<() => void>(() => () => {
		ipcRenderer.invoke(MainProcessMethodIdentifiers.PreviousSlideTrigger);
	});

	useEffect(() => {
		ipcRenderer.on(
			MainProcessMethodIdentifiers.PresenterModeUpdateNotification,
			(event: any, slide: number) => {
				setSlide((curr) => curr + slide);
			}
		);
		return () => {
			ipcRenderer.removeAllListeners();
		};
	}, []);

	const terminatePresentationMode = () => {
		ipcRenderer.invoke(MainProcessMethodIdentifiers.EndPresenterMode);
	};

	return {
		slideNumber,
		nextSlide,
		previousSlide,
		terminatePresentationMode,
	};
};

export const useAudioStore = () => {
	const storeAudio = async (id: number, buffer: Buffer) => {
		const path = await ipcRenderer.invoke(
			MainProcessMethodIdentifiers.storeAudioFile,
			id,
			buffer
		);
		return path;
	};

	return { storeAudio };
};

export const useSystemFonts = () => {
	const [fonts, setFonts] = useState<string[]>([]);
	useEffect(() => {
		ipcRenderer
			.invoke(MainProcessMethodIdentifiers.getSystemFonts)
			.then((fonts: string[]) => setFonts(fonts));
	}, []);

	return { fonts };
};

export const useUserSettings = () => {
	const [userSettings, setUserSettings] = useState<UserSettings>({
		theme: 'auto',
		language: 'auto',
	});

	useEffect(() => {
		reloadUserSettings();
	}, []);

	const saveUserSettings = (settings: UserSettings) => {
		ipcRenderer.invoke(MainProcessMethodIdentifiers.saveUserSettings, settings);
		setUserSettings(settings);
	};

	const reloadUserSettings = useCallback(() => {
		ipcRenderer
			.invoke(MainProcessMethodIdentifiers.getUserSettings)
			.then((r: UserSettings) => setUserSettings(r));
	}, []);

	return { userSettings, saveUserSettings, reloadUserSettings };
};

export const useWorkspace = () => {
	const changeCurrentWorkspace = useCallback(
		async (
			callback: (canImportLocalPresentations: boolean, amnt: number) => void,
			workspace?: string
		) => {
			ipcRenderer
				.invoke(MainProcessMethodIdentifiers.setWorkspace, workspace)
				.then((result: WorkspaceChangeResult) => {
					callback(
						result.localPresentationsImportable,
						result.localPresentations
					);
				});
		},
		[]
	);

	const importLocalPresentations = useCallback(async (callback: () => void) => {
		ipcRenderer
			.invoke(
				MainProcessMethodIdentifiers.importLocalPresentationsIntoWorkspace
			)
			.then((_: any) => callback());
	}, []);

	return { changeCurrentWorkspace, importLocalPresentations };
};
