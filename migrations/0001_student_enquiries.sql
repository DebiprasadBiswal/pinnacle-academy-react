CREATE TABLE IF NOT EXISTS student_enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 2 AND 100),
  father_name TEXT NOT NULL CHECK (length(father_name) BETWEEN 2 AND 100),
  student_class TEXT NOT NULL CHECK (length(student_class) BETWEEN 1 AND 40),
  phone TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
