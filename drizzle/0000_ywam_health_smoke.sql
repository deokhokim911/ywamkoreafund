CREATE TABLE IF NOT EXISTS "_ywam_health" (
	"id" boolean PRIMARY KEY DEFAULT true NOT NULL,
	"checked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"note" text DEFAULT 'd0-smoke' NOT NULL
);
--> statement-breakpoint
COMMENT ON TABLE "_ywam_health" IS 'D0 Drizzle/Supabase connectivity smoke table — not domain data';
