const http = require("http");
const pool = require("./db");

const port = process.env.PORT || 5000;

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res, statusCode, payload) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      if (!data) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    setCorsHeaders(res);
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url !== "/api/todo" && req.url !== "/api/todos") {
    sendJson(res, 404, { error: "Not found" });
    return;
  }

  try {
    if (req.method === "GET") {
      const result = await pool.query("SELECT * FROM todos ORDER BY id ASC");
      sendJson(res, 200, result.rows);
      return;
    }

    const body = await readBody(req);

    if (req.method === "POST") {
      const { task } = body;

      if (!task) {
        sendJson(res, 400, { error: "task is required" });
        return;
      }

      const result = await pool.query(
        "INSERT INTO todos(task) VALUES($1) RETURNING *",
        [task],
      );
      sendJson(res, 201, result.rows[0]);
      return;
    }

    if (req.method === "PUT") {
      const { id, task } = body;

      if (!id || !task) {
        sendJson(res, 400, { error: "id and task are required" });
        return;
      }

      await pool.query("UPDATE todos SET task=$1 WHERE id=$2", [task, id]);
      sendJson(res, 200, { message: "Updated" });
      return;
    }

    if (req.method === "DELETE") {
      const { id } = body;

      if (!id) {
        sendJson(res, 400, { error: "id is required" });
        return;
      }

      await pool.query("DELETE FROM todos WHERE id=$1", [id]);
      sendJson(res, 200, { message: "Deleted" });
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Internal server error" });
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
