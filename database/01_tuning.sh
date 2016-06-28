echo "

# QUERY TUNING

random_page_cost = 1.1
effective_cache_size = 12GB

# AUTOVACUUM PARAMETERS

autovacuum = on

# CLIENT CONNECTION DEFAULTS

datestyle = 'iso, mdy'
lc_messages = 'C'
lc_monetary = 'C'
lc_numeric = 'C'
lc_time = 'C'
default_text_search_config = 'pg_catalog.english'

" >> /var/lib/postgresql/data/postgresql.conf
