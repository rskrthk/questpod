import { bigint, boolean } from "drizzle-orm/gel-core";
import {
  date,
  integer,
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const MockInterview = pgTable("mockInterview", {
  id: serial("id").primaryKey(),
  mockId: varchar("mockId").notNull(),
  jsonMockResp: text("jsonMockResp").notNull(),
  jobPosition: varchar("jobPosition").notNull(),
  jobDesc: varchar("jobDesc").notNull(),
  jobExperience: varchar("jobExperience").notNull(),
  resumeSummary: text("resumeSummary").notNull(),
  difficulty: varchar("difficulty").notNull(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt"),
  totalTimeInSeconds: integer("totalTimeInSeconds"),
});

export const UserAnswer = pgTable("userAnswer", {
  id: serial("id").primaryKey(),
  mockIdRef: varchar("mockId").notNull(),
  question: varchar("question").notNull(),
  correctAns: text("correctAns"),
  userAns: text("userAns"),
  questionIndex: integer("questionIndex"),
  feedback: text("feedback"),
  rating: varchar("rating"),
  userEmail: varchar("userEmail"),
  createdAt: varchar("createdAt"),
  timeToAskInSeconds: integer("timeToAskInSeconds"),
  timeToAnswerInSeconds: integer("timeToAnswerInSeconds"),
});

export const User = pgTable("user", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  mobNo: bigint("mobNo").notNull(),
  password: varchar("password").notNull(),
  userName: varchar("userName"),
  role: varchar("role"),
  address: text("address"),
  logo: text("logo"),
  adminId: text("adminId"),
  collegeId: text("collegeId"),
  resume: text("resume"),
  resumeName: text("resumeName"),
  createdAt: varchar("createdAt"),
  status: varchar("status").default("Active"),
});


export const userResumeString = pgTable("user_resume_string", {
  id: serial("id").primaryKey(),
  resumeJsonString: text("resume_json_string").notNull(),
  careerLevel: text("careerLevel").notNull(),
  status: varchar("status", { length: 20 }).default("Active"),
  createdBy: varchar("createdBy", { length: 150 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


export const apiCredentials = pgTable(
  "api_credentials",
  {
    id: serial("id").primaryKey(),
    apiKey: text("api_key").notNull(),
    primaryKey: text("primary_key"),
    secondaryKey: text("secondary_key"),
    button: varchar("button", { length: 50 }),
    status: varchar("status", { length: 20 }).default("Active"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    apiKeyUnique: unique().on(table.apiKey), // ✅ Add this line
  })
);

export const Stack = pgTable("stack", {
  id: serial("id").primaryKey(),
  stackName: varchar("stack_name", { length: 100 }).notNull().unique(),
  count: integer("count").notNull().default(1), // default count is 1
  status: varchar("status", { length: 20 }).default("Active"),
});


export const userResume = pgTable("user_resume", {
  id: serial("id").primaryKey(),
  resumeJsonString: text("resumeJsonString").notNull(),
  status: varchar("status", { length: 20 }).default("Active"),
  createdBy: varchar("createdBy", { length: 150 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
}, (table) => ({
  uniqueCreatedBy: unique().on(table.createdBy),
}));


export const ContactForm = pgTable("contact_form", {
  id: serial("id").primaryKey(),
  universityName: varchar("universityName", { length: 150 }).notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 150 }).notNull(),
  issueType: varchar("issueType", { length: 50 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  attachmentUrl: varchar("attachmentUrl", { length: 255 }), // file path or URL
  status: varchar("status", { length: 20 }).default("Active"),
  createdAt: timestamp("createdAt").defaultNow(),
});


export const Enquiry = pgTable("enquiry", {
  id: serial("id").primaryKey(),
  universityName: varchar("universityName", { length: 150 }).notNull(),
  position: varchar("position", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).notNull(),
  contactNumber: varchar("contactNumber", { length: 20 }).notNull(),
  plan: varchar("plan", { length: 50 }).notNull(),
  message: text("message").notNull(),
});

export const Job = pgTable("job", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  company: varchar("company").notNull(),
  location: varchar("location").notNull(),
  type: varchar("type").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  salary: varchar("salary"),
  applicationLink: text("applicationLink"),
  noticePeriod: varchar("noticePeriod"),
  skills: text("skills"),
  experience: varchar("experience"),
  expireIn: timestamp("expireIn"),
  companyIcon: text("companyIcon"),
  customQuestions: text("customQuestions"),
  status: varchar("status").default("Active"),
  adminId: text("adminId"), // To link to the admin who created it
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const SavedJob = pgTable("saved_job", {
  id: serial("id").primaryKey(),
  jobId: integer("jobId").references(() => Job.id).notNull(),
  userId: integer("userId").references(() => User.id).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const Application = pgTable("application", {
  id: serial("id").primaryKey(),
  jobId: integer("jobId").references(() => Job.id).notNull(),
  userId: integer("userId").references(() => User.id).notNull(),
  status: varchar("status").default("Resume Sent to Company"),
  answers: text("answers"), // JSON string for custom answers
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});
