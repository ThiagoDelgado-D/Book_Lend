import {
  AuthorService,
  AuthService,
  BookService,
  CryptoService,
  EmailVerificationService,
  UserService,
} from 'app-domain';

export interface AppDependencies {
  authorService: AuthorService;
  authService: AuthService;
  bookService: BookService;
  cryptoService: CryptoService;
  emailVerificationService: EmailVerificationService;
  userService: UserService;
}

export type AuthorControllerDependencies = Pick<
  AppDependencies,
  'authorService' | 'authService' | 'cryptoService'
>;

export type AuthControllerDependencies = Pick<
  AppDependencies,
  'authService' | 'cryptoService' | 'emailVerificationService'
>;

export type BookControllerDependencies = Pick<
  AppDependencies,
  'bookService' | 'authService' | 'cryptoService'
>;
