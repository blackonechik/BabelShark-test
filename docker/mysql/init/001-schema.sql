CREATE TABLE IF NOT EXISTS positions (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS customers (
  id INT NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  position_id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_customers_position
    FOREIGN KEY (position_id) REFERENCES positions(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS translations (
  id INT NOT NULL AUTO_INCREMENT,
  source_text VARCHAR(255) NOT NULL,
  translated_text VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_translations_source_text (source_text)
);

INSERT INTO positions (id, name)
VALUES
  (1, 'officer'),
  (2, 'manager'),
  (3, 'operator')
ON DUPLICATE KEY UPDATE
  name = VALUES(name);

INSERT INTO customers (id, full_name, position_id)
VALUES
  (1, 'Dino Fabrello', 1),
  (2, 'Walter Marangoni', 2),
  (3, 'Angelo Ottogialli', 3)
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  position_id = VALUES(position_id);

INSERT INTO translations (source_text, translated_text)
VALUES
  ('officer', 'офицер'),
  ('manager', 'менеджер'),
  ('operator', 'оператор')
ON DUPLICATE KEY UPDATE
  translated_text = VALUES(translated_text);

GRANT SELECT, INSERT, UPDATE, DELETE ON babelshark_test.* TO 'meteor'@'%';
GRANT REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'meteor'@'%';
FLUSH PRIVILEGES;
