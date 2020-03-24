import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'dialog-licence-details',
    templateUrl: 'dialogLicenceDetails.html',
    styleUrls: ['./dialogLicenceDetails.scss']
})
export class DialogLicenceDetailsComponent {

    public allLicencesDetails: any;

    constructor(
        public dialogRef: MatDialogRef<DialogLicenceDetailsComponent>,
        private http: HttpClient
    ) {
        this.http.get('assets/licence/licences.txt', {responseType: 'text'})
            .subscribe((data) =>  {
                this.allLicencesDetails = data;
        });
    }

    public onNoClick(): void {
        this.dialogRef.close();
    }



}
