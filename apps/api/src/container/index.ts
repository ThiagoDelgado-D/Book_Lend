import { container } from './container.js';

export * from './types';

export const getDependencies = () => container.getAll();
export const getAuthorDependencies = () => container.getForAuthorController();
export const getAuthDependencies = () => container.getForAuthController();
export const getBookDependencies = () => container.getForBookController();
