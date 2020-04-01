import { Component, OnInit } from '@angular/core';
import { faWineGlassAlt, faGlobe, faHome, faQuestion } from '@fortawesome/free-solid-svg-icons';
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

    public EHeaderNav = EHeaderNav;
    public detailledMenu: EHeaderNav;

    constructor(
    ) {
        this.iconFrance = faWineGlassAlt;
        this.iconWorld = faGlobe;
        this.iconHome = faHome;
        this.iconQuestion = faQuestion;
        this.detailledMenu = EHeaderNav.WELCOME;
    }

    ngOnInit(): void {
    }

    public updateNavInfos(newValHeader: EHeaderNav): void {
        this.detailledMenu = newValHeader;
    }


}
