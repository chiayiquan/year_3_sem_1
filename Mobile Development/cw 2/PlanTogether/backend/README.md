# create db user

CREATE USER plantogether WITH PASSWORD '123456' SUPERUSER;
CREATE DATABASE "plantogether-development" OWNER plantogether;
CREATE DATABASE "plantogether-test" OWNER plantogether;
