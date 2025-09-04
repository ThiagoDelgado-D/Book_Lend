import type { ApiEndpoint } from './types.js';

export const API_ENDPOINTS = {
  sendEmailVerification: {
    method: 'POST',
    path: '/auth/send-verification',
    requiresAuth: false,
  } as ApiEndpoint,

  verifyEmailToken: {
    method: 'GET',
    path: '/auth/verify-token/{token}',
    requiresAuth: false,
  } as ApiEndpoint,

  completeRegistration: {
    method: 'POST',
    path: '/auth/complete-registration',
    requiresAuth: false,
  } as ApiEndpoint,

  login: {
    method: 'POST',
    path: '/auth/login',
    requiresAuth: false,
  } as ApiEndpoint,

  refreshToken: {
    method: 'POST',
    path: '/auth/refresh',
    requiresAuth: true,
  } as ApiEndpoint,

  getProfile: {
    method: 'GET',
    path: '/auth/profile',
    requiresAuth: true,
  } as ApiEndpoint,

  getAllAuthors: {
    method: 'GET',
    path: '/authors',
    requiresAuth: false,
  } as ApiEndpoint,

  getAuthorById: {
    method: 'GET',
    path: '/authors/{id}',
    requiresAuth: false,
  } as ApiEndpoint,

  searchAuthors: {
    method: 'GET',
    path: '/authors/search',
    requiresAuth: false,
  } as ApiEndpoint,

  getPopularAuthors: {
    method: 'GET',
    path: '/authors/popular',
    requiresAuth: false,
  } as ApiEndpoint,

  createAuthor: {
    method: 'POST',
    path: '/authors',
    requiresAuth: true,
  } as ApiEndpoint,

  updateAuthor: {
    method: 'PUT',
    path: '/authors/{id}',
    requiresAuth: true,
  } as ApiEndpoint,

  deleteAuthor: {
    method: 'DELETE',
    path: '/authors/{id}',
    requiresAuth: true,
  } as ApiEndpoint,

  getAllBooks: {
    method: 'GET',
    path: '/books',
    requiresAuth: false,
  } as ApiEndpoint,

  getBookById: {
    method: 'GET',
    path: '/books/{id}',
    requiresAuth: false,
  } as ApiEndpoint,

  searchBooks: {
    method: 'GET',
    path: '/books/search',
    requiresAuth: false,
  } as ApiEndpoint,

  getPopularBooks: {
    method: 'GET',
    path: '/books/popular',
    requiresAuth: false,
  } as ApiEndpoint,

  createBook: {
    method: 'POST',
    path: '/books',
    requiresAuth: true,
  } as ApiEndpoint,

  updateBook: {
    method: 'PUT',
    path: '/books/{id}',
    requiresAuth: true,
  } as ApiEndpoint,

  deleteBook: {
    method: 'DELETE',
    path: '/books/{id}',
    requiresAuth: true,
  } as ApiEndpoint,

  healthCheck: {
    method: 'GET',
    path: '/health',
    requiresAuth: false,
  } as ApiEndpoint,
} as const;

export type EndpointKey = keyof typeof API_ENDPOINTS;
