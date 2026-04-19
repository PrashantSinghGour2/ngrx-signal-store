import { Injectable } from "@angular/core";
import { MockTodos } from "../mock/todo.mock";
import { Todo } from "../model/todo.model";

@Injectable({
  providedIn: 'root'
})

export class TodoService {

  async getTodos() {
    await sleep(2000);
    return MockTodos;
  }

  async addTodo(todo: Partial<Todo>): Promise<Todo> {
    await sleep(500);
    return {
      id: Math.random().toString(36).substring(2, 9),
      completed: false,
      ...todo
    } as Todo;
  }

  async deleteTodo(id: string): Promise<void> {
    await sleep(500);
  }

  async updateTodo(id: string, completed: boolean): Promise<void> {
    await sleep(500);
  }


}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}