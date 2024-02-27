\echo 'Delete and recreate musicsph db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE musicsph;
CREATE DATABASE musicsph;
\connect musicsph

\i musicsph-schema.sql