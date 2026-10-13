import unittest
import os
import sys

# Ensure app path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import app

class TestSmoke(unittest.TestCase):
    def test_app_initialized(self):
        self.assertIsNotNone(app.app)
        self.assertEqual(app.app.title, "DukaanMitra Universal Business AI")

    def test_database_init(self):
        app.init_db()
        conn = app.db()
        cur = conn.cursor()
        cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cur.fetchall()]
        self.assertIn("businesses", tables)
        self.assertIn("products", tables)
        self.assertIn("stock_movements", tables)
        conn.close()

if __name__ == '__main__':
    unittest.main()