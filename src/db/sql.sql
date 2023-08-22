drop table if exists data2;

create table data2 (
	id integer primary key autoincrement,
	name text not null,
	alt text not null,
	imag text not null,
	date timestamp default current_timestamp
);

create index idx_data2_post_id on data (id);

create table if not exists data (
	id integer primary key autoincrement,
	name text not null,
	alt text not null,
	imag text not null,
	post_id text not null,
	update_at text not null default (
		strftime('%Y-%m-%d %H:%M:%f', 'now', 'localtime')
	)
);

CREATE INDEX IF NOT EXISTS idx_$data_post_id ON data(post_id);
