import { Component, OnInit } from '@angular/core';
import { faTwitter, faYoutube, faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';
import { G_LAST_COMMIT_DATE_PATH } from 'src/app/shared/constant/CGlobal';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {


    public iconTwitter: any;
    public iconLinkedin: any;
    public iconYoutube: any;
    public iconGithub: any;


    public lastCommitDate: string;


    constructor(
        private http: HttpClient
    ) {
        this.iconTwitter = faTwitter;
        this.iconLinkedin = faLinkedinIn;
        this.iconYoutube = faYoutube;
        this.iconGithub = faGithub;

        this.loadLastCommitDate();
    }

    private loadLastCommitDate(): void {
        this.http.get(G_LAST_COMMIT_DATE_PATH, { responseType: 'text' })
        .subscribe(data => {
            this.lastCommitDate = data;
        });
    }

    ngOnInit(): void {
    }

}
