import { Inject, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { App } from 'firebase-admin/app';
import { Auth } from 'firebase-admin/auth';
import { Firestore } from 'firebase-admin/firestore';
import { FirebaseModuleOptions } from '../interfaces/firebase-options.interface';
import { FIREBASE_OPTIONS } from '../firebase.constants';
import { readFileSync, existsSync } from 'fs';
import { join, isAbsolute } from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: App;
  private firebaseAuth: Auth;
  private firebaseFirestore: Firestore;

  constructor(
    @Inject(FIREBASE_OPTIONS) private options: FirebaseModuleOptions,
  ) {}

  async onModuleInit() {
    this.logger.debug(`Initializing Firebase with options: ${JSON.stringify(this.options, null, 2)}`);
    
    if (!this.options?.serviceAccountPath) {
      throw new Error(
        'Firebase service account path is required but was not provided. ' +
        'Please check that your environment variable FIREBASE_SERVICE_ACCOUNT_PATH is set ' +
        'and that the ConfigService is properly injected.'
      );
    }

    let serviceAccountPath = this.options.serviceAccountPath;
    if (!isAbsolute(serviceAccountPath)) {
      const oldPath = serviceAccountPath;
      serviceAccountPath = join(process.cwd(), serviceAccountPath);
      this.logger.debug(`Converting relative path '${oldPath}' to absolute path: '${serviceAccountPath}'`);
    }

    if (!existsSync(serviceAccountPath)) {
      throw new Error(
        `Firebase service account file not found at '${serviceAccountPath}'. ` +
        `Working directory is '${process.cwd()}'. ` +
        'Please ensure the file exists and the path is correct.'
      );
    }

    try {
      const serviceAccount = JSON.parse(
        readFileSync(serviceAccountPath, 'utf-8')
      );
      
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });

      this.firebaseAuth = admin.auth(this.firebaseApp);
      this.firebaseFirestore = admin.firestore(this.firebaseApp);
      
      this.logger.log('Firebase initialized successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(
        `Failed to initialize Firebase: Could not process service account file at '${serviceAccountPath}'. ` +
        `Error: ${errorMessage}`
      );
    }
  }

  get app(): App {
    return this.firebaseApp;
  }

  get auth(): Auth {
    return this.firebaseAuth;
  }

  get firestore(): Firestore {
    return this.firebaseFirestore;
  }
}