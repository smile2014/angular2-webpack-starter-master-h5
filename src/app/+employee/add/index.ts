import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { EmployeeAdd } from './add.component';

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: EmployeeAdd, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    EmployeeAdd
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export default class EmployeeAddModule {
  static routes = routes;
}
