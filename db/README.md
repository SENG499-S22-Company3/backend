# Database design entity relationship diagram

The entity relationship diagram shown uses crows foot notation. Each table has all the
attributes that should be stored within it present, but no foreign keys as that is an
implementation detail.


### Relationships

    Users are assigned a single role
    Users may or may not have teaching preferences
    Teaching preferences are linked to a certain course offering, which is attached to a term and a year

    A schedule is formed by a set of courseSections
    CourseSections reperesent a course offering for a course in a paticular year and term.
    Each CourseSection can have multiple meeting times(eg, monday 10-11:30, friday 4pm-6pm)



### Other explanations

To be filled in after receiving feedback.
