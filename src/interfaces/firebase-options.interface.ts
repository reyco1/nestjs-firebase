import { ModuleMetadata, Type } from '@nestjs/common';

export interface FirebaseModuleOptions {
  serviceAccountPath: string;
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