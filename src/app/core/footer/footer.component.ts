import { Component, OnInit } from '@angular/core';
import { faTwitter, faYoutube, faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';
import { EFooterNav } from 'src/app/shared/enum/EFooterNav';
import { FooterComService } from '../service/footer-com.service';

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

    public navFooterInfo: EFooterNav;

    constructor(
        private footerComService: FooterComService
    ) {
        this.iconTwitter = faTwitter;
        this.iconLinkedin = faLinkedinIn;
        this.iconYoutube = faYoutube;
        this.iconGithub = faGithub;

        this.navFooterInfo = EFooterNav.WELCOME;

        this.footerComService.getObsNavInfos().subscribe( (newVal: EFooterNav) => {
            this.navFooterInfo = newVal;
        });
    }

    ngOnInit(): void {
    }

}
