-- drop table if exists data2;

create table if not exists data (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	alt TEXT NOT NULL,
	imag TEXT NOT NULL,
	post_id INTEGER NOT NULL,
	created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'localtime')),
	update_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'localtime')) ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_data_post_id ON data(post_id);
INSERT INTO data(name, alt, imag, post_id) VALUES ("test1", "test1", "test1", 1);

CREATE TABLE vist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  value INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);
INSERT INTO vist(name, value) VALUES ("test1", 1);
INSERT INTO vist (name, value) VALUES ('test', 1);

--   created_at TIMESTAMP DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime')),
--   update_at TIMESTAMP DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime')) ON UPDATE CURRENT_TIMESTAMP,

DROP TABLE IF EXISTS Customers;
CREATE TABLE Customers (CustomerID INT, CompanyName TEXT, ContactName TEXT, PRIMARY KEY (`CustomerID`));
INSERT INTO Customers (CustomerID, CompanyName, ContactName) VALUES (1, 'Alfreds Futterkiste', 'Maria Anders'), (4, 'Around the Horn', 'Thomas Hardy'), (11, 'Bs Beverages', 'Victoria Ashworth'), (13, 'Bs Beverages', 'Random Name');

CREATE INDEX IF NOT EXISTS idx_$data_post_id ON data(post_id);