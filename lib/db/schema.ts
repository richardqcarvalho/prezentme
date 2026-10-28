import { index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  githubId: varchar("github_id", { length: 32 }).notNull().unique(),
  githubLogin: varchar("github_login", { length: 255 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  location: text("location"),
  role: varchar("role", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const languages = pgTable(
  "languages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    language: varchar("language", { length: 50 }).notNull(),
    fluency: varchar("fluency", { length: 20 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("languages_user_id_idx").on(t.userId)],
);

export const education = pgTable(
  "education",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    degree: varchar("degree", { length: 150 }).notNull(),
    level: varchar("level", { length: 20 }).notNull(),
    university: varchar("university", { length: 150 }).notNull(),
    startDate: varchar("start_date", { length: 7 }),
    endDate: varchar("end_date", { length: 7 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("education_user_id_idx").on(t.userId)],
);

export const experiences = pgTable(
  "experiences",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    company: varchar("company", { length: 150 }).notNull(),
    role: varchar("role", { length: 150 }).notNull(),
    description: text("description"),
    startDate: varchar("start_date", { length: 7 }),
    endDate: varchar("end_date", { length: 7 }),
    technologies: text("technologies").array(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("experiences_user_id_idx").on(t.userId)],
);

export const setups = pgTable(
  "setups",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("setups_user_id_idx").on(t.userId)],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Language = typeof languages.$inferSelect;
export type NewLanguage = typeof languages.$inferInsert;
export type Education = typeof education.$inferSelect;
export type NewEducation = typeof education.$inferInsert;
export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;
export type Setup = typeof setups.$inferSelect;
export type NewSetup = typeof setups.$inferInsert;
