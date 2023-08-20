drop table if exists data2;
create table data2 (
  id integer primary key autoincrement,
  name text not null,
  alt text not null,
  imag text not null,
  date timestamp default current_timestamp
);
create index idx_data2_post_id on data (id);
