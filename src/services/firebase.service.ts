import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { App } from 'firebase-admin/app';
import { Auth } from 'firebase-admin/auth';
import { Firestore } from 'firebase-admin/firestore';
import { FirebaseModuleOptions } from '../interfaces/firebase-options.interface';
import { FIREBASE_OPTIONS } from '../firebase.constants';
import { readFileSync } from 'fs';
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
      throw new Error('Firebase service account path is required. Please provide it in the module options.');
    }

    let serviceAccountPath = this.options.serviceAccountPath;
    if (!isAbsolute(serviceAccountPath)) {
      serviceAccountPath = join(process.cwd(), serviceAccountPath);
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
    } catch (error) {
      throw new Error(`Failed to initialize Firebase: Could not read service account file at ${serviceAccountPath}. Error: ${error.message}`);
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