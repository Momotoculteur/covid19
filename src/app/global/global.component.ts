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
                label: 'Graphique',
                link: 'graphique',
                index: 0
            },
            {
                label: 'Carte',
                link: 'carte',
                index: 1
            }
        ];
    }

    ngOnInit(): void {
    }

}
