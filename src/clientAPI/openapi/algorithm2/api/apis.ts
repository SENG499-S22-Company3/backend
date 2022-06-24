export * from './defaultApi';
import { Algorithm2API } from './defaultApi';
import * as http from 'http';

export class HttpError extends Error {
  constructor(
    public response: http.IncomingMessage,
    public body: any,
    public statusCode?: number
  ) {
    super('HTTP request failed');
    this.name = 'HttpError';
  }
}

export { RequestFile } from '../model/models';

export const Algorithm2 = [Algorithm2API];
