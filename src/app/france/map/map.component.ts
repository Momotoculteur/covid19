import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { ResizeEvent } from 'angular-resizable-element';
import { EGranulariteCarte } from 'src/app/shared/enum/EGranulariteCarte';
import { G_MAP_GEOJSON_FRANCE_PATH, G_MAP_GEOJSON_DEPARTEMENT_PATH, G_MAP_GEOJSON_REGION_PATH } from 'src/app/shared/constant/CGlobal';
import { latLng, tileLayer, circle, geoJSON } from 'leaflet';
import { EGraphType } from '../../shared/enum/EGraphType';
import { G_confirmedGradient, G_recoveredGradient, G_reanimatedGradient, G_activeGradient, G_hospitalizedGradient, G_redGradient, G_orangeGradient, G_greenGradient } from 'src/app/shared/constant/CGradientLedendColor';


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
    public selectedTypeGraph: EGraphType;
    public listTypeGraph: EGraphType[];

    // LAYER GEOJSON
    public franceLayer: L.GeoJSON;
    public regionLayer: L.GeoJSON;
    public departementLayer: L.GeoJSON;

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

    // DEGRADE  
    public selectedLegendColorGradient: string[];
    public selectedLegendInfos: string[];
    constructor(
        private http: HttpClient
    ) {
        this.widthSidebar = OLD_WIDTH_SIDEBAR;
        this.isOpenSidebar = true;
        this.selectedGranularityMap = EGranulariteCarte.PAYS;
        this.listAllGranularityMap = [EGranulariteCarte.PAYS, EGranulariteCarte.REGION, EGranulariteCarte.DEPARTEMENT];
        this.selectedTypeGraph = EGraphType.CONFIRMED;
        this.selectedLegendColorGradient = G_redGradient;
        this.listTypeGraph = [
            EGraphType.CONFIRMED,
            EGraphType.DEATH,
            EGraphType.ACTIVE,
            EGraphType.HOSPITALIZED,
            EGraphType.REANIMATED,
            EGraphType.RECOVERED,
            EGraphType.RECOVERY_RATE,
            EGraphType.MORTALITY_RATE
        ];

        this.selectedLegendInfos = [
            'a',
            'b',
            'c',
            'd',
            'e',
            'f'
        ]


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
                    //layer.on('click', (e) => this.zoomToFeature(e));
                }
            });
            this.layersControl.push(this.franceLayer)
        });

        this.http.get(G_MAP_GEOJSON_DEPARTEMENT_PATH).subscribe((json: any) => {
            console.log(json)
            console.log('DEP OK')
            this.departementLayer = L.geoJSON(json, {
                onEachFeature: (feature, layer) => {
                    layer.on('mouseover', (e) => this.highlightFeature(e));
                    layer.on('mouseout', (e) => this.resetHighlight(e));
                    //layer.on('click', (layer) => this.zoomToFeature(layer));
                }
            });
            this.layersControl.push(this.departementLayer)
        });

        this.http.get(G_MAP_GEOJSON_REGION_PATH).subscribe((json: any) => {
            this.regionLayer = L.geoJSON(json, {
                onEachFeature: (feature, layer) => {
                    layer.on('mouseover', (e) => this.highlightFeature(e));
                    layer.on('mouseout', (e) => this.resetHighlight(e));
                    //layer.on('click', (feature) => this.zoomToFeature(feature));
                }
            });
            this.layersControl.push(this.regionLayer)
        });

    }




    public zoomToFeature(e) {
        //this.franceLayer.fitBounds(e.target.getBounds());
    }

    public updateStyleMap(): void {
        
        let col;
        if(this.selectedTypeGraph === EGraphType.DEATH) { col = 'red'};
        if(this.selectedTypeGraph === EGraphType.RECOVERED) { col = 'green'};

        this.franceLayer.eachLayer((current: L.GeoJSON) => {
            current.setStyle({fillColor: col});
        })
        this.regionLayer.eachLayer((current: L.GeoJSON) => {
            current.setStyle({fillColor: col});
        })

        let tmp = this.departementLayer;
        tmp.eachLayer((current: L.GeoJSON) => {
            current.setStyle({fillColor: col});
        })

        this.departementLayer = tmp



        this.updateLengendColor();



    }

    public updateLengendColor(): void {
            switch (this.selectedTypeGraph) {
                case EGraphType.CONFIRMED : {
                    this.selectedLegendColorGradient = G_redGradient;
                    break;
                }
                case EGraphType.DEATH : {
                    this.selectedLegendColorGradient = G_redGradient;
                    break;
                }
                case EGraphType.ACTIVE : {
                    this.selectedLegendColorGradient = G_orangeGradient;

                    break;
                }
                case EGraphType.HOSPITALIZED : {
                    this.selectedLegendColorGradient = G_orangeGradient;
                    break;
                }
                case EGraphType.REANIMATED : {
                    this.selectedLegendColorGradient = G_orangeGradient;

                    break;
                }
                case EGraphType.RECOVERED : {
                    this.selectedLegendColorGradient =  G_greenGradient;

                    break;
                }
                case EGraphType.RECOVERY_RATE : {
                    this.selectedLegendColorGradient = G_greenGradient;
                    break;
                }
                case EGraphType.MORTALITY_RATE : {
                    this.selectedLegendColorGradient = G_redGradient;
                    break;
                }
            }
    }



    public resetHighlight(e): void {
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
                //this.departementLayer.resetStyle(e.target);

                e.target.setStyle({
                    color: 'blue'
                });
                break;

            }
        }

    }

    public up():  void {
        /*console.log("UPDATE")
        
        this.departementLayer.eachLayer((current: L.GeoJSON) => {
            console.log(current.setStyle({color: 'black'}));
        })
        */


    }

    public highlightFeature(e): void {

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
        //console.log(layer.feature.properties)
                // FAIRE ICI MAJ LEGENDS
        // FAIRE ICI MAJ LEGENDS
        // FAIRE ICI MAJ LEGENDS
        // FAIRE ICI MAJ LEGENDS
        // FAIRE ICI MAJ LEGENDS
        // FAIRE ICI MAJ LEGENDS

        // FAIRE ICI MAJ LEGENDS
       // this.updateLegendBubbleInfos(layer.feature.properties);

    }

    onMapReady(map: L.Map) {
        this.leafletMap = map;
       // this.infosLegend.addTo(this.leafletMap);

        //this.leafletMap.options = this.leafletOptions;
        //this.leafletMap.addLayer(this.leafletOptions.layers[0]);
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
              
                 const onEachFeature = (feature, layer) => {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
      });
    };
              
                  let geojson = L.geoJSON(euCountries, {
                    style: style,
                    onEachFeature: onEachFeature
                  }).addTo(map);
              
                  
                }*/

        //map.fitBounds(this.franceLayer.getBounds());

    }










}



