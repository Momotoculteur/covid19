import { Component, OnInit } from '@angular/core';
import { faTwitter, faYoutube, faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogLicenceDetailsComponent } from './dialogLicenceDetails/dialog-licence-details.component';

@Component({
    selector: 'app-infos',
    templateUrl: './infos.component.html',
    styleUrls: ['./infos.component.scss']
})
export class InfosComponent implements OnInit {

    public iconTwitter: any;
    public iconLinkedin: any;
    public iconYoutube: any;
    public iconGithub: any;


    constructor(
        public dialog: MatDialog
        ) {
        this.iconTwitter = faTwitter;
        this.iconLinkedin = faLinkedinIn;
        this.iconYoutube = faYoutube;
        this.iconGithub = faGithub;
    }

    ngOnInit(): void {
    }

    public openDialog(): void {
        const dialogRef = this.dialog.open(DialogLicenceDetailsComponent, {
            width: '90vw',
            height: '90vh',
            autoFocus: false
          });
    }

}
