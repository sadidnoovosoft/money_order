-- Creating users table
create table IF NOT EXISTS users
(
    id bigint generated always as identity primary key,
    username varchar(255) not null,
    role varchar(255) not null,
    password varchar(255)
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
    transaction_date timestamp default now()
);

alter table transactions
    owner to postgres;

