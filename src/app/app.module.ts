import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { ObjToArrayPipe } from './ObjToArray.pipe';
import { KeysToArrayPipe } from './KeysToArray.pipe';

@NgModule({
  declarations: [	
    AppComponent,
    DragDropComponent,
    ObjToArrayPipe,
    KeysToArrayPipe
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
