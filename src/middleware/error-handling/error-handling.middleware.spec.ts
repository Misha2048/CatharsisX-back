import { ErrorHandlingMiddleware } from './error-handling.middleware';

describe('ErrorHandlingMiddleware', () => {
  it('should be defined', () => {
    expect(new ErrorHandlingMiddleware()).toBeDefined();
  });
});
