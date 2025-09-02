import { AuthorServiceImpl, BookServiceImpl, UserServiceImpl } from '../services';
import { CryptoServiceImplementation } from '../services/crypto-service';
import { EmailVerificationServiceImpl } from '../services/email-verification.service';
import {
  AppDependencies,
  AuthControllerDependencies,
  AuthorControllerDependencies,
  BookControllerDependencies,
} from './types';

export class DependencyContainer {
  private static instance: DependencyContainer;
  private dependencies: AppDependencies;

  private constructor() {
    this.dependencies = {
      authorService: new AuthorServiceImpl(),
      authService: new UserServiceImpl(),
      cryptoService: new CryptoServiceImplementation(),
      emailVerificationService: new EmailVerificationServiceImpl(),
      bookService: new BookServiceImpl(),
      userService: new UserServiceImpl(),
    };
  }
  static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }
  getAll(): AppDependencies {
    return this.dependencies;
  }
  getForAuthorController(): AuthorControllerDependencies {
    const { authorService, authService, cryptoService } = this.dependencies;
    return { authorService, authService, cryptoService };
  }

  getForAuthController(): AuthControllerDependencies {
    const { authService, cryptoService, emailVerificationService } = this.dependencies;
    return { authService, cryptoService, emailVerificationService };
  }

  getForBookController(): BookControllerDependencies {
    const { bookService, authService, cryptoService } = this.dependencies;
    if (!bookService) throw new Error('BookService not initialized');
    return { bookService, authService, cryptoService };
  }
  setDependencies(deps: Partial<AppDependencies>): void {
    this.dependencies = { ...this.dependencies, ...deps };
  }
  reset(): void {
    DependencyContainer.instance = new DependencyContainer();
  }
}

export const container = DependencyContainer.getInstance();
