import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-france',
    templateUrl: './france.component.html',
    styleUrls: ['./france.component.scss']
})
export class FranceComponent implements OnInit {

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
