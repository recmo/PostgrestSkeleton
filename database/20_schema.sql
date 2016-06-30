BEGIN;

--------------------------------------------------------------------------------

CREATE TABLE posts (
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
GRANT SELECT ON TABLE posts TO anonymous;

-- Author can insert and modify name and description…
GRANT SELECT,
	INSERT (title, contents),
	UPDATE (title, contents),
	DELETE
ON TABLE posts TO author;
GRANT USAGE, SELECT ON SEQUENCE posts_id_seq TO author;

-- …but only of rows that he/she himself created.
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_unsecure ON posts FOR SELECT
	USING (TRUE);

CREATE POLICY author_eigencreate ON posts FOR INSERT
	WITH CHECK (author = current_user_id());

CREATE POLICY author_eigenupdate ON posts FOR UPDATE
	USING (author = current_user_id())
	WITH CHECK (author = current_user_id());

CREATE POLICY author_eigendelete ON posts FOR DELETE
	USING (author = current_user_id());

--------------------------------------------------------------------------------

CREATE TABLE comments (
	id            bigserial   primary key,
	post          bigint      not null
	                          references posts (id)
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

CREATE POLICY select_unsecure ON comments FOR SELECT
	USING (TRUE);

CREATE POLICY author_eigencreate ON comments FOR INSERT
	WITH CHECK (author = current_user_id());

CREATE POLICY author_eigenupdate ON comments FOR UPDATE
	USING (author = current_user_id())
	WITH CHECK (author = current_user_id());

CREATE POLICY author_eigendelete ON comments FOR DELETE
	USING (author = current_user_id());

COMMIT;
