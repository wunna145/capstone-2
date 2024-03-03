\echo 'Delete and recreate musicsph db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE musicsph;
CREATE DATABASE musicsph;
\connect musicsph

\i musicsph-schema.sql

\echo 'Delete and recreate musicsph_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE musicsph_test;
CREATE DATABASE musicsph_test;
\connect musicsph_test

\i musicsph-schema.sql