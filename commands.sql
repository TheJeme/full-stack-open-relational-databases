CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

insert into blogs (author, url, title) values ('author_test_01', 'url_test_01', 'title_test_01');
insert into blogs (author, url, title, likes) values ('author_test_02', 'url_test_02', 'title_test_02', 14);
