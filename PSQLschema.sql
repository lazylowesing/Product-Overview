CREATE TABLE test (
  id SERIAL,
  SS INTEGER,
  spreadsheetID VARCHAR(16),
  itemNumber INTEGER,
  modelNumber VARCHAR(8),
  price DECIMAL,
  name VARCHAR(150),
  PRIMARY KEY(id)
)