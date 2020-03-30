import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { ResizeEvent } from 'angular-resizable-element';
import { EGranulariteCarte } from 'src/app/shared/enum/EGranulariteCarte';
import { G_MAP_GEOJSON_FRANCE_PATH, G_MAP_GEOJSON_DEPARTEMENT_PATH, G_MAP_GEOJSON_REGION_PATH, isDateEqual } from 'src/app/shared/constant/CGlobal';
import { latLng, tileLayer, circle, geoJSON } from 'leaflet';
import { EGraphType } from '../../shared/enum/EGraphType';
import { G_redGradient, G_orangeGradient, G_greenGradient } from 'src/app/shared/constant/CGradientLedendColor';

interface ITemplateProps {
    active: number;
    confirmed: number;
    date: Date;
    death: number;
    hospitalized: number;
    mortalityRate: number;
    recovered: number;
    recoveredRate: number;
    reanimated: number;
}

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
    public selectedTypeGraph: EGraphType;
    public listTypeGraph: EGraphType[];

    // LAYER GEOJSON
    public franceLayer: L.GeoJSON;
    public regionLayer: L.GeoJSON;
    public departementLayer: L.GeoJSON;

    // MIN/MAX de chaque courbe
    public maximalDeath: number;
    public maximalConfirmed: number;
    public maximalActive: number;
    public maximalHospitalized: number;
    public maximalReanimated: number;
    public maximalRecovered: number;
    public maximalMortalityRate: number;
    public maximalRecoveryRate: number;

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

    // DEGRADE  
    public selectedLegendColorGradient: string[];
    public selectedLegendInfos: string[];
    public onHoverLegendInfos: string;
    constructor(
        private http: HttpClient,
        private ref: ChangeDetectorRef
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
        ];
        this.onHoverLegendInfos = '';

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
                style: {
                    color:'#4974ff'
                },
                onEachFeature: (feature, layer) => {
                    layer.on('mouseover', (e) => this.highlightFeature(e));
                    layer.on('mouseout', (e) => this.resetHighlight(e));
                    //layer.on('click', (e) => this.zoomToFeature(e));
                }
            });
            this.layersControl.push(this.franceLayer);
            this.updateDateMinMaxSelected();
            this.updateLegendValues();
        });

        this.http.get(G_MAP_GEOJSON_DEPARTEMENT_PATH).subscribe((json: any) => {
            this.departementLayer = L.geoJSON(json, {
                style: {
                    color:'#4974ff'
                },
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
                style: {
                    color:'#4974ff'
                },
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
        this.updateLegendValues();


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
                this.regionLayer.resetStyle(e.target);
                break;

            }
        }

        this.onHoverLegendInfos = ''
        this.ref.detectChanges();
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
        this.onHoverLegendInfos = layer.feature.properties.nom as string;
        this.ref.detectChanges();
    }

    public changeGranularity(): void {
        this.updateDateMinMaxSelected();
        this.updateLegendValues();

    }

    private updateLegendValues(): void {
        switch (this.selectedGranularityMap) {
            case EGranulariteCarte.PAYS: {
                this.legendValuesMax(this.franceLayer);
                break;
            }
            case EGranulariteCarte.REGION: {
                this.legendValuesMax(this.regionLayer);

                break;
            }
            case EGranulariteCarte.DEPARTEMENT: {
                this.legendValuesMax(this.departementLayer);

                break;
            }
        }
    }

    private legendValuesMax(layer): void {
        let maxValue = 0;
        layer.eachLayer((current) => {

            current.feature.properties.value.forEach((prop: ITemplateProps) => {   

                if (isDateEqual(new Date(prop.date),this.selectedDate)) {
                    console.log(prop) 

                    switch (this.selectedTypeGraph) {
                        case EGraphType.CONFIRMED : {
                            if (prop.confirmed > maxValue) {
                                maxValue = prop.confirmed;
                            }
                            break;
                        }
                        case EGraphType.DEATH : {
                            if (prop.death > maxValue) {
                                maxValue = prop.death;
                            }
                            break;
                        }
                        case EGraphType.ACTIVE : {
                            if (prop.active > maxValue) {
                                maxValue = prop.active;
                            }
                            break;
                        }
                        case EGraphType.HOSPITALIZED : {
                            if (prop.hospitalized > maxValue) {
                                maxValue = prop.hospitalized;
                            }
                            break;
                        }
                        case EGraphType.REANIMATED : {
                            if (prop.reanimated > maxValue) {
                                maxValue = prop.reanimated;
                            }
                            break;
                        }
                        case EGraphType.RECOVERED : {
                            if (prop.recovered > maxValue) {
                                maxValue = prop.recovered;
                            }
                            break;
                        }
                        case EGraphType.RECOVERY_RATE : {
                            if (prop.recoveredRate > maxValue) {
                                maxValue = prop.recoveredRate;
                            }
                            break;
                        }
                        case EGraphType.MORTALITY_RATE : {
                            if (prop.mortalityRate > maxValue) {
                                maxValue = prop.mortalityRate;
                            }
                            break;
                        }
                    }
                    

                }
            });
        });






        console.log(maxValue)
        let tick = Math.round(maxValue / 7)
        console.log(tick)
        this.selectedLegendInfos = [
            String(tick * 6),
            String(tick * 5),
            String(tick * 4),
            String(tick * 3),
            String(tick * 2),
            String(tick)
        ];
    }

    public dateChanged(newDate: Date): void {
        this.selectedDate = newDate;
        this.updateLegendValues();

    }


    public updateDateMinMaxSelected(): void {
        switch (this.selectedGranularityMap) {
            case EGranulariteCarte.PAYS: {
                this.iteratorDates(this.franceLayer);
                break;
            }
            case EGranulariteCarte.REGION: {
                this.iteratorDates(this.regionLayer);

                break;
            }
            case EGranulariteCarte.DEPARTEMENT: {
                this.iteratorDates(this.departementLayer);

                break;
            }
        }
    }

    private iteratorDates(layer): void {

        layer.eachLayer((current) => {
            //let listProps: ITemplateProps[];
            //listProps = current.feature.properties.value;
            //current.feature.properties.value
            
            current.feature.properties.value.forEach((prop: ITemplateProps) => {    
                if(this.minDate === undefined) {
                    this.minDate = new Date(prop.date);
                }    
                if(this.maxDate === undefined) {
                    this.maxDate = new Date(prop.date);
                } 
                if(this.selectedDate === undefined) {
                    this.selectedDate = new Date(prop.date);
                } 
                if (new Date(prop.date) > this.maxDate ) {
                    this.maxDate = new Date(prop.date);
                    this.selectedDate = new Date(prop.date);
                }

                if (new Date(prop.date) < this.minDate ) {
                    this.minDate = new Date(prop.date);
                }
            });
        });
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



