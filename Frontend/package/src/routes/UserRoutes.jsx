// src/routes/UserRoutes.jsx
import { Routes, Route } from "react-router-dom";
// import UserLayout from "../layouts/UserLayout";
import Dashboard from "../pages/user/Dashboard";
import TodoDetails from "../pages/user/TodoDetails";
import CreateTodo from "../pages/user/CreateTodo";
import TodosList from "../pages/user/TodosList";



export default function UserRoutes() {
  return (
    <>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="todos" element={<TodoDetails />} />
        <Route path="todos/create" element={<CreateTodo />} />
        <Route path="todos/:id" element={<TodosList />} />
      </Routes>
    </>
  );
}
