import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { G_LAST_COMMIT_DATE_PATH } from 'src/app/shared/constant/CGlobal';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
    public lastCommitDate: string;


    constructor(private http: HttpClient) { 
        this.loadLastCommitDate();
    }

    public loadLastCommitDate(): void {
        this.http.get(G_LAST_COMMIT_DATE_PATH, { responseType: 'text' })
        .subscribe(data => {
            this.lastCommitDate = data;
        });
    }

    ngOnInit(): void {
        
    }

}
