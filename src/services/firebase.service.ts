import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { App } from 'firebase-admin/app';
import { Auth } from 'firebase-admin/auth';
import { Firestore } from 'firebase-admin/firestore';
import { FirebaseModuleOptions } from '../interfaces/firebase-options.interface';
import { FIREBASE_OPTIONS } from '../firebase.constants';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: App;
  private firebaseAuth: Auth;
  private firebaseFirestore: Firestore;

  constructor(
    @Inject(FIREBASE_OPTIONS) private options: FirebaseModuleOptions,
  ) {}

  async onModuleInit() {
    const serviceAccount = require(this.options.serviceAccountPath);
    
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    this.firebaseAuth = admin.auth(this.firebaseApp);
    this.firebaseFirestore = admin.firestore(this.firebaseApp);
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