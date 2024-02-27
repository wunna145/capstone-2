CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL CHECK (position('@' IN email) > 1)
);

CREATE TABLE artists (
    artist_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    label TEXT,
    formed_year TEXT,
    born_year TEXT,
    died_year TEXT,
    disbanded_year TEXT,
    style TEXT,
    genre TEXT,
    mood TEXT,
    website TEXT,
    facebook TEXT,
    bio TEXT,
    gender TEXT,
    country TEXT,
    thumb TEXT,
    logo TEXT,
    art1 TEXT,
    art2 TEXT,
    art3 TEXT,
    art4 TEXT
);

CREATE TABLE albums (
    album_id INTEGER PRIMARY KEY,
    artist_id INTEGER REFERENCES artists(artist_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    year_released TEXT,
    style TEXT,
    genre TEXT,
    thumb TEXT,
    description TEXT
);

CREATE TABLE songs (
    song_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    album_id INTEGER REFERENCES albums(album_id) ON DELETE CASCADE,
    album_name TEXT NOT NULL,
    artist_id INTEGER REFERENCES artists(artist_id) ON DELETE CASCADE,
    artist_name TEXT NOT NULL,
    description TEXT,
    genre TEXT,
    mood TEXT,
    style TEXT,
    theme TEXT,
    thumb TEXT,
    video TEXT,
    director TEXT,
    mvcompany TEXT,
    ss1 TEXT,
    ss2 TEXT,
    ss3 TEXT
);

CREATE TABLE playlists (
    song_id INTEGER REFERENCES songs(song_id) ON DELETE CASCADE,
    username VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
    PRIMARY KEY (song_id, username)
);
