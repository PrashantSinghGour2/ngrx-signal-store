import { Component, effect, inject, viewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleChange, MatButtonToggleGroup, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TodosFilter, TodosStore } from '../../store/todo.store';
import { NgStyle } from '@angular/common';
@Component({
  selector: 'todo-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonToggleModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    NgStyle
],
  template: `
    <div class="todo-list">
      <p>Todo List</p>
      <div class="todo-list__input">
        <mat-form-field>
          <mat-label>Enter Todo and press Enter</mat-label>
          <input matInput #input placeholder="Enter todo.." (keydown.enter)="onAddTodo(input.value); input.value = ''"/>
          <mat-icon matSuffix>edit</mat-icon>
        </mat-form-field>
      </div>
      <div class="todo-list__filter">
        <mat-button-toggle-group
          #filter (change)="onFilterTodos($event)">
          <mat-button-toggle value="ALL">All</mat-button-toggle>
          <mat-button-toggle value="COMPLETED">Completed</mat-button-toggle>
          <mat-button-toggle value="PENDING">Pending</mat-button-toggle>
        </mat-button-toggle-group>
      </div>
      @if (todosStore.loading()) {
        <div class="todo-list__loading">
          <mat-spinner diameter="40" />
        </div>
      } @else {
        <div class="todo-list__items">
          <mat-list>
            @for (todo of todosStore.filteredTodos(); track todo.id) {
              <mat-list-item>
                <div class="todo-item">
                  <mat-checkbox 
                    [checked]="todo.completed" 
                    (change)="onTodoToggled(todo.id, $event.checked)">
                  </mat-checkbox>
                  <span [ngStyle]="{'text-decoration': todo.completed ? 'line-through' : 'none'}">{{ todo.title }}</span>
                  <mat-icon class="todo-item__delete" (click)="onDeleteTodo(todo.id, $event)">delete</mat-icon>
                </div>
              </mat-list-item>
            }
          </mat-list>
        </div>
      }
    </div>
  `,
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  
  todosStore = inject(TodosStore);
  filter = viewChild.required(MatButtonToggleGroup);

  constructor() {
    effect(() => {
      const filter  = this.filter();
      filter.value = this.todosStore.filter();
    });
  }

  async onAddTodo(input: string) {
    await this.todosStore.addTodo(input);
  }

  async onDeleteTodo(id: string, event: Event) {
    event.stopPropagation();
    await this.todosStore.deleteTodo(id);
  }

  async onTodoToggled(id: string, completed: boolean) {
    await this.todosStore.updateTodo(id, completed);
  }

  async onFilterTodos(event: MatButtonToggleChange) {
    const filter = event.value as TodosFilter;
    await this.todosStore.updateFilter(filter);
  }
}
