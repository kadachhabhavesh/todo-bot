import { createClient } from "@supabase/supabase-js";
import { SUPABASE_API_KEY, SUPABASE_API_URL } from "./constant.js";

const supabase = createClient(SUPABASE_API_URL, SUPABASE_API_KEY);

export const getAllTodos = async () => {
  try {
    let { data, error } = await supabase.from("todos").select("*");
    if (error) console.log(error.message);
    return data;
  } catch (error) {
    console.log(error.message);
    return "error while fetching todos";
  }
};

export const addTodo = async ({ task, complete = false, dueDate = null }) => {
  try {
    const { data, error } = await supabase
      .from("todos")
      .insert([{ task, complete, dueDate }])
      .select();
    if (error) console.log(error.message);
    return "todo add successfully";
  } catch (error) {
    console.log(error.message);
    return "failed to add todo";
  }
};

export const deleteTodoById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)
      .select("*");
    if (error) console.log(error.message);
    return "todo delete successfully";
  } catch (error) {
    console.log(error.message);
    return "failed to delete todo";
  }
};

export const searchTodo = async ({searchText = "", filters = {}}) => {
  try {
    const { complete, dueDate } = filters;

    let query = supabase.from("todos").select("*");
    if (searchText && searchText.trim !== "") {
      query = query.ilike("task", `%${searchText.trim()}%`);
    }
    if (typeof complete === "boolean") {
      query = query.eq("complete", complete);
    }
    if (dueDate) {
      query = query.eq("dueDate", dueDate);
    }

    query = query.order("created_at", { ascending: false });
    const { data, error } = await query;
    if (error) {
      console.log(error.message);
      return [];
    }
    console.log("data:::", data);
    
    return data || [];
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const updateTodoStatus = async ({id, complete}) => {
  
  try {
    const { data, error } = await supabase
      .from("todos")
      .update({ complete })
      .eq("id", id)
      .select("*");

    if (error) {
      console.log(error.message);
      return "Failed to update todo status.";
    }

    if (!data || data.length === 0) {
      return `No todo found with ID ${id}.`;
    }
    return "Todo status updated successfully.";
  } catch (error) {
    console.log(error.message);
    return "Error while updating todo status.";
  }
};

export const updateTodoDueDate = async ({id, dueDate}) => {
  
  try {
    const { data, error } = await supabase
      .from("todos")
      .update({ dueDate })
      .eq("id", id)
      .select("*");

    if (error) {
      console.log(error.message);
      return "Failed to update todo dueDate.";
    }

    if (!data || data.length === 0) {
      return `No todo found with ID ${id}.`;
    }
    return "Todo dueDate updated successfully.";
  } catch (error) {
    console.log(error.message);
    return "Error while updating todo status.";
  }
};