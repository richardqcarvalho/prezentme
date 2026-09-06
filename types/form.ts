import z from "zod";

export const personalInfoSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  role: z.string().nonempty(),
  location: z.string().nonempty(),
});

export const contactSchema = z.object({
  gitHub: z.string().nonempty(),
  linkedIn: z.string().nonempty(),
  number: z.string().nonempty(),
  email: z.string().nonempty(),
});

export const languageSchema = z.object({
  language: z.array(
    z.object({
      name: z.string().nonempty(),
      level: z.string().nonempty(),
    }),
  ),
});

export const experienceSchema = z.object({
  experience: z.array(
    z.object({
      title: z.string().nonempty(),
      company: z.string().nonempty(),
      start: z.string().nonempty(),
      end: z.string().nonempty(),
      description: z.string().nonempty(),
      technologies: z.array(z.string()).nonempty(),
    }),
  ),
});

export const educationSchema = z.object({
  education: z
    .array(
      z.object({
        title: z.string().nonempty(),
        university: z.string().nonempty(),
        start: z.string().nonempty(),
        end: z.string(),
      }),
    )
    .min(1),
});

export const projectSchema = z.object({
  project: z
    .array(
      z.object({
        title: z.string().nonempty(),
        url: z.string().nonempty(),
        description: z.string().nonempty(),
        technologies: z.array(z.string().nonempty()),
      }),
    )
    .min(1),
});

export const setupSchema = z.object({
  setup: z
    .array(
      z.object({
        name: z.string().trim().min(1, "Enter an item name."),
        specs: z.string().trim().min(1, "Describe the item."),
      }),
    )
    .min(1, "Add at least one setup item."),
});

export type PersonalInfoT = z.infer<typeof personalInfoSchema>;
export type ContactT = z.infer<typeof contactSchema>;
export type LanguageT = z.infer<typeof languageSchema>;
export type ExperienceT = z.infer<typeof experienceSchema>;
export type EducationT = z.infer<typeof educationSchema>;
export type ProjectT = z.infer<typeof projectSchema>;
export type SetupT = z.infer<typeof setupSchema>;
