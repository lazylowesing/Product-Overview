CREATE TABLE products (
  id SERIAL,
  SS INTEGER,
  spreadsheetID VARCHAR(16),
  modelNumber VARCHAR(8),
  price DECIMAL,
  name VARCHAR(150),
  PRIMARY KEY(id)
)

CREATE TABLE small (
  id SERIAL,
  product_id INTEGER REFERENCES test(id),
  image_url VARCHAR(10),
  PRIMARY KEY(id)
)