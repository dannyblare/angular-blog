import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
imports:[HttpClientModule,AngularEditorModule ],
exports:[HttpClientModule]
})

export class SharedModule{

}