import pool from "../../db";

export default async function handler(req, res) {

  // GET todos
  if (req.method === "GET") {
    const result = await pool.query("SELECT * FROM todos");
    res.json(result.rows);
  }

  // ADD todo
  else if (req.method === "POST") {
    const { task } = req.body;
    const result = await pool.query(
      "INSERT INTO todos(task) VALUES($1) RETURNING *",
      [task]
    );
    res.json(result.rows[0]);
  }

  // DELETE todo
  else if (req.method === "DELETE") {
    const { id } = req.body;
    await pool.query("DELETE FROM todos WHERE id=$1", [id]);
    res.json({ message: "Deleted" });
  }

  // UPDATE todo
  else if (req.method === "PUT") {
    const { id, task } = req.body;
    await pool.query(
      "UPDATE todos SET task=$1 WHERE id=$2",
      [task, id]
    );
    res.json({ message: "Updated" });
  }
}