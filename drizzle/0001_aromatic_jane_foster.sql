CREATE TABLE "shifty_schema"."saved_rotations" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"start_date" date NOT NULL,
	"pattern" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
