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


        this.map = L.map('map').setView([46.303558, 6.0164252], 6);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            id: 'mapbox',
            attribution: 'Bastien MAURICE'
        }).addTo(this.map);

        let info;
        info = new L.Control();

		info.onAdd = function() {
			this._div = L.DomUtil.create("div", "info");
			this.update();
			return this._div;
		};

		info.update = function(props) {
            console.log(props)
            
			this._div.innerHTML =
				(props ? "<b>" + props.nom + "</b><br />" : "");
		};

        info.addTo(this.map);
        
        function highlightFeature(e) {
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

			info.update(layer.feature.properties);
        }
        
        function resetHighlight(e) {
            info.update();
        }
        function getColor(d) {
            return d > 1000 ? '#800026' :
                   d > 500  ? '#BD0026' :
                   d > 200  ? '#E31A1C' :
                   d > 100  ? '#FC4E2A' :
                   d > 50   ? '#FD8D3C' :
                   d > 20   ? '#FEB24C' :
                   d > 10   ? '#FED976' :
                              '#FFEDA0';
        }

        let legend = new L.Control().setPosition('bottomright');
        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 10, 20, 50, 100, 200, 500, 1000],
                labels = [];
        
            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }
        
            return div;
        };
        
        legend.addTo(this.map);


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

                }
            });
            console.log('REGION OK')
            this.isRegionDataLoaded = true;
        });

        this.map.on('mouseover', (e) => {
            console.log(e.target)
        });
    }




    public updateGranularity(): void {
        switch (this.selectedGranularityMap) {
            case EGranulariteCarte.PAYS: {
                this.map.removeLayer(this.regionData);
                this.map.removeLayer(this.departementData);

                this.map.addLayer(this.franceData);
                break;
            }
            case EGranulariteCarte.REGION: {
                this.map.removeLayer(this.franceData);
                this.map.removeLayer(this.departementData);

                this.map.addLayer(this.regionData);

                break;
            }
            case EGranulariteCarte.DEPARTEMENT: {
                this.map.removeLayer(this.regionData);
                this.map.removeLayer(this.franceData);

                this.map.addLayer(this.departementData);
                break;
            }

        }
    }








}



