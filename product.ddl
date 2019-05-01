create table product (
  id serial primary key,
  slug text not null,
  name text not null,
  price numeric(5,2) not null
);
