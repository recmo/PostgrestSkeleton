BEGIN;

--------------------------------------------------------------------------------
-- We use JSON Web Tokens to authenticate API requests. PostgREST
-- cares specifically about a claim called role. When request
-- contains a valid JWT with a role claim PostgREST will switch
-- to the database role with that name for the duration of the
-- HTTP request. If the client included no (or an invalid) JWT
-- then PostgREST selects the role "anonymous".

CREATE ROLE anonymous;
CREATE ROLE author;
GRANT anonymous, author TO authenticator;

GRANT USAGE ON SCHEMA public TO anonymous, author;

--------------------------------------------------------------------------------
-- The user id is a string stored in postgrest.claims.sub. Let's
-- wrap this in a nice function.

CREATE FUNCTION current_user_id() RETURNS text
STABLE
LANGUAGE plpgsql
AS $$
BEGIN
	RETURN current_setting('postgrest.claims.userid');
EXCEPTION
	-- handle unrecognized configuration parameter error
	WHEN undefined_object THEN RETURN '';
END;
$$;

GRANT EXECUTE ON FUNCTION current_user_id() TO anonymous, author;

--------------------------------------------------------------------------------
-- We put things inside the hidden schema to hide
-- them from public view. Certain public procs/views will
-- refer to helpers and tables inside.

CREATE SCHEMA hidden;

CREATE TABLE hidden.users (
	id            text      primary key,
	created       timestamp not null default now(),
	last_login    timestamp not null default now(),
	name          text      not null,
	nickname      text      ,
	avatar        text      ,
	profile       json
);

--------------------------------------------------------------------------------
-- RPC to upsert the current user's profile

CREATE FUNCTION login(user_profile json) RETURNS void
LANGUAGE SQL
SECURITY DEFINER
AS $$
	INSERT INTO hidden.users (id, last_login, name, nickname, avatar, profile)
	VALUES (current_user_id(), now(), user_profile::json->>'name',
		user_profile::json->>'nickname', user_profile::json->>'picture',
		user_profile)
	ON CONFLICT (id) DO UPDATE SET
		(last_login, name, nickname, avatar, profile) =
		(EXCLUDED.last_login, EXCLUDED.name, EXCLUDED.nickname, EXCLUDED.avatar,
		EXCLUDED.profile);
$$;

GRANT EXECUTE ON FUNCTION login(json) TO author;

-- TODO: Investigate implementation without 'SECURITY DEFINER'
-- TODO: Fail on current_user_id() = ''

--------------------------------------------------------------------------------

-- TODO: Allow user to see a subset of the columns (id, nickname, avatar), but
--       disallow enumerating all existing users .(so you would have to know a
--       user.id, for example trough a JOIN).

COMMIT;
