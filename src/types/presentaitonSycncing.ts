import { SinglePresentation, Slide } from '../shared/types/presentation';

export interface IPresentationSyncContext {
	storedPresentations: SyncableStoredPresentation[];
	createPresentation: (
		callback: (id: number) => any,
		pres?: SinglePresentation | undefined
	) => void;
	removeSinglePresentation: (id: number) => void;
	retrieveSinglePresentationOnce: (
		id: number,
		callback: (presentation: SinglePresentation) => void
	) => void;
	remoteMedia: RemotelyAvailableMedia;
	localSyncingQueue: LocalSyncPresentationItem[];
	addToLocalSyncingQueue: AddToLocalSyncingQueueHandler;
	syncingAvailable: boolean;
	syncPaper: Map<string, SyncPaperEntry>;
	retrieveRemotePresentationOnce: (
		remoteId: string,
		callback: (presentation: SinglePresentation) => void
	) => void;
	downloadAndUpdateLocalPresentation: (
		remoteId: string,
		callback?: (id: number) => void
	) => void;
	downloadingPresentations: string[];
	getRemoteMedia: (
		callback: (files: RemoteStorageMedia[]) => void,
		path?: string
	) => void;
	createFolder: (
		folderName: string,
		callback: (folder: RemoteStorageMedia) => void,
		path?: string
	) => void;
	deleteFiles: (files: RemoteStorageMedia[], callback: () => void) => void;
	uploadRemoteMedia: (
		filePaths: string[],
		onProgressUpdate: (progress: number) => void,
		callback: (media: RemoteStorageMedia[]) => void,
		path?: string
	) => void;
	deleteRemotePresentation: (remoteId: string) => void;
	removeRemoteAttributesFromPresentation: (id: number) => void;
	createQuickCreatePresentation: (
		name: string,
		slides: Slide[],
		callback: (id: number) => any
	) => void;
	presentationDidUpdate: () => void;
}

export type AddToLocalSyncingQueueHandler = (
	presentation: SinglePresentation,
	presentationId: number,
	callback?: (id: string) => void
) => void;

export interface RemotelyAvailableMedia {
	name: string;
	downloadUrl: string;
}

export interface LocalSyncPresentationItem {
	presentation: SinglePresentation;
	presentationId: number;
}

export type PresentationSyncStatus = 'uploadable' | 'downloadable' | 'insync';

export interface SyncPaperEntry {
	name: string;
	remoteId: string;
	remoteUpdate: number;
}

export interface SyncableStoredPresentation {
	name: string;
	id?: number;
	remoteId?: string;
	created?: number;
	remoteUpdate?: number;
}

export type RemoteStorageMediaType = 'file' | 'dir';

export interface RemoteStorageMedia {
	type: RemoteStorageMediaType;
	name: string;
	path: string;
	url?: string;
}
