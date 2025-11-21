import { addTodo, deleteTodoById, getAllTodos, getTodayDate, searchTodo, updateTodoDueDate, updateTodoStatus } from "./service.js";

export const tools = {
  getAllTodos: getAllTodos,
  addTodo: addTodo,
  deleteTodoById: deleteTodoById,
  searchTodo: searchTodo,
  updateTodoStatus: updateTodoStatus,
  updateTodoDueDate: updateTodoDueDate,
  getTodayDate: getTodayDate
};