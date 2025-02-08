import { ModuleMetadata, Type } from '@nestjs/common';
import { Credential } from 'firebase-admin/app';

export interface FirebaseModuleOptions {
  serviceAccountPath: string | Credential | undefined;
}

export interface FirebaseOptionsFactory {
  createFirebaseOptions(): Promise<FirebaseModuleOptions> | FirebaseModuleOptions;
}

export interface FirebaseModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<FirebaseOptionsFactory>;
  useClass?: Type<FirebaseOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<FirebaseModuleOptions> | FirebaseModuleOptions;
  inject?: any[];
}