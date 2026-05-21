import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import { TodoListComponent } from './components/todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoListComponent],
  template: `
    <div class="app">
      <h5 class="app__header">
        <img src="https://ngrx.io/ngrx-logo.svg" alt="NGRX Logo" /> NGRX Signal
        Store
      </h5>
    </div>
    <todo-list />
  `,
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  ngOnInit(): void { }
}
