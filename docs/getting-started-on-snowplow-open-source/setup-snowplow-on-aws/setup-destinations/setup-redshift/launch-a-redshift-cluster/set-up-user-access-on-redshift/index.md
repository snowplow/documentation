---
title: "Setup user access on Redshift"
date: "2020-02-26"
sidebar_position: 20
---

We recommend you setup access credentials for at least three different users:

1. [The RDB Loader](#creating-a-user-for-the-rdb-loader)
2. [A user with read-only access](#creating-a-read-only-user) to the data, but write access on his / her own schema
3. [A power user](#creating-a-power-user) with admin privileges

### Creating a user for the RDB Loader

We recommend that you create a specific user in Redshift with _only_ the permissions required to load data into your Snowplow schema and run `vacuum` and `analyze` against those tables, and use this user's credentials in the config to manage the automatic movement of data into the table. That way, in the event that the server storing storage targets configuration is hacked and the hacker gets access to those credentials, they cannot use them to do any harm to your other data in Redshift. To create a new user with restrictive permissions, log into Redshift, connect to the Snowplow database and execute the following SQL:

```sql
CREATE USER storageloader PASSWORD '$storageloaderpassword';
GRANT USAGE ON SCHEMA atomic TO storageloader;
GRANT INSERT ON TABLE "atomic"."events" TO storageloader;
```

You can set the user name and password (`storageloader` and `$storageloaderpassword` in the example above) to your own values. Note them down: you will need them when you come to setup the storageLoader in the next phase of the your Snowplow setup.

It's important that both `vacuum` and `analyze` are run on a regular basis. These can only be run by a superuser or the owner of the table. The latter is the more restricted solution, so we transfer ownership on all tables in atomic to the StoreLoader user. This can be done by running the following query against all tables in atomic:

```
ALTER TABLE atomic.events OWNER TO storageloader;
```

### Creating a read-only user

To create a new user who can read Snowplow data, but not modify it, connect to the Snowplow database and execute the following SQL:

```
CREATE USER read_only PASSWORD '$read_only_user';
GRANT USAGE ON SCHEMA atomic TO read_only;
GRANT SELECT ON TABLE atomic.events TO read_only;
```

The last query would need to be run for each table in atomic.

Lastly, we may want to let create a schema in Redshift where the read-only user can create his/ her own tables for analytics purposes, for example:

```sql
CREATE SCHEMA scratchpad;
GRANT ALL ON SCHEMA scratchpad TO read_only;
```

### Creating a power user

To create a power user that has super user privilages, connect to the Snowplow database in Redshift and execute the following:

```sql
CREATE USER power_user createuser password '$poweruserpassword';
GRANT ALL ON DATABASE snowplow TO power_user;
GRANT ALL ON SCHEMA atomic TO power_user;
GRANT ALL ON TABLE atomic.events TO power_user;
```

Note that now you've created your different users, we recommend that you no longer use the credentials you created when you created the Redshift cluster originally.
