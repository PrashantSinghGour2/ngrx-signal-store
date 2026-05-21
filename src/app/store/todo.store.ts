import { computed, inject } from "@angular/core";
import { Todo } from "../model/todo.model";
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { TodoService } from "../services/todo.service";
export type TodosFilter = 'ALL' | 'COMPLETED' | 'PENDING';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withLogger } from "./feature/with-logger";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { of, pipe, switchMap, tap } from "rxjs";
type TodosState = {
  todos: Todo[];
  loading: boolean;
  filter: TodosFilter;
  filteredTodos: Todo[];
};

const initialState: TodosState = {
  todos: [],
  filteredTodos: [],
  loading: false,
  filter: 'ALL'
};


export const TodosStore = signalStore(
  {
    providedIn: 'root'
  },
  withState(initialState),

  withMethods((store, todoService = inject(TodoService)) => ({

    async loadAll() {
      patchState(store, { loading: true });
      const todos = await todoService.getTodos();
      patchState(store, { todos, loading: false });
    },
    async addTodo(title: string) {
      patchState(store, { loading: true });
      const newTodo = await todoService.addTodo({ title, completed: false });
      patchState(store, state => ({
        todos: [...state.todos, newTodo],
        loading: false
      }));
    },
    async deleteTodo(id: string) {
      patchState(store, { loading: true });
      await todoService.deleteTodo(id);
      patchState(store, state => ({
        todos: state.todos.filter(todo => todo.id !== id),
        loading: false
      }));
    },
    async updateTodo(id: string, completed: boolean) {
      await todoService.updateTodo(id, completed);
      patchState(store, state => ({
        todos: state.todos.map(todo => todo.id === id ? { ...todo, completed } : todo)
      }));
    },
    updateFilter(filter: TodosFilter) {
      patchState(store, { filter });
    },
    loadTodos: rxMethod(pipe(
      tap(() => patchState(store, { loading: true })),
      switchMap(() => {
        return of(todoService.getTodos()).pipe(
          switchMap(promise => promise),
          tap(todos => patchState(store, { todos, loading: false })),
          tap(todos => console.log('Todos loaded with rxMethod: ', todos))
        )
      }),
    )),
  })
  ),
  withComputed((state) => ({
    filteredTodos: computed(() => {
      const todos = state.todos();
      switch (state.filter()) {
        case 'COMPLETED':
          return todos.filter(todo => todo.completed);
        case 'PENDING':
          return todos.filter(todo => !todo.completed);
        default:
          return todos;
      }
    })
  })),
  withDevtools('TodosStore'),
  withLogger('TodosStore'));