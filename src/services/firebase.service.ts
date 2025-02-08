import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
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
  private firebaseApp: App;
  private firebaseAuth: Auth;
  private firebaseFirestore: Firestore;

  constructor(
    @Inject(FIREBASE_OPTIONS) private options: FirebaseModuleOptions,
  ) {}

  async onModuleInit() {
    if (!this.options?.serviceAccountPath) {
      throw new Error(
        'Firebase service account path or credential is required but was not provided. ' +
        'Please check that your environment variable FIREBASE_SERVICE_ACCOUNT_PATH is set ' +
        'or that a valid credential was provided, and that the ConfigService is properly injected.'
      );
    }

    let credential: admin.credential.Credential;

    if (typeof this.options.serviceAccountPath === 'string') {
      let serviceAccountPath = this.options.serviceAccountPath;
      if (!isAbsolute(serviceAccountPath)) {
        serviceAccountPath = join(process.cwd(), serviceAccountPath);
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
        credential = admin.credential.cert(serviceAccount);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(
          `Failed to initialize Firebase: Could not process service account file at '${serviceAccountPath}'. ` +
          `Error: ${errorMessage}`
        );
      }
    } else {
      // If serviceAccountPath is already a Credential instance
      credential = this.options.serviceAccountPath;
    }

    try {
      this.firebaseApp = admin.initializeApp({
        credential
      });

      this.firebaseAuth = admin.auth(this.firebaseApp);
      this.firebaseFirestore = admin.firestore(this.firebaseApp);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(
        `Failed to initialize Firebase: ${errorMessage}`
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