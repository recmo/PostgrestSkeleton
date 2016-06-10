# Postgrest Skeleton

Stack:

* [Auth0](https://auth0.com/) as authentication provider.
* [Let’s Encrypt](https://letsencrypt.org/) as certificate authority.
* [Nginx](http://nginx.org/) as web server.
* [PostgREST](http://postgrest.com/) as API server.
* [Sqitch](http://sqitch.org/) for database migration.
* [PostgreSQL](http://www.postgresql.org/) as database engine.
* [Docker](https://www.docker.com/) to containerize.
* [Docker compose](https://docs.docker.com/compose/) for orchestrating containers.

## Dependencies

Make sure you have a recent version of `docker`, at least version *1.10.0*.

https://docs.docker.com/engine/installation/linux/ubuntulinux/


Make sure you have a recent version of `docker-compose`, at least version *1.6*.

	curl -L https://github.com/docker/compose/releases/download/1.6.2/docker-compose-`uname -s`-`uname -m` | sudo tee /usr/local/bin/docker-compose > /dev/null
	sudo chmod +x /usr/local/bin/docker-compose

To recompile the javascript you need [Google Closure](https://github.com/google/closure-compiler).

	closure-compiler --language_out ECMASCRIPT5_STRICT --js js/*.js > www/min.js

## Starting

	docker-compose up

To start with a clean build

	docker-compose stop
	sudo rm -rf data/data
	docker-compose rm -f
	docker-compose create
	docker-compose start

## Raw database access

	docker exec -ti -u postgres example_dbm_1 psql -d example -P pager=off

## Dump database for backups

	docker exec -ti -u postgres example_dbm_1 pg_dump -a --insert example

## JWT token:

Example token (with signature removed):

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYXV0aG9yIiwidXNlcmlkIjoiYXV0aDB8NTZkZWEwYjM4MWRlMjkyZTBjYjc1OTY1IiwiaXNzIjoiaHR0cHM6Ly9vcGVuZXRoLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1NmRlYTBiMzgxZGUyOTJlMGNiNzU5NjUiLCJhdWQiOiJBWm10a0JONXpER0VSSmVzRlpHRlM4dllKWXlaVHJEbyIsImV4cCI6MTQ1NzQ4NjM5MywiaWF0IjoxNDU3NDUwMzkzfQ.2DIZz2bf19Jr9UaNA3DLl263JqzXvrAUky3Vr_ZgIbQ
```

```
{
	"role": "author",
	"userid": "auth0|56dea0b381de292e0cb75965",
	"iss": "https://example.auth0.com/",
	"sub": "auth0|56dea0b381de292e0cb75965",
	"aud": "AZmtkBN5zDGERJesFZGFS8vYJYyZTrDo",
	"exp": 1457486393,
	"iat": 1457450393
}
```

The `role` gets mapped to a PostgreSQL role, `sub` is used to uniquely identify
users.


## Regenerating Diffie-Hellman parameters

Goal:

* A+ on <https://www.ssllabs.com/ssltest/analyze.html?d=example.com>
* <https://cyh.herokuapp.com/cyh>

<https://www.owasp.org/index.php/List_of_useful_HTTP_headers>

<https://raymii.org/s/tutorials/Strong_SSL_Security_On_nginx.html>

	openssl dhparam -out certificates/dhparam.pem 4096


## Content Security Policy

* <https://www.w3.org/TR/CSP/>
* <https://developer.mozilla.org/en-US/docs/Web/Security/CSP/CSP_policy_directives>
