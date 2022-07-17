import axios, { AxiosInstance } from 'axios';

import { SchedulePostRequest, Schedule } from '../client/algorithm1';
import { CourseObject } from '../client/algorithm2';
import { Company } from '../schema';

// these are the default ports for each algo and company
export const algoUrl = {
  algorithm1: {
    company3: process.env.ALGO1_COMPANY_3_URL || 'http://localhost:8080',
    company4: process.env.ALGO1_COMPANY_4_URL || 'http://localhost:8000',
  },
  algorithm2: {
    company3: process.env.ALGO2_COMPANY_3_URL || 'http://localhost:5000',
    company4: process.env.ALGO2_COMPANY_4_URL || 'http://localhost:5000',
  },
};

const createSchedule =
  (instance: AxiosInstance) => (input: SchedulePostRequest) => {
    return instance.post<Schedule>('/schedule', input);
  };

const createPredict = (instance: AxiosInstance) => (input: CourseObject[]) => {
  return instance.post<CourseObject[]>('/predict_class_size', input);
};

const algo1c3 = createSchedule(
  axios.create({
    baseURL: algoUrl.algorithm1.company3,
  })
);

const algo1c4 = createSchedule(
  axios.create({
    baseURL: algoUrl.algorithm1.company4,
  })
);

const algo2c3 = createPredict(
  axios.create({
    baseURL: algoUrl.algorithm2.company3,
  })
);

const algo2c4 = createPredict(
  axios.create({
    baseURL: algoUrl.algorithm2.company4,
  })
);

// Set of endpoints returned when calling request for company 3 or company 4 algorithms.
export const company3AxiosEndpoints = {
  algo1: algo1c3,
  algo2: algo2c3,
};

export const company4AxiosEndpoints = {
  algo1: algo1c4,
  algo2: algo2c4,
};

export const request = (company: Company) => {
  if (company === 'COMPANY3') {
    return company3AxiosEndpoints;
  }
  return company4AxiosEndpoints;
};

console.info('Setting up Algorithm APIs...');
console.info('Algorithm 1 (Company 3) ->', algoUrl.algorithm1.company3);
console.info('Algorithm 1 (Company 4) ->', algoUrl.algorithm1.company4);
console.info('Algorithm 2 (Company 3) ->', algoUrl.algorithm2.company3);
console.info('Algorithm 2 (Company 4) ->', algoUrl.algorithm2.company4);
