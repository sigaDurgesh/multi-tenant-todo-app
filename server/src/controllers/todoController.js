import { Todo } from "../models/index.js";

// CREATE TODO
export const createTodo = async (req, res) => {
  try {
    if (req.user.roles[0] !== "user") {
      return res.status(403).json({ message: "Only users can create todos" });
    }

    const { title, description } = req.body;
    const { id: userId, tenant_id: tenantId } = req.user;

    const todo = await Todo.create({
      tenant_id: tenantId,
      user_id: userId,
      title,
      description,
    });

    return res.status(201).json({ message: "Todo created successfully", todo });
  } catch (error) {
    return res.status(500).json({ message: "Error creating todo", error: error.message });
  }
};

// GET TODOS (user specific only)
export const getTodos = async (req, res) => {
  try {
    if (req.user.roles[0] !== "user") {
      return res.status(403).json({ message: "Only users can view their todos" });
    }

    const { id: userId, tenant_id: tenantId } = req.user;

    const todos = await Todo.findAll({
      where: { tenant_id: tenantId, user_id: userId, is_deleted: false },
    });

    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching todos", error: error.message });
  }
};

// GET TODO BY ID (user-specific)
export const getTodoById = async (req, res) => {
  try {
    if (req.user.roles[0] !== "user") {
      return res.status(403).json({ message: "Only users can view their todos" });
    }

    const { id } = req.params;
    const { id: userId, tenant_id: tenantId } = req.user;

    const todo = await Todo.findOne({
      where: { id, tenant_id: tenantId, user_id: userId, is_deleted: false }
    });

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    return res.status(200).json(todo);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching todo", error: error.message });
  }
};


// UPDATE TODO
export const updateTodo = async (req, res) => {
  try {
    if (req.user.roles[0] !== "user") {
      return res.status(403).json({ message: "Only users can update their todos" });
    }
    const { id } = req.params;
    const { title, description, status } = req.body;
    const { id: userId, tenant_id: tenantId } = req.user;

    const todo = await Todo.findOne({ where: { id, tenant_id: tenantId, user_id: userId, is_deleted: false } });
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    await todo.update({
      title: title ?? todo.title,
      description: description ?? todo.description,
      status: status ?? todo.status,
    });

    return res.status(200).json({ message: "Todo updated successfully", todo });
  } catch (error) {
    return res.status(500).json({ message: "Error updating todo", error: error.message });
  }
};

// DELETE TODO (soft delete)
export const deleteTodo = async (req, res) => {
  try {
    if (req.user.roles[0] !== "user") {
      return res.status(403).json({ message: "Only users can delete their todos" });
    }

    const { id } = req.params;
    const { id: userId, tenant_id: tenantId } = req.user;

    const todo = await Todo.findOne({ where: { id, tenant_id: tenantId, user_id: userId, is_deleted: false } });
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    await todo.update({ is_deleted: true, deleted_at: new Date() });

    return res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting todo", error: error.message });
  }
};
