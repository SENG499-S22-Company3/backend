import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

/** Returned when a user logs in our logs out. */
export type AuthPayload = {
  __typename?: 'AuthPayload';
  /** Optional error message if success is false */
  message?: Maybe<Scalars['String']>;
  /** Whether auth operation was successful or not */
  success: Scalars['Boolean'];
  /** Auth token used for future requests */
  token: Scalars['String'];
};

export type ChangeUserPasswordInput = {
  currentPassword: Scalars['String'];
  newPassword: Scalars['String'];
};

export type CourseId = {
  __typename?: 'CourseID';
  /** Course code, e.g. 499, 310 */
  code: Scalars['String'];
  /** Course subject, e.g. SENG, CSC */
  subject: Scalars['String'];
  /** Term course is offered in */
  term: Term;
  /** Course title. e.g. Introduction to Artificial Intelligence */
  title: Scalars['String'];
};

export type CoursePreference = {
  __typename?: 'CoursePreference';
  id: CourseId;
  preference: Scalars['Int'];
};

export type CoursePreferenceInput = {
  /** Course code, e.g. 499, 310 */
  code: Scalars['String'];
  preference: Scalars['Int'];
  /** Course subject, e.g. SENG, CSC */
  subject: Scalars['String'];
  /** Term course is offered in */
  term: Term;
};

/** A set of CourseSections with matching CourseID represent a course offering */
export type CourseSection = {
  __typename?: 'CourseSection';
  /** The course identifier */
  CourseID: CourseId;
  /** Maximum capacity of the section */
  capacity: Scalars['Int'];
  /** The end date of the course */
  endDate: Scalars['Date'];
  /** How many hours per week a course takes */
  hoursPerWeek: Scalars['Float'];
  /** Days of the week the class is offered in - see Day */
  meetingTimes: Array<MeetingTime>;
  /** Professor's info, if any professors are assigned */
  professors?: Maybe<Array<User>>;
  /** Section number for courses, eg: A01, A02 */
  sectionNumber?: Maybe<Scalars['String']>;
  /** The start date of the course */
  startDate: Scalars['Date'];
};

export type CreateTeachingPreferenceInput = {
  courses: Array<CoursePreferenceInput>;
  hasRelief: Scalars['Boolean'];
  hasTopic: Scalars['Boolean'];
  nonTeachingTerm?: InputMaybe<Term>;
  peng: Scalars['Boolean'];
  reliefReason?: InputMaybe<Scalars['String']>;
  topicDescription?: InputMaybe<Scalars['String']>;
  userId: Scalars['ID'];
};

export type CreateUserMutationResult = {
  __typename?: 'CreateUserMutationResult';
  message?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  username?: Maybe<Scalars['String']>;
};

/** Days of the Week */
export enum Day {
  Friday = 'FRIDAY',
  Monday = 'MONDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
  Thursday = 'THURSDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY'
}

export type Error = {
  __typename?: 'Error';
  errors?: Maybe<Array<Error>>;
  message: Scalars['String'];
};

export type GenerateScheduleInput = {
  courses?: InputMaybe<Scalars['String']>;
  term: Term;
  year: Scalars['Int'];
};

