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

## Setting up a server

Assuming an Ubuntu Xenial 16.04 server.

	sudo apt-get install apt-transport-https ca-certificates
	sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
	echo "deb https://apt.dockerproject.org/repo ubuntu-xenial main" | sudo tee /etc/apt/sources.list.d/docker.list
	sudo apt-get purge lxc-docker
	sudo apt-get update
	sudo apt-get install linux-image-extra-$(uname -r) git curl docker-engine openssl
	curl -L https://github.com/docker/compose/releases/download/1.6.2/docker-compose-`uname -s`-`uname -m` | sudo tee /usr/local/bin/docker-compose > /dev/null
	sudo chmod +x /usr/local/bin/docker-compose
	sudo service docker start
	sudo docker run hello-world
	docker-compose --version
	sudo gpasswd -a $USER docker
	sudo mkdir -p /srv/live.git /srv/live/certificates
	sudo chown -R :adm /srv/live.git /srv/live
	sudo chmod -R g+rwx /srv/live.git /srv/live
	git init --bare /srv/live.git
	openssl dhparam -out /srv/live/certificates/dhparam.pem 4096

	git remote add staging staging.example.com:/srv/live.git
	scp post-receive staging.example.com:/srv/live.git/hooks
	git push staging

## Local testing

	docker-compose start

## Staging

	docker-compose -f docker-compose.yml -f staging.yml start

## Production

	docker-compose -f docker-compose.yml -f staging.yml  -f production.yml start

## Using




### Staging

	

### Deployment

	docker-compose -f docker-compose.yml -f production.yml start


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
