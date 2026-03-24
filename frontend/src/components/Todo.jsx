import { useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function Todo() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getTodos = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API);
      if (!res.ok) {
        throw new Error("Failed to load tasks");
      }
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getResponseErrorMessage = async (res, fallbackMessage) => {
    try {
      const data = await res.json();
      if (data?.error) {
        return data.error;
      }
      if (data?.message) {
        return data.message;
      }
      return fallbackMessage;
    } catch {
      return fallbackMessage;
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const addTodo = async () => {
    const trimmedTask = task.trim();
    if (!trimmedTask) {
      return;
    }

    try {
      setError("");
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: trimmedTask }),
      });

      if (!res.ok) {
        throw new Error(
          await getResponseErrorMessage(res, "Could not add task"),
        );
      }

      setTask("");
      getTodos();
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError("");
      const res = await fetch(API, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error(
          await getResponseErrorMessage(res, "Could not delete task"),
        );
      }

      getTodos();
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  const taskCountLabel = useMemo(() => {
    if (todos.length === 1) {
      return "1 mission";
    }
    return `${todos.length} missions`;
  }, [todos.length]);

  return (
    <section className="todo-card">
      <div className="hero-copy">
        <p className="eyebrow">Daily Command Center</p>
        <h1>Orbit Todos</h1>
        <p className="status-text">{taskCountLabel} in your queue.</p>
      </div>

      <div className="inputBox" role="group" aria-label="Create a todo">
        <input
          type="text"
          placeholder="Type your next mission..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTodo();
            }
          }}
        />

        <button type="button" onClick={addTodo}>
          Add
        </button>
      </div>

      {error ? <p className="error-note">{error}</p> : null}

      {loading ? <p className="loading-note">Loading tasks...</p> : null}

      <ul className="todo-list" aria-live="polite">
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.task}</span>

            <button
              className="deleteBtn"
              onClick={() => deleteTodo(todo.id)}
              type="button"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {!loading && todos.length === 0 ? (
        <p className="empty-note">No missions yet. Add your first one above.</p>
      ) : null}
    </section>
  );
}

export default Todo;
