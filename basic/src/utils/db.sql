-- drop table if exists data2;

create table if not exists data (
	id integer primary key autoincrement,
	name text not null,
	alt text not null,
	imag text not null,
	post_id text not null,
	update_at text not null default (strftime('%Y-%m-%d %H:%M:%f', 'now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS idx_data_post_id ON data(post_id);
INSERT INTO data(name, alt, imag, post_id) VALUES ("test1", "test1", "test1", 1);

CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime')),
  done BOOLEAN DEFAULT 0
);
