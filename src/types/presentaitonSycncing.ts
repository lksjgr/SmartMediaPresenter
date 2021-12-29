import { SinglePresentation } from '../shared/types/presentation';

export interface IPresentationSyncContext {
	remoteMedia: RemotelyAvailableMedia;
	localSyncingQueue: LocalSyncPresentationItem[];
	addToLocalSyncingQueue: AddToLocalSyncingQueueHandler;
	syncingAvailable: boolean;
	syncPaper: Map<string, number>;
}

export type AddToLocalSyncingQueueHandler = (
	presentation: SinglePresentation,
	presentationId: number
) => void;

export interface RemotelyAvailableMedia {
	name: string;
	downloadUrl: string;
}

export interface LocalSyncPresentationItem {
	presentation: SinglePresentation;
	presentationId: number;
}