import { Component, OnInit } from '@angular/core';
import { faWineGlassAlt, faGlobe, faHome, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { EFooterNav } from 'src/app/shared/enum/EFooterNav';
import { FooterComService } from '../service/footer-com.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    public iconFrance: any;
    public iconWorld: any;
    public iconHome: any;
    public iconQuestion: any;

    public eFooterNav = EFooterNav;

    constructor(
        private footerComService: FooterComService
    ) {
        this.iconFrance = faWineGlassAlt;
        this.iconWorld = faGlobe;
        this.iconHome = faHome;
        this.iconQuestion = faQuestion;
    }

    ngOnInit(): void {
    }

    public updateFooterNavInfos(newVal: EFooterNav): void {
        this.footerComService.updateNavInfosValue(newVal);
    }


}
