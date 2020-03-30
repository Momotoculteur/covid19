import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { ResizeEvent } from 'angular-resizable-element';
import { EGranulariteCarte } from 'src/app/shared/enum/EGranulariteCarte';
import { G_MAP_GEOJSON_FRANCE_PATH, G_MAP_GEOJSON_DEPARTEMENT_PATH, G_MAP_GEOJSON_REGION_PATH } from 'src/app/shared/constant/CGlobal';
import { latLng, tileLayer, circle, geoJSON } from 'leaflet';


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
    public aliasGranularityMap = EGranulariteCarte;
    public minDate: Date;
    public maxDate: Date;
    public currentDate: Date;

    public franceLayer;
    public regionLayer;
    public departementLayer;


    public layersOptions;
    public layersControl = [];

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

    
        
       


        this.http.get(G_MAP_GEOJSON_FRANCE_PATH).subscribe((json: any) => {
            this.franceLayer = L.geoJSON(json, {
                onEachFeature: (feature, layer) => {
                    layer.on('mouseover', (e) => this.highlightFeature(e));
                    layer.on('mouseout', (e) => this.resetHighlight(e));
                    //layer.on('click', () => this.selectedFeature(feature));
                }
            });
            // this.map.addLayer(this.franceLayer);
            this.layersControl.push(this.franceLayer)

        });

        this.http.get(G_MAP_GEOJSON_DEPARTEMENT_PATH).subscribe((json: any) => {
            console.log(json)
            console.log('DEP OK')
            this.departementLayer = L.geoJSON(json, {
                onEachFeature: (feature, layer) => {
                    layer.on('mouseover', (e) => this.highlightFeature(e));
                    layer.on('mouseout', (e) => this.resetHighlight(e));
                    //layer.on('click', () => this.selectedFeature(feature));
                }
            });
            this.layersControl.push(this.departementLayer)


        });

        this.http.get(G_MAP_GEOJSON_REGION_PATH).subscribe((json: any) => {
            this.regionLayer = L.geoJSON(json, {
                onEachFeature: (feature, layer) => {
                    layer.on('mouseover', (e) => this.highlightFeature(e));
                    layer.on('mouseout', (e) => this.resetHighlight(e));
                    //layer.on('click', () => this.selectedFeature(feature));
                }
            });

            console.log('REGION OK')
            this.layersControl.push(this.regionLayer)

        });



        this.layersOptions = {
            layers: [
                tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Bastien MAURICE' })
            ],
            zoom: 6,
            center: latLng(46.303558, 6.0164252)
        };






    }

    public resetHighlight(e) {
        switch (this.selectedGranularityMap) {
            case EGranulariteCarte.PAYS: {
                this.franceLayer.resetStyle(e.target);
                break;
            }
            case EGranulariteCarte.REGION: {
                this.regionLayer.resetStyle(e.target);
                break;
            }
            case EGranulariteCarte.DEPARTEMENT: {
                this.departementLayer.resetStyle(e.target);
                break;
            }
        }
        //info.update();
    }

    public highlightFeature(e) {

        const layer = e.target;
        layer.setStyle({
            weight: 5,
            color: 'white',
            dashArray: "",
            fillOpacity: 0.2
        });

        if (!L.Browser.ie && !L.Browser.edge) {
            layer.bringToFront();
        }

       

        //info.update(layer.feature.properties);
    }

    onMapReady(map: L.Map) {
        /*function resetHighlight(e) {
            geojson.resetStyle(e.target);
        }

        function highlightFeature(e) {
            var layer = e.target;

            layer.setStyle({
                weight: 5,
                color: "#666",
                dashArray: "",
                fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
        }

        const onEachFeature = (feature, layer) => {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight
            });
        };
        
                function getColor(d) {
                    return d > 100000000
                      ? "#800026"
                      : d > 80000000
                      ? "#BD0026"
                      : d > 50000000
                      ? "#E31A1C"
                      : d > 10000000
                      ? "#FC4E2A"
                      : d > 1000000
                      ? "#FD8D3C"
                      : d > 1000000
                      ? "#FEB24C"
                      : d > 100000
                      ? "#FED976"
                      : "blue";
                  }
                  
                  function style(feature) {
                    return {
                      weight: 2,
                      opacity: 1,
                      color: "white",
                      dashArray: "3",
                      fillOpacity: 0.7,
                      fillColor: getColor(feature.properties.pop_est)
                    };
                  }
              
                
              
                  let geojson = L.geoJSON(euCountries, {
                    style: style,
                    onEachFeature: onEachFeature
                  }).addTo(map);
              
                  map.fitBounds(geojson.getBounds());
                }*/
    }










}



