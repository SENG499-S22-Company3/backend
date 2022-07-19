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
// after importing the generated api

const createSchedule =
  (instance: AxiosInstance) => (input: SchedulePostRequest) => {
    return instance.post<Schedule>('/schedule', input);
  };

const createPredict = (instance: AxiosInstance) => (input: CourseObject[]) => {
  return instance.post<CourseObject[]>('/predict_class_size', input);
};

const checkSchedule =
  (instance: AxiosInstance) => (input: SchedulePostRequest) => {
    return instance.post<String>('/checkSchedule', input);
  };

const algo1c3Cs = checkSchedule(
  axios.create({
    baseURL: algoUrl.algorithm1.company3,
  })
);

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

export const request = (company: Company) => {
  if (company === 'COMPANY3') {
    return {
      algo1: algo1c3,
      algo2: algo2c3,
      algo1Cs: algo1c3Cs,
    };
  }
  return {
    algo1: algo1c4,
    algo2: algo2c4,
  };
};

console.info('Setting up Algorithm APIs...');
console.info('Algorithm 1 (Company 3) ->', algoUrl.algorithm1.company3);
console.info('Algorithm 1 (Company 4) ->', algoUrl.algorithm1.company4);
console.info('Algorithm 2 (Company 3) ->', algoUrl.algorithm2.company3);
console.info('Algorithm 2 (Company 4) ->', algoUrl.algorithm2.company4);
