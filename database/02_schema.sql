BEGIN;

--------------------------------------------------------------------------------

CREATE TABLE post (
	id            bigserial   primary key,
	author        text        not null
	                          default current_user_id()
	                          references hidden.users (id),
	created       timestamp   not null
	                          default now(),
	title         text        not null,
	contents      text        not null
);

-- Anonymous can read all.
GRANT SELECT ON TABLE post TO anonymous;

-- Author can insert and modify name and description…
GRANT SELECT,
	INSERT (title, contents),
	UPDATE (title, contents),
	DELETE
ON TABLE post TO author;
GRANT USAGE, SELECT ON SEQUENCE post_id_seq TO post;

-- …but only of rows that he/she himself created.
ALTER TABLE post ENABLE ROW LEVEL SECURITY;
CREATE POLICY author_eigenedit ON post
	USING (TRUE)
	WITH CHECK (author = current_user_id());

--------------------------------------------------------------------------------

CREATE TABLE comments (
	id            bigserial   primary key,
	post          bigint      not null
	                          references post (id)
                             on delete cascade
                             on update cascade,
	author        text        not null
	                          default current_user_id()
	                          references hidden.users (id),
	created       timestamp   not null
	                          default now(),
	contents      text        not null
);

-- Anonymous can read all.
GRANT SELECT ON TABLE comments TO anonymous;

-- Author of comment can insert and modify…
GRANT SELECT,
	INSERT (post, contents),
	UPDATE (contents),
	DELETE
	ON TABLE comments TO author;
GRANT USAGE, SELECT ON SEQUENCE comments_id_seq TO author;

-- …but only of comments that he/she himself created.
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY author_eigenedit ON comments
	USING (TRUE)
	WITH CHECK (author = current_user_id());

COMMIT;
