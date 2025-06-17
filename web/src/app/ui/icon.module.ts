import { NgModule } from '@angular/core';
import { AddIconDirective } from './add-icon.directive';
import { ArrowBackIconDirective } from './arrow-back-icon.directive';
import { ArrowForwardIconDirective } from './arrow-forward-icon.directive';
import { CloseIconDirective } from './close-icon.directive';
import { DeleteIconDirective } from './delete-icon.directive';
import { DownloadIconDirective } from './download-icon.directive';
import { EditIconDirective } from './edit-icon.directive';
import { RemoveIconDirective } from './remove-icon.directive';

@NgModule({
    imports: [
        EditIconDirective,
        DeleteIconDirective,
        DownloadIconDirective,
        CloseIconDirective,
        RemoveIconDirective,
        AddIconDirective,
        ArrowBackIconDirective,
        ArrowForwardIconDirective,
    ],
    exports: [
        EditIconDirective,
        DeleteIconDirective,
        DownloadIconDirective,
        CloseIconDirective,
        RemoveIconDirective,
        AddIconDirective,
        ArrowBackIconDirective,
        ArrowForwardIconDirective,
    ],
})
export class IconModule {}
