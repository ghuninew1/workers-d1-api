drop table if exists data;
create table data (
  id integer primary key autoincrement,
  name text not null,
  alt text not null,
  imag text not null,
  post_id text not null
);
create index idx_data_post_id on data (post_id);