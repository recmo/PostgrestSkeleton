BEGIN;

--------------------------------------------------------------------------------

INSERT INTO hidden.users VALUES (1, 'auth0|56dea0b381de292e0cb75965', '2016-03-08 19:44:47.858918', '2016-03-08 19:44:47.858918', 'Remco Bloemen', 'Remco', NULL, NULL);

--------------------------------------------------------------------------------

INSERT INTO posts VALUES (1, 'auth0|56dea0b381de292e0cb75965', '2016-03-08 19:44:47.858918', 'Welcome to my blog!', 'First post!');

SELECT pg_catalog.setval('dilemmas_id_seq', 1, true);

--------------------------------------------------------------------------------

INSERT INTO comments VALUES (1, 1, 'auth0|56dea0b381de292e0cb75965', '2016-03-09 13:44:31.482475', 'Congrats!');

SELECT pg_catalog.setval('comments_id_seq', 1, true);

--------------------------------------------------------------------------------

COMMIT;
