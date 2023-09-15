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

-- Creating transactions table
create table IF NOT EXISTS transactions
(
    id bigint generated always as identity primary key,
    type varchar(255) not null,
    from_id bigint
        constraint from_id
            references users
            on update cascade on delete cascade,
    to_id bigint
        constraint to_id
            references users
            on update cascade on delete cascade,
    amount bigint not null,
    transaction_date timestamp default now(),
    status varchar(255) default 'pending'::character varying not null
);

alter table transactions
    owner to postgres;

-- Creating emails table
create table emails
(
    id bigint generated always as identity
        constraint emails_pk
            primary key,
    receiver_id bigint not null
        constraint emails_users_id_fk
            references users,
    row_count bigint,
    status varchar(255) default 'pending'::character varying not null,
    created_at timestamp default now()
);

alter table emails
    owner to postgres;