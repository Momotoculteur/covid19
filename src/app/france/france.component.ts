import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';

let MAX_WIDTH_SIDEBAR = 200;

@Component({
    selector: 'app-france',
    templateUrl: './france.component.html',
    styleUrls: ['./france.component.scss']
})
export class FranceComponent implements OnInit {

    public navLinks: any[];
    public isOpenSidebar: boolean;
    public widthSidebar: number;
    constructor() {
        this.navLinks = [
            {
                label: 'Carte',
                link: 'carte',
                index: 0
            }
        ];
        this.isOpenSidebar = false;
        this.widthSidebar = 30;
    }

    ngOnInit(): void {
    }

    public toggleSidebar(): void {
        this.isOpenSidebar = !this.isOpenSidebar;
        if (this.isOpenSidebar) {
            this.widthSidebar = MAX_WIDTH_SIDEBAR;
        } else {
            this.widthSidebar = 30;
        }
        this.emitSigneResizeGraphPlotly();
    }


    public onResizeEnd(event: ResizeEvent): void {
        console.log(event.rectangle.width)
        this.widthSidebar = MAX_WIDTH_SIDEBAR = event.rectangle.width;
        this.emitSigneResizeGraphPlotly()
    }

    public validate(event: ResizeEvent): boolean {
        const MIN_DIMENSIONS_PX: number = 100;
        if (
          event.rectangle.width &&
          (event.rectangle.width < MIN_DIMENSIONS_PX)
        ) {
          return false;
        }
        return true;
    }

    private emitSigneResizeGraphPlotly(): void {
        window.dispatchEvent(new Event('resize'));
    }

}
