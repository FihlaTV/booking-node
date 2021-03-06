booking-node
============

turn any website into a book-anything managing page


You can overwrite values in those `vars.cfg` files by writing a `vars.local.cfg`
file with your own values. You may like to set `DEVEL=1` while developing.  In
case of the `api` and `db` containers, you'll just stay connected to the stdout
of these containers.  
But the `manage` container will than watch for changes of your html/js/css files
and will rebuild the bundles.


DB
--

```bash
./db/build_container.sh
./db/detach_container.sh

# start PHPMyAdmin
./db/run_phpmyadmin.sh
```


API
---

```bash
# run in docker container (will be production)
./api/build_container.sh
./api/detach_container.sh

# run local natively (development)
cd api/build
npm install
../run_local.sh
```


communicate with the API
------------------------

Running the node (API) app local (not in the docker container), will print out
some debug information.

Ever tried [httpie](https://github.com/jkbrzt/httpie)? Replace `http` with
`curl -v` if you like `curl` more.

```bash
# test DB connection
http localhost:3000

# request item availbility
http localhost:3000/item/item01/2016

# post a booking
http -v POST localhost:3000/item/item01/2016-06-01..2016-06-30 name='customer name'

# create new account (company with user of role "owner")
http -v POST localhost:3000/new_account company_name='my new company' user_name='the new user' user_email=user@example.com user_pass=secret

# authenticate to get a session token
http -v --auth user@localhost:pass localhost:3000/auth

# reload DB schema
http localhost:3000/reloadDb

# invalid requests
http localhost:3000/abc/def
http localhost:3000/item/abc_def/2016
http localhost:3000/item/abc123/2010
http POST localhost:3000/item/abc123/2016-07-01..2016-06-30
```


single page manage server
-------------------------

run:
```bash
./manage/build_container.sh && ./manage/detach_container.sh
```

Now go to [http://localhost]().  
You can login using `user@localhost` and `pass`.
