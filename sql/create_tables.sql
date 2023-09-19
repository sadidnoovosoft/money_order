-- Creating users table
create table IF NOT EXISTS users
(
    id bigint generated always as identity primary key,
    username varchar(255) not null,
    role varchar(255) not null,
    email varchar(255) not null,
    password varchar(255),
    balance  bigint default 0 not null
);

alter table users
    owner to postgres;

-- Creating jobs table
create table jobs
(
    id bigint generated always as identity primary key,
    receiver_id bigint,
    from_id bigint,
    to_id bigint,
    amount bigint,
    row_count bigint,
    status varchar(255) default 'pending'::character varying not null,
    created_at timestamp default now(),
    type varchar(255) not null
);

alter table jobs
    owner to postgres;