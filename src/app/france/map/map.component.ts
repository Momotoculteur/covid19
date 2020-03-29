import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { ResizeEvent } from 'angular-resizable-element';
import { EGranulariteCarte } from 'src/app/shared/enum/EGranulariteCarte';
import { G_MAP_GEOJSON_FRANCE_PATH, G_MAP_GEOJSON_DEPARTEMENT_PATH, G_MAP_GEOJSON_REGION_PATH } from 'src/app/shared/constant/CGlobal';


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
    public minDate: Date;
    public maxDate: Date;
    public currentDate: Date;

    public map: L.Map;

    public franceData;
    public regionData;
    public departementData;
    public currentDataDisplayed;

    public isFranceDataLoaded: boolean;
    public isRegionDataLoaded: boolean;
    public isDepartementLoaded: boolean;

    constructor(
        private http: HttpClient
    ) {
        this.widthSidebar = OLD_WIDTH_SIDEBAR;
        this.isOpenSidebar = true;
        this.selectedGranularityMap = EGranulariteCarte.PAYS;
        this.listAllGranularityMap = [EGranulariteCarte.PAYS, EGranulariteCarte.REGION, EGranulariteCarte.DEPARTEMENT];
        this.isFranceDataLoaded = false;
        this.isRegionDataLoaded = false;
        this.isDepartementLoaded = false;
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

        function highlightFeature(e) {
            console.log(e)
            const layer = e.target;

            layer.setStyle({
                weight: 5,
                color: "white",
                dashArray: "",
                fillOpacity: 0.2
            });

            if (!L.Browser.ie && !L.Browser.edge) {
                layer.bringToFront();
            }

        }

        function resetHighlight(e) {
			geojson.resetStyle(e.target);
		}

        this.map = L.map('map').setView([46.303558, 6.0164252], 6);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            id: 'mapbox',
            attribution: 'Bastien MAURICE'
        }).addTo(this.map);

        this.http.get(G_MAP_GEOJSON_FRANCE_PATH).subscribe((json: any) => {
            this.franceData = L.geoJSON(json, {
                onEachFeature: function onEachFeature(feature, layer) {

                }
            });
            this.map.addLayer(this.franceData);
            console.log('FRANCE OK')
            this.isFranceDataLoaded = true;
        });

        this.http.get(G_MAP_GEOJSON_DEPARTEMENT_PATH).subscribe((json: any) => {
            this.departementData = L.geoJSON(json, {
                onEachFeature: function onEachFeature(feature, layer) {
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight
                    });
                }
            });
            console.log('DEP OK')
            this.isDepartementLoaded = true;
        });

        this.http.get(G_MAP_GEOJSON_REGION_PATH).subscribe((json: any) => {
            this.regionData = L.geoJSON(json, {
                onEachFeature: function onEachFeature(feature, layer) {
                    layer.on({
                    });
                }
            });
            console.log('REGION OK')
            this.regionData = true;
        });
    }




    public updateGranularity(): void {
        switch (this.selectedGranularityMap) {
            case EGranulariteCarte.PAYS: {
                this.map.removeLayer(this.currentDataDisplayed);
                this.currentDataDisplayed = this.franceData;
                this.map.addLayer(this.currentDataDisplayed);

                console.log(this.currentDataDisplayed)
                break;
            }
            case EGranulariteCarte.REGION: {
                this.map.removeLayer(this.currentDataDisplayed);
                this.currentDataDisplayed = this.regionData;
                this.map.addLayer(this.currentDataDisplayed);
                console.log(this.currentDataDisplayed)

                break;
            }
            case EGranulariteCarte.DEPARTEMENT: {
                this.map.removeLayer(this.regionData);
                this.currentDataDisplayed = this.departementData;
                this.map.addLayer(this.currentDataDisplayed);
                console.log(this.currentDataDisplayed)
                break;
            }

        }
    }








}



