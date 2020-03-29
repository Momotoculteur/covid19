import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { ResizeEvent } from 'angular-resizable-element';
import { EGranulariteCarte } from 'src/app/shared/enum/EGranulariteCarte';


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
    public selectedGranularityMap: EGranulariteCarte;
    public listAllGranularityMap: EGranulariteCarte[];

    public map: L.Map;

    public franceData;
    public regionData;
    public departementData;

    constructor(
        private http: HttpClient
    ) {
        this.widthSidebar = OLD_WIDTH_SIDEBAR;
        this.isOpenSidebar = true;
        this.selectedGranularityMap = EGranulariteCarte.PAYS;
        this.listAllGranularityMap = [EGranulariteCarte.PAYS, EGranulariteCarte.REGION, EGranulariteCarte.DEPARTEMENT];

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
        this.map = L.map('map').setView([46.303558, 6.0164252], 6);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            id: 'mapbox',
            attribution: 'Bastien MAURICE'
        }).addTo(this.map);

        this.http.get('assets/geo/france/PAYS.json').subscribe((json: any) => {
            this.franceData = L.geoJSON(json, {
                onEachFeature: function onEachFeature(feature, layer) {
                }
            });
            this.map.addLayer(this.franceData)
        });

        this.http.get('assets/geo/france/DEPARTEMENT.json').subscribe((json: any) => {
            this.departementData = L.geoJSON(json, {
                onEachFeature: function onEachFeature(feature, layer) {
                }
            });
        });

        this.http.get('assets/geo/france/REGION.json').subscribe((json: any) => {
            this.regionData = L.geoJSON(json, {
                onEachFeature: function onEachFeature(feature, layer) {
                }
            });
        });

    }

    public updateGranularity(): void {
        switch(this.selectedGranularityMap) {
            case EGranulariteCarte.PAYS: {
                this.map.removeLayer(this.regionData);
                this.map.removeLayer(this.departementData);
                this.map.addLayer(this.franceData);

                console.log(this.franceData)
                break;
            }
            case EGranulariteCarte.REGION: {
                this.map.removeLayer(this.franceData);
                this.map.removeLayer(this.departementData);
                this.map.addLayer(this.regionData);
                console.log(this.regionData)

                break;
            }
            case EGranulariteCarte.DEPARTEMENT: {
                this.map.removeLayer(this.regionData);
                this.map.removeLayer(this.franceData);
                this.map.addLayer(this.departementData);
                console.log(this.departementData)
                break;
            }

        }

    
    }






}



