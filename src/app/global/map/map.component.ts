import { Component, OnInit } from '@angular/core';
import { EGraphType } from 'src/app/shared/enum/EGraphType';
import { tileLayer, latLng } from 'leaflet';
import { G_redGradient } from 'src/app/shared/constant/CGradientLedendColor';
import { ResizeEvent } from 'angular-resizable-element';

const MIN_WIDTH_SIDEBAR = 300;
let OLD_WIDTH_SIDEBAR = 300;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    // MENU
    public isOpenSidebar: boolean;
    public widthSidebar: number;
    public selectedTypeGraph: EGraphType;
    public listTypeGraph: EGraphType[];
    // Layer
    public globalLayer;

    // DATE
    public selectedDate: Date;
    public minDate: Date;
    public maxDate: Date;

    // LAYER CONTROL
    public layersControl = [];
    public leafletMap: L.Map;
    public leafletOptions: any = {
        layers: [
            tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: 'Bastien MAURICE'
            })
        ],
        zoom: 6,
        center: latLng(46.303558, 6.0164252)
    };

    // LEGENDS BOTTOM  
    public selectedLegendColorGradient: string[];
    public selectedLegendInfos: number[];


    // LEGENDS TOP
    public isColorInversed: boolean;
    public onHoverLegendInfos: string;
    public onHoverLegendInfosValue: number;
    public onHoverLegendInfosValueMean: number;
    public onHoverLegendInfosValueMin: number;
    public onHoverLegendInfosValuemax: number;
    public isHoveringItem: boolean;

    // LEGENDS TOP J-1
    public onHoverLegendInfosValueDayBefore: number;
    public onHoverLegendInfosValueMeanDayBefore: number;
    public onHoverLegendInfosValueMinDayBefore: number;
    public onHoverLegendInfosValuemaxDayBefore: number;
    
    constructor() { 
        this.widthSidebar = OLD_WIDTH_SIDEBAR;
        this.isOpenSidebar = true;
        this.selectedTypeGraph = EGraphType.DEATH;
        this.selectedLegendColorGradient = G_redGradient;
        this.listTypeGraph = [
            EGraphType.CONFIRMED,
            EGraphType.DEATH,
            EGraphType.ACTIVE,
            EGraphType.RECOVERED,
            EGraphType.RECOVERY_RATE,
            EGraphType.MORTALITY_RATE
        ];
        this.selectedLegendInfos = [];
        this.onHoverLegendInfos = '';
        this.isHoveringItem = false;
        this.isColorInversed = true;
    }

    public toggleSidebar(): void {
        this.isOpenSidebar = !this.isOpenSidebar;
        if (this.isOpenSidebar) {
            this.widthSidebar = OLD_WIDTH_SIDEBAR;
        } else {
            this.widthSidebar = 30;
        }
    }

    public onResizeEnd(event: ResizeEvent): void {
        OLD_WIDTH_SIDEBAR = event.rectangle.width;
        this.widthSidebar = event.rectangle.width;
    }

    public validate(event: ResizeEvent): boolean {
        if (
            event.rectangle.width &&
            (event.rectangle.width < MIN_WIDTH_SIDEBAR)
        ) {
            return false;
        }
        return true;
    }

    ngOnInit(): void {
    }

}
