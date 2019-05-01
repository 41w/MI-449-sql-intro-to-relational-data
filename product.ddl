create table todos (
  id serial primary key,
  slug text not null,
  text text not null,
  status varchar(11) not null
);
