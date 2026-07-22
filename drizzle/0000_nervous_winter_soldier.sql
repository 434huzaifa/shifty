CREATE SCHEMA "shifty_schema";
--> statement-breakpoint
CREATE TABLE "shifty_schema"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
