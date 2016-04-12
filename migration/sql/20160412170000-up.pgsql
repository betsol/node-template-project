
----------------
-- EXTENSIONS --
----------------

CREATE EXTENSION citext;


------------
-- FRUITS --
------------

CREATE TABLE "fruits" (
    "id"         serial                    PRIMARY KEY,
    "name"       citext                    UNIQUE,
    "createdAt"  timestamp with time zone  NOT NULL,
    "updatedAt"  timestamp with time zone  NOT NULL
);


--------------------------
-- GRANTING PERMISSIONS --
--------------------------

GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA "public" TO "example";
GRANT ALL ON ALL SEQUENCES IN SCHEMA "public" TO "example";
