import { DefaultApi as Algo1 } from '../client/algorithm1/api';
import { DefaultApi as Algo2 } from '../client/algorithm2/api';

const algoUrl = {
  algorithm1: {
    company3: process.env.ALGO1_COMPANY_3_URL || 'http://localhost:8080',
    company4: process.env.ALGO1_COMPANY_4_URL || 'http://localhost:8080',
  },
  algorithm2: {
    company3: process.env.ALGO2_COMPANY_3_URL || 'http://localhost:8080',
    company4: process.env.ALGO2_COMPANY_4_URL || 'http://localhost:8080',
  },
};
console.info('Setting up Algorithm APIs...');
console.info('Algorithm 1 (Company 3) ->', algoUrl.algorithm1.company3);
console.info('Algorithm 1 (Company 4) ->', algoUrl.algorithm1.company4);
console.info('Algorithm 2 (Company 3) ->', algoUrl.algorithm2.company3);
console.info('Algorithm 2 (Company 4) ->', algoUrl.algorithm2.company4);

// Instantiate api clients

export const algorithm = {
  algo1: {
    company3: new Algo1(undefined, algoUrl.algorithm1.company3),
    company4: new Algo1(undefined, algoUrl.algorithm1.company4),
  },
  algo2: {
    company3: new Algo2(undefined, algoUrl.algorithm2.company3),
    company4: new Algo2(undefined, algoUrl.algorithm2.company4),
  },
};
