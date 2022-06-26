import { DefaultApi as Algo1 } from '../client/algorithm1';
import { DefaultApi as Algo2 } from '../client/algorithm2';

// Instantiate api clients
export const algorithm1 = new Algo1(
  undefined,
  process.env.ALGO1_URL || 'http://localhost:8080'
);
export const algorithm2 = new Algo2(
  undefined,
  process.env.ALGO2_URL || 'http://localhost:5000'
);
