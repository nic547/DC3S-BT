import { NgModule } from '@angular/core';
import { EditIconDirective } from './edit-icon.directive';
import { DeleteIconDirective } from './delete-icon.directive';
import { DownloadIconDirective } from './download-icon.directive';
import { CloseIconDirective } from './close-icon.directive';

@NgModule({
  imports: [
    EditIconDirective,
    DeleteIconDirective,
    DownloadIconDirective,
    CloseIconDirective
  ],
  exports: [
    EditIconDirective,
    DeleteIconDirective,
    DownloadIconDirective,
    CloseIconDirective
  ]
})
export class IconModule { }