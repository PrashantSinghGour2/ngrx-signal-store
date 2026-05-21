import { signalStore, withState } from '@ngrx/signals';
import { Todo, TodosFilter } from '../model/todo.model';

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
);