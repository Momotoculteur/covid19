import { Component, OnInit } from '@angular/core';
import { faWineGlassAlt, faGlobe, faHome, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { EFooterNav } from 'src/app/shared/enum/EFooterNav';
import { FooterComService } from '../../shared/service/footer-com.service';
import { EHeaderNav } from '../../shared/enum/EHeaderNav';

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
    public EHeaderNav = EHeaderNav;
    public detailledMenu: EHeaderNav;

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

    public updateNavInfos(newValFooter: EFooterNav, newValHeader: EHeaderNav): void {
        this.footerComService.updateNavInfosValue(newValFooter);
        this.detailledMenu = newValHeader;
    }


}
