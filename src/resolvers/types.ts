export interface Schedule {
  fallTermCourses: Course[] | null;
  springTermCourses: Course[] | null;
  summerTermCourses: Course[] | null;
}

export interface Course {
  courseNumber: string;
  subject: string;
  sequenceNumber: string;
  courseTitle: string;
  streamSequence: string;
  meetingTime: MeetingTime;
  prof: Prof;
}

export interface MeetingTime {
  startDate: string;
  endDate: string;
  beginTime: string;
  endtime: string;
  hoursWeek: number;
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
}

export interface Prof {
  displayName: string;
}
