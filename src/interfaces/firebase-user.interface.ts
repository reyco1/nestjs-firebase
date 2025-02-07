export interface FirebaseUser {
    uid: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    phoneNumber?: string;
    disabled?: boolean;
    emailVerified?: boolean;
    metadata?: {
      creationTime?: string;
      lastSignInTime?: string;
    };
    customClaims?: { [key: string]: any };
    [key: string]: any;
  }