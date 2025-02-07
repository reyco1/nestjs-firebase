// Module exports
export { FirebaseModule } from './firebase.module';

// Service exports
export { FirebaseService } from './services/firebase.service';

// Guard exports
export { FirebaseAuthGuard } from './guards/firebase-auth.guard';

// Decorator exports
export { User } from './decorators/user.decorator';
export { UserId } from './decorators/user-id.decorator';

// Interface exports
export { FirebaseUser } from './interfaces/firebase-user.interface';
export {
  FirebaseModuleOptions,
  FirebaseOptionsFactory,
  FirebaseModuleAsyncOptions,
} from './interfaces/firebase-options.interface';

// Constant exports
export { FIREBASE_OPTIONS } from './firebase.constants';