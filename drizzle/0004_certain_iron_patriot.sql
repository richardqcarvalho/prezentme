ALTER TABLE "education" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "languages" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;