/** Weekday and time of a course section offering */
export type MeetingTime = {
  __typename?: 'MeetingTime';
  /** Weekday - see DayEnum */
  day: Day;
  /** End time */
  endTime: Scalars['Date'];
  /** Start time */
  startTime: Scalars['Date'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Change the password of the currently logged in user */
  changeUserPassword: Response;
  /** Teaching preferences */
  createTeachingPreference: Response;
  /** Register a new user account */
  createUser: CreateUserMutationResult;
  /** Generate schedule */
  generateSchedule: Response;
  /** Login into a user account using email and password */
  login: AuthPayload;
  /** Logout the currently logged in user */
  logout: AuthPayload;
  /** Reset a users password. */
  resetPassword: ResetPasswordMutationResult;
  /** Updates a user given the user id. */
  updateUser?: Maybe<UpdateUserMutationResult>;
};


export type MutationChangeUserPasswordArgs = {
  input: ChangeUserPasswordInput;
};


export type MutationCreateTeachingPreferenceArgs = {
  input: CreateTeachingPreferenceInput;
};


export type MutationCreateUserArgs = {
  username: Scalars['String'];
};


export type MutationGenerateScheduleArgs = {
  input: GenerateScheduleInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  /** Get all courses preferences  */
  coursePreferences?: Maybe<Array<CoursePreference>>;
  /** Get a list of courses for a given term */
  courses?: Maybe<Array<CourseSection>>;
  /** Find a user by their id */
  findUserById?: Maybe<User>;
  /** Get the current user */
  me?: Maybe<User>;
  /** Schedule for a given term. If year is given, returns the most recent schedule generated for that year. */
  schedule?: Maybe<Schedule>;
  /** Get Teaching Preference Survey */
  survey: TeachingPreferenceSurvey;
};


export type QueryCoursesArgs = {
  term?: InputMaybe<Term>;
};


export type QueryFindUserByIdArgs = {
  id: Scalars['ID'];
};


export type QueryScheduleArgs = {
  year?: InputMaybe<Scalars['Int']>;
};

export type ResetPasswordMutationResult = {
  __typename?: 'ResetPasswordMutationResult';
  /** Optional error message */
  message?: Maybe<Scalars['String']>;
  /** New user password */
  password?: Maybe<Scalars['String']>;
  /** Whether the password was successfully reset */
  success: Scalars['Boolean'];
};

export type Response = {
  __typename?: 'Response';
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

/** User role */
export enum Role {
  /** Administrator role (department staff etc.) */
  Admin = 'ADMIN',
  /** User role (professor, student etc.) */
  User = 'USER'
}

/** Generated schedule for a year */
export type Schedule = {
  __typename?: 'Schedule';
  /** Scheduled courses */
  courses?: Maybe<Array<CourseSection>>;
  /** When the schedule was generated */
  createdAt: Scalars['Date'];
  /** ID of the schedule */
  id: Scalars['ID'];
  /** Year for the schedule */
  year: Scalars['Int'];
};


/** Generated schedule for a year */
export type ScheduleCoursesArgs = {
  term: Term;
};

export type TeachingPreferenceSurvey = {
  __typename?: 'TeachingPreferenceSurvey';
  courses: Array<CourseId>;
};

/** UVic Terms */
export enum Term {
  Fall = 'FALL',
  Spring = 'SPRING',
  Summer = 'SUMMER'
}

export type UpdateUserInput = {
  /** ID of user to update */
  id: Scalars['ID'];
};

export type UpdateUserMutationResult = {
  __typename?: 'UpdateUserMutationResult';
  errors?: Maybe<Array<Error>>;
  user?: Maybe<User>;
};

export type User = {
  __typename?: 'User';
  /** Determine if the user is marked active */
  active: Scalars['Boolean'];
  /** Display name for professors */
  displayName: Scalars['String'];
  /** Determine if user has Peng */
  hasPeng: Scalars['Boolean'];
  /** Unique User  ID */
  id: Scalars['Int'];
  /** Password */
  password: Scalars['String'];
  /** Teaching preferences */
  preferences?: Maybe<Array<CoursePreference>>;
  /** role - see enum Role */
  role: Role;
  /** Username */
  username: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ChangeUserPasswordInput: ChangeUserPasswordInput;
  CourseID: ResolverTypeWrapper<CourseId>;
  CoursePreference: ResolverTypeWrapper<CoursePreference>;
  CoursePreferenceInput: CoursePreferenceInput;
  CourseSection: ResolverTypeWrapper<CourseSection>;
  CreateTeachingPreferenceInput: CreateTeachingPreferenceInput;
  CreateUserMutationResult: ResolverTypeWrapper<CreateUserMutationResult>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Day: Day;
  Error: ResolverTypeWrapper<Error>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  GenerateScheduleInput: GenerateScheduleInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  MeetingTime: ResolverTypeWrapper<MeetingTime>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  ResetPasswordMutationResult: ResolverTypeWrapper<ResetPasswordMutationResult>;
  Response: ResolverTypeWrapper<Response>;
  Role: Role;
  Schedule: ResolverTypeWrapper<Schedule>;
  String: ResolverTypeWrapper<Scalars['String']>;
  TeachingPreferenceSurvey: ResolverTypeWrapper<TeachingPreferenceSurvey>;
  Term: Term;
  UpdateUserInput: UpdateUserInput;
  UpdateUserMutationResult: ResolverTypeWrapper<UpdateUserMutationResult>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthPayload: AuthPayload;
  Boolean: Scalars['Boolean'];
  ChangeUserPasswordInput: ChangeUserPasswordInput;
  CourseID: CourseId;
  CoursePreference: CoursePreference;
  CoursePreferenceInput: CoursePreferenceInput;
  CourseSection: CourseSection;
  CreateTeachingPreferenceInput: CreateTeachingPreferenceInput;
  CreateUserMutationResult: CreateUserMutationResult;
  Date: Scalars['Date'];
  Error: Error;
  Float: Scalars['Float'];
  GenerateScheduleInput: GenerateScheduleInput;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  MeetingTime: MeetingTime;
  Mutation: {};
  Query: {};
  ResetPasswordMutationResult: ResetPasswordMutationResult;
  Response: Response;
  Schedule: Schedule;
  String: Scalars['String'];
  TeachingPreferenceSurvey: TeachingPreferenceSurvey;
  UpdateUserInput: UpdateUserInput;
  UpdateUserMutationResult: UpdateUserMutationResult;
  User: User;
};

export type AuthPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourseIdResolvers<ContextType = any, ParentType extends ResolversParentTypes['CourseID'] = ResolversParentTypes['CourseID']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  term?: Resolver<ResolversTypes['Term'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoursePreferenceResolvers<ContextType = any, ParentType extends ResolversParentTypes['CoursePreference'] = ResolversParentTypes['CoursePreference']> = {
  id?: Resolver<ResolversTypes['CourseID'], ParentType, ContextType>;
  preference?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourseSectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CourseSection'] = ResolversParentTypes['CourseSection']> = {
  CourseID?: Resolver<ResolversTypes['CourseID'], ParentType, ContextType>;
  capacity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  hoursPerWeek?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  meetingTimes?: Resolver<Array<ResolversTypes['MeetingTime']>, ParentType, ContextType>;
  professors?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
  sectionNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateUserMutationResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateUserMutationResult'] = ResolversParentTypes['CreateUserMutationResult']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type ErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = {
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MeetingTimeResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeetingTime'] = ResolversParentTypes['MeetingTime']> = {
  day?: Resolver<ResolversTypes['Day'], ParentType, ContextType>;
  endTime?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  changeUserPassword?: Resolver<ResolversTypes['Response'], ParentType, ContextType, RequireFields<MutationChangeUserPasswordArgs, 'input'>>;
  createTeachingPreference?: Resolver<ResolversTypes['Response'], ParentType, ContextType, RequireFields<MutationCreateTeachingPreferenceArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['CreateUserMutationResult'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'username'>>;
  generateSchedule?: Resolver<ResolversTypes['Response'], ParentType, ContextType, RequireFields<MutationGenerateScheduleArgs, 'input'>>;
  login?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'password' | 'username'>>;
  logout?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType>;
  resetPassword?: Resolver<ResolversTypes['ResetPasswordMutationResult'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'id'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['UpdateUserMutationResult']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  coursePreferences?: Resolver<Maybe<Array<ResolversTypes['CoursePreference']>>, ParentType, ContextType>;
  courses?: Resolver<Maybe<Array<ResolversTypes['CourseSection']>>, ParentType, ContextType, Partial<QueryCoursesArgs>>;
  findUserById?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryFindUserByIdArgs, 'id'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  schedule?: Resolver<Maybe<ResolversTypes['Schedule']>, ParentType, ContextType, Partial<QueryScheduleArgs>>;
  survey?: Resolver<ResolversTypes['TeachingPreferenceSurvey'], ParentType, ContextType>;
};

export type ResetPasswordMutationResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResetPasswordMutationResult'] = ResolversParentTypes['ResetPasswordMutationResult']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Response'] = ResolversParentTypes['Response']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScheduleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Schedule'] = ResolversParentTypes['Schedule']> = {
  courses?: Resolver<Maybe<Array<ResolversTypes['CourseSection']>>, ParentType, ContextType, RequireFields<ScheduleCoursesArgs, 'term'>>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  year?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeachingPreferenceSurveyResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeachingPreferenceSurvey'] = ResolversParentTypes['TeachingPreferenceSurvey']> = {
  courses?: Resolver<Array<ResolversTypes['CourseID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateUserMutationResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateUserMutationResult'] = ResolversParentTypes['UpdateUserMutationResult']> = {
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasPeng?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  preferences?: Resolver<Maybe<Array<ResolversTypes['CoursePreference']>>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  CourseID?: CourseIdResolvers<ContextType>;
  CoursePreference?: CoursePreferenceResolvers<ContextType>;
  CourseSection?: CourseSectionResolvers<ContextType>;
  CreateUserMutationResult?: CreateUserMutationResultResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Error?: ErrorResolvers<ContextType>;
  MeetingTime?: MeetingTimeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ResetPasswordMutationResult?: ResetPasswordMutationResultResolvers<ContextType>;
  Response?: ResponseResolvers<ContextType>;
  Schedule?: ScheduleResolvers<ContextType>;
  TeachingPreferenceSurvey?: TeachingPreferenceSurveyResolvers<ContextType>;
  UpdateUserMutationResult?: UpdateUserMutationResultResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

