import { DynamicModule, Module, Provider } from '@nestjs/common';
import { FirebaseService } from './services/firebase.service';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { FIREBASE_OPTIONS } from './firebase.constants';
import {
  FirebaseModuleOptions,
  FirebaseModuleAsyncOptions,
  FirebaseOptionsFactory,
} from './interfaces/firebase-options.interface';

@Module({})
export class FirebaseModule {
  static forRoot(options: FirebaseModuleOptions): DynamicModule {
    return {
      module: FirebaseModule,
      providers: [
        {
          provide: FIREBASE_OPTIONS,
          useValue: options,
        },
        FirebaseService,
        FirebaseAuthGuard,
      ],
      exports: [FirebaseService, FirebaseAuthGuard],
    };
  }

  static forRootAsync(options: FirebaseModuleAsyncOptions): DynamicModule {
    return {
      module: FirebaseModule,
      imports: options.imports || [],
      providers: [
        ...this.createAsyncProviders(options),
        FirebaseService,
        FirebaseAuthGuard,
      ],
      exports: [FirebaseService, FirebaseAuthGuard],
    };
  }

  private static createAsyncProviders(
    options: FirebaseModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: FirebaseModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: FIREBASE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: FIREBASE_OPTIONS,
      useFactory: async (optionsFactory: FirebaseOptionsFactory) =>
        await optionsFactory.createFirebaseOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}