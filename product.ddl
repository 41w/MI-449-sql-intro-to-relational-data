create table product (
  id serial primary key,
  slug text not null,
  name text not null,
  price numeric(5,2) not null
);

// create
insert into product (slug, name, price)
values ('lemonade', 'Lemonade', 1);

// retrieve
select * from product
where id = 1;

select * from product
where slug = 'lemonade'
or slug = 'mikes';

select * from product
where price <= 1;

select * from product
where slug <> 'lemonade';

//remove
delete from product
where slug = 'mikes';

//update
update product
set price = 1.5
where id = 1;
returning *

update product
set slug = 'limeade', name = 'Limeade'
where id = 1;
