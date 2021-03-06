import { initializeApp } from 'firebase/app';
import config from '../config/config.firebase';
import {
	getAuth,
	signInWithEmailAndPassword,
	signOut as fireSignOut,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	User,
	sendPasswordResetEmail,
} from 'firebase/auth';
import {
	getStorage,
	ref,
	uploadBytesResumable,
	UploadMetadata,
	UploadTask,
	getDownloadURL,
	listAll,
	uploadString,
	deleteObject,
} from 'firebase/storage';
import {
	getDatabase,
	ref as dbRef,
	set,
	get,
	update,
	push,
} from 'firebase/database';
import { SinglePresentation } from '../shared/types/presentation';
import { dbCollection, defaultDBURL } from '../types/remoteCollections';

let fireAuth: any = {};
let fireStorage: any = {};
let fireDatabase: any = {};

if (config.apiKey !== '') {
	initializeApp(config);
	fireAuth = getAuth();
	fireStorage = getStorage();
	fireDatabase = getDatabase(undefined, defaultDBURL);
}

const firebaseAuth = () => {
	const createAccount = async (email: string, password: string) =>
		await createUserWithEmailAndPassword(fireAuth, email, password);

	const signIn = async (email: string, password: string) =>
		await signInWithEmailAndPassword(fireAuth, email, password);

	const listenForAuthChanges = (callback: (user?: User) => void) => {
		return onAuthStateChanged(fireAuth, (user) => callback(user ?? undefined));
	};

	const sendForgotPwdEmail = (email: string) => {
		return sendPasswordResetEmail(fireAuth, email);
	};

	const signOut = async () => await fireSignOut(fireAuth);

	return {
		createAccount,
		signIn,
		signOut,
		listenForAuthChanges,
		sendForgotPwdEmail,
		currentUser: fireAuth.currentUser ?? undefined,
	};
};
const auth = firebaseAuth();

const firebaseStorage = () => {
	const uploadFile = (
		userId: string,
		fileName: string,
		buffer: Buffer,
		metadata?: UploadMetadata
	): UploadTask => {
		const path = userId + '/' + fileName;
		const reference = ref(fireStorage, path);

		const task = uploadBytesResumable(
			reference,
			buffer,
			metadata
		) as UploadTask;

		return task;
	};

	const listRemoteMedia = (userId: string, path?: string) => {
		const reference = ref(fireStorage, userId + (path ? `/${path}` : ''));
		return listAll(reference);
	};

	const getDownloadUrlFromFileName = (userId: string, fileName: string) => {
		const reference = ref(fireStorage, userId + '/' + fileName);
		return getDownloadURL(reference);
	};

	const createFolder = (userId: string, folderName: string, path?: string) => {
		const reference = ref(
			fireStorage,
			userId + (path ? `/${path}` : '') + `/${folderName}`
		);
		const keep = ref(reference, '.keep');
		return uploadString(keep, '');
	};

	const deleteFile = (userId: string, path: string) => {
		const reference = ref(fireStorage, userId + `/${path}`);
		return deleteObject(reference);
	};

	return {
		uploadFile,
		getDownloadURL,
		getDownloadUrlFromFileName,
		listRemoteMedia,
		createFolder,
		deleteFile,
	};
};

const storage = firebaseStorage();

const firebaseDatabase = () => {
	const uploadPresentation = async (
		userId: string,
		presentation: SinglePresentation,
		callback: (remotePresentation: SinglePresentation) => void
	) => {
		if (presentation.remoteId) {
			updateRemotePresentation(userId, presentation, callback);
		} else {
			const ref = dbRef(
				fireDatabase,
				userId + '/' + dbCollection.presentations
			);
			push(ref).then((newRef) => {
				const id = newRef.key!;

				const remotePresentation = {
					...JSON.parse(JSON.stringify(presentation)),
					remoteId: id,
				};
				updateRemotePresentation(userId, remotePresentation, callback);
			});
		}
	};

	const updateRemotePresentation = (
		userId: string,
		remotePresentation: SinglePresentation,
		callback: (remotePresentation: SinglePresentation) => void
	) => {
		const ref = dbRef(
			fireDatabase,
			userId +
				'/' +
				dbCollection.presentations +
				'/' +
				remotePresentation.remoteId!
		);
		const timestamp = Date.now();
		const pres = {
			...remotePresentation,
			lastChanges: timestamp,
			remoteUpdate: timestamp,
		};

		set(ref, pres).then(() => {
			const updateSyncPaperRef = dbRef(
				fireDatabase,
				userId + '/' + dbCollection.syncPaper + '/' + pres.remoteId!
			);
			set(updateSyncPaperRef, {
				remoteId: pres.remoteId!,
				name: pres.name,
				remoteUpdate: timestamp,
			});
			callback(pres);
		});
	};

	const getSyncPaper = (userId: string) => {
		const ref = dbRef(fireDatabase, userId + '/' + dbCollection.syncPaper);
		return get(ref);
	};

	const getRemotePresentation = (userId: string, remoteId: string) => {
		const ref = dbRef(
			fireDatabase,
			userId + '/' + dbCollection.presentations + '/' + remoteId
		);
		return get(ref);
	};

	const deleteRemotePresentation = (userId: string, remoteId: string) => {
		const ref = dbRef(fireDatabase, userId);
		const updates: any = {};
		updates[`/${dbCollection.presentations}/${remoteId}`] = null;
		updates[`/${dbCollection.syncPaper}/${remoteId}`] = null;

		return update(ref, updates);
	};

	return {
		uploadPresentation,
		getSyncPaper,
		getRemotePresentation,
		deleteRemotePresentation,
	};
};

const database = firebaseDatabase();

export { auth, storage, database };
