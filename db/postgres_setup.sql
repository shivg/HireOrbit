create database hireorbit;

create user hireorbit;

GRANT ALL PRIVILEDGES ON hireorbit to hireorbit;

use hireorbit;

create table IF NOT EXISTS indeed_jobs (
  internal_id SERIAL PRIMARY KEY,
  jobtitle text,
  company text,
  city text,
  state text,
  country text,
  formattedlocation text,
  source text,
  date timestamp,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  snippet text,
  url text,
  latitude text,
  longitude text,
  jobkey text,
  UNIQUE (jobkey),
  sponsored boolean,
  expired boolean,
  indeedapply boolean,
  formattedlocationfull text,
  nouniqueurl boolean,
  formattedrelativetime text,
  onmousedown text
);

create table IF NOT EXISTS users (
  internal_id SERIAL PRIMARY KEY,
  google_id text,
  UNIQUE(google_id),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name text,
  google_profile_url text,
  google_access_token text,
  google_image_url text,
  card_positions text
);

create table IF NOT EXISTS saved_searches (
  internal_id SERIAL PRIMARY KEY,
  name text,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id integer NOT NULL REFERENCES users (internal_id)
);

create table IF NOT EXISTS jobs_saved_searches (
  internal_id SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  jobkey_id text NOT NULL REFERENCES indeed_jobs (jobkey),
  saved_search_id integer NOT NULL REFERENCES saved_searches (internal_id)
);

create table IF NOT EXISTS kanban_cards (
  internal_id SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status text NOT NULL,
  card_id text NOT NULL REFERENCES indeed_jobs (jobkey),
  notes text,
  user_id integer NOT NULL REFERENCES users (internal_id)
);


CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = now();
    RETURN NEW; 
END;
$$ language 'plpgsql';

CREATE TRIGGER update_indeed_jobs_modtime BEFORE UPDATE ON indeed_jobs FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();
CREATE TRIGGER update_saved_searches_modtime BEFORE UPDATE ON saved_searches FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();
CREATE TRIGGER update_jobs_saved_searches_modtime BEFORE UPDATE ON jobs_saved_searches FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();
CREATE TRIGGER update_kanban_cards_modtime BEFORE UPDATE ON kanban_cards FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();
