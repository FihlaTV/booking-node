/* companies have `items` and/or `item_groups` they want to offer. They also have
 * `users` to manage these `items`.
 */
CREATE TABLE companies (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    uid varchar(6) NOT NULL,
    name varchar(32) DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

INSERT INTO companies
    (uid, name)
    VALUES
    ('XR00TX', 'root company');

/* user_roles set the right of `users`
 */
CREATE TABLE user_roles (
    id int(1) unsigned NOT NULL AUTO_INCREMENT,
    name varchar(16) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

INSERT INTO user_roles
    (name)
    VALUES
    ('root'),       -- all rights to everything
    ('owner'),      -- all rights for an company (right to rename and remove company)
    ('deputy'),     -- all rights for an company (except rename and remove company)
    ('manager'),    -- rights for specific items or groups (allowed to add and remove items in groups)
    ('booker');     -- can only handle requests for specific items or groups

/* users can login to the admin page and manage `items`, `requests`, etc.
 * depending on their `user_roles`. They belong to a company.
 */
CREATE TABLE users (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    uid varchar(6) NOT NULL,
    name varchar(32) NOT NULL,
    email varchar(32) NOT NULL,
    pass varchar(32) NOT NULL,
    company int(4) unsigned NOT NULL,
    role int(1) unsigned NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (uid),
    KEY (company),
    KEY (role),
    FOREIGN KEY (company) REFERENCES companies (id),
    FOREIGN KEY (role) REFERENCES user_roles (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

INSERT INTO users
    (uid, name, email, pass, company, role)
    VALUES
    ('xr00tx', 'root user', 'root@localhost', 'admin', (SELECT id FROM companies WHERE uid = 'XR00TX'), (SELECT id FROM user_roles WHERE name = 'root'));

/* item_groups grouping multiple `items` of the same type. If someone offers seats
 * for a seminar, each seat would be an individual item but you won't offer each
 * item but the `item_group` od these items. Or you have multiple scooters of certain
 * types. You don't offer each individual scooter but all the different types of groups
 * of scooters.
 *  `item_groups` always belong to `companies`.
 * I think, this free grouping is a main feature.
 */
CREATE TABLE item_groups (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    uid varchar(6) NOT NULL,
    name varchar(32) NOT NULL,
    company int(4) unsigned NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (uid),
    UNIQUE KEY (company,name),
    FOREIGN KEY (company) REFERENCES companies (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/* the individual items that are available. `items` always belong to `item_groups`
 * if you don't use `item_groups`, there has to be a transparent dummy groups. So
 * that there are fewer exceptions to look fo in the code and queries.
 */
CREATE TABLE items (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    uid varchar(6) NOT NULL,
    name varchar(32) NOT NULL,
    item_group int(4) unsigned NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (uid),
    UNIQUE KEY (item_group,name),
    FOREIGN KEY (item_group) REFERENCES item_groups (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/* Which `users` of role 'booker' (in `user_roles`) have the right to manage
 * requests/bookings for which `item_groups`.
 */
CREATE TABLE user_item_group (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    user int(4) unsigned NOT NULL,
    item_group int(4) unsigned NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (user,item_group),
    KEY (item_group),
    FOREIGN KEY (user) REFERENCES users (id),
    FOREIGN KEY (item_group) REFERENCES item_groups (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/* Which `users` of role 'booker' (in `user_roles`) have the right to manage
 * requests/bookings for which `items`.
 */
CREATE TABLE user_item (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    user int(4) unsigned NOT NULL,
    item int(4) unsigned NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (user,item),
    KEY (item),
    FOREIGN KEY (user) REFERENCES users (id),
    FOREIGN KEY (item) REFERENCES items (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/* People that actually book/rent `items`
 */
CREATE TABLE customers (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    uid varchar(6) NOT NULL,
    name varchar(32) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/* `requests` of `customers` (the actual bookings). If a `customers` requests
 * `items_groups`, some code has to assign one/some available item(s) of that group.
 */
CREATE TABLE requests (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    uid varchar(6) NOT NULL,
    customer int(4) unsigned NOT NULL,
    date_from date NOT NULL,
    date_to date NOT NULL,
    request_time datetime NOT NULL,
    accept_time datetime DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (uid),
    KEY (customer),
    FOREIGN KEY (customer) REFERENCES customers (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/* Which `items` are involved by `requests`
 */
CREATE TABLE request_items (
    id int(4) unsigned NOT NULL AUTO_INCREMENT,
    request int(4) unsigned NOT NULL,
    item int(4) unsigned NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (request, item),
    KEY (item),
    FOREIGN KEY (request) REFERENCES requests (id),
    FOREIGN KEY (item) REFERENCES items (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


-- DEMO DATA
INSERT INTO companies
    (uid, name)
    VALUES
    ('AbCDeF', 'some company');

INSERT INTO users
    (uid, name, email, pass, company, role)
    VALUES
    ('abc123', 'ein user', 'user@localhost', 'pass', (SELECT id FROM companies WHERE uid = 'AbCDeF'), (SELECT id FROM user_roles WHERE name = 'owner'));
