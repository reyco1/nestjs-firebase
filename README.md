<div align="center">
  <img src="https://nestjs.com/img/logo-small.svg" height="120" alt="Nest Logo" />
  <img src="https://firebase.google.com/static/downloads/brand-guidelines/SVG/logo-standard.svg" height="120" alt="Firebase Logo" />
</div>

# @reyco1/nestjs-firebase

A streamlined NestJS module that provides Firebase integration, including authentication, Firestore access, and Firebase Admin SDK initialization. This package simplifies the integration of Firebase services into your NestJS application with type-safe decorators and guards.

## Features

- 🔥 Firebase Admin SDK initialization with async configuration
- 🔒 Built-in authentication guard
- 🎯 Type-safe user decorators
- 📚 Easy access to Firestore, Auth, and Admin App instances
- 🔄 NestJS ConfigService integration

## Installation

```bash
npm install @reyco1/nestjs-firebase
```

## Dependencies

This package has the following peer dependencies:
- @nestjs/common: ^11.0.8
- @nestjs/core: ^11.0.8
- @nestjs/config: ^4.0.0
- firebase-admin: ^13.1.0

## Quick Start

1. Download your Firebase service account key JSON file from the Firebase Console.

2. Configure the Firebase module in your `app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseModule } from '@reyco1/nestjs-firebase';

@Module({
  imports: [
    ConfigModule.forRoot(),
    FirebaseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        serviceAccountPath: configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

3. Use the guard and decorators to protect your routes:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard, User, UserId } from '@reyco1/nestjs-firebase';

@Controller('protected')
@UseGuards(FirebaseAuthGuard)
export class ProtectedController {
  @Get()
  getProtectedResource(
    @UserId() userId: string,
    @User() user: FirebaseUser
  ) {
    return {
      message: 'This is protected',
      userId,
      userEmail: user.email
    };
  }
}
```

## API Reference

### Module Configuration

#### Async Configuration with ConfigService

```typescript
FirebaseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    serviceAccountPath: configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH'),
  }),
  inject: [ConfigService],
})
```

#### Direct Configuration

```typescript
FirebaseModule.forRoot({
  serviceAccountPath: './path/to/serviceAccountKey.json',
})
```

### FirebaseService

The `FirebaseService` provides direct access to Firebase Admin SDK instances:

```typescript
import { Injectable } from '@nestjs/common';
import { FirebaseService } from '@reyco1/nestjs-firebase';

@Injectable()
export class YourService {
  constructor(private firebaseService: FirebaseService) {}

  async someMethod() {
    // Access Firebase Admin instances
    const app = this.firebaseService.app;
    const auth = this.firebaseService.auth;
    const firestore = this.firebaseService.firestore;
  }
}
```

### Guards

#### FirebaseAuthGuard

Protects routes by validating Firebase ID tokens:

```typescript
@UseGuards(FirebaseAuthGuard)
@Get()
protectedRoute() {
  return 'This route is protected';
}
```

### Decorators

#### @User()

```typescript
// Get full user object
@User() user: FirebaseUser

// Get specific user property
@User('email') email: string
```

#### @UserId()

```typescript
@UserId() userId: string
```

### Interfaces

#### FirebaseUser

```typescript
interface FirebaseUser {
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
```

## Security Best Practices

1. **Environment Variables**: Store your service account path in environment variables:
```env
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

2. **Service Account Security**: Never commit your service account key to version control. Add to `.gitignore`:
```gitignore
serviceAccountKey.json
*-service-account.json
firebase-adminsdk.json
```

## Error Handling

The package throws standard NestJS exceptions:

- `UnauthorizedException`: Invalid or missing token
- Error initializing Firebase Admin SDK
- Invalid service account configuration

## TypeScript Support

This package is written in TypeScript and includes type definitions. No additional `@types` packages are required.

## License

MIT

## Author

reyco1