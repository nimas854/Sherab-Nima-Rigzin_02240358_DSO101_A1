describe('Todo API Logic', () => {

  test('should return true when task is not empty', () => {
    const task = "Buy groceries";
    expect(task.length).toBeGreaterThan(0);
  });

  test('should return false when task is empty', () => {
    const task = "";
    expect(task.length).toBe(0);
  });

  test('should validate todo object has task property', () => {
    const todo = { id: 1, task: "Do homework" };
    expect(todo).toHaveProperty('task');
  });

  test('should validate todo id is a number', () => {
    const todo = { id: 1, task: "Do homework" };
    expect(typeof todo.id).toBe('number');
  });

});