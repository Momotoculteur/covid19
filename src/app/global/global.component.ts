import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-global',
    templateUrl: './global.component.html',
    styleUrls: ['./global.component.scss']
})
export class GlobalComponent implements OnInit {

    public navLinks: any[];

    constructor() {
        this.navLinks = [
            {
              label: 'Carte',
              link: 'carte',
              index: 0
            }
          ];
    }

    ngOnInit(): void {
    }

}
