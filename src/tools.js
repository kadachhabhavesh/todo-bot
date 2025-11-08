import { addTodo, deleteTodoById, getAllTodos, searchTodo, updateTodoDueDate, updateTodoStatus } from "./service.js";

export const tools = {
  getAllTodos: getAllTodos,
  addTodo: addTodo,
  deleteTodoById: deleteTodoById,
  searchTodo: searchTodo,
  updateTodoStatus: updateTodoStatus,
  updateTodoDueDate: updateTodoDueDate
};