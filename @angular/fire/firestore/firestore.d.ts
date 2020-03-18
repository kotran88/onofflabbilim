import { InjectionToken, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { Settings, PersistenceSettings, CollectionReference, DocumentReference, QueryFn, QueryGroupFn, AssociatedReference } from './interfaces';
import { AngularFirestoreDocument } from './document/document';
import { AngularFirestoreCollection } from './collection/collection';
import { AngularFirestoreCollectionGroup } from './collection-group/collection-group';
import { FirebaseFirestore, FirebaseOptions, FirebaseAppConfig, FirebaseZoneScheduler } from '@angular/fire';
import { firestore } from 'firebase/app';
export declare const EnablePersistenceToken: InjectionToken<boolean>;
export declare const PersistenceSettingsToken: InjectionToken<firestore.PersistenceSettings | undefined>;
export declare const FirestoreSettingsToken: InjectionToken<firestore.Settings>;
export declare const DefaultFirestoreSettings: firestore.Settings;
export declare function associateQuery(collectionRef: CollectionReference, queryFn?: (ref: any) => any): AssociatedReference;
export declare class AngularFirestore {
    readonly firestore: FirebaseFirestore;
    readonly persistenceEnabled$: Observable<boolean>;
    readonly scheduler: FirebaseZoneScheduler;
    constructor(options: FirebaseOptions, nameOrConfig: string | FirebaseAppConfig | null | undefined, shouldEnablePersistence: boolean | null, settings: Settings | null, platformId: Object, zone: NgZone, persistenceSettings: PersistenceSettings | null);
    collection<T>(path: string, queryFn?: QueryFn): AngularFirestoreCollection<T>;
    collection<T>(ref: CollectionReference, queryFn?: QueryFn): AngularFirestoreCollection<T>;
    collectionGroup<T>(collectionId: string, queryGroupFn?: QueryGroupFn): AngularFirestoreCollectionGroup<T>;
    doc<T>(path: string): AngularFirestoreDocument<T>;
    doc<T>(ref: DocumentReference): AngularFirestoreDocument<T>;
    createId(): string;
}