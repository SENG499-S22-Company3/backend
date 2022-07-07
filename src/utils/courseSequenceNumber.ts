import * as courseSequenceMapping from './courseSequenceMapping.json';

const sequences = courseSequenceMapping.sequences;

export function getSeqNumber(subject: string, code: string): string {
  const foundSubject = sequences.find((e) => e.subject === subject);

  const foundCourse = foundSubject?.courses.find((e) => e.course === code);

  if (foundCourse === undefined) {
    return '4B'; // If no sequence number found, it can be in 4B at the latest
  } else {
    return foundCourse.sequence;
  }
}
