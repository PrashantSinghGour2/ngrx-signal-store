import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { TodosStore } from './store/todo.store';
import { JsonPipe } from '@angular/common';
import { TodoListComponent } from './components/todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JsonPipe, TodoListComponent],
  template: `
    <div class="app">
      <h5 class="app__header">
        <img src="https://ngrx.io/ngrx-logo.svg" alt="NGRX Logo" /> NGRX Signal
        Store
      </h5>
    </div>

    <!-- {{todoStore.todos() | json}} -->
    <todo-list />
  `,
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  todoStore = inject(TodosStore);

  ngOnInit(): void {
    this.loadTodos().then(() => console.log('Todos loaded!'));
  }

  async loadTodos() {
    await this.todoStore.loadAll();
  }
}
