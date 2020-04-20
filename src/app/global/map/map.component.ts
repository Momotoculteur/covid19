import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EGraphType } from 'src/app/shared/enum/EGraphType';
import { tileLayer, latLng } from 'leaflet';
import { G_redGradient, G_orangeGradient, G_greenGradient } from 'src/app/shared/constant/CGradientLedendColor';
import { ResizeEvent } from 'angular-resizable-element';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { G_MAP_GEOJSON_GLOBAL_PATH, isDateEqual } from 'src/app/shared/constant/CGlobal';

const MIN_WIDTH_SIDEBAR = 300;
let OLD_WIDTH_SIDEBAR = 300;

interface ITemplateProps {
    Active: number;
    Confirmed: number;
    Date: Date;
    Death: number;
    Mortality_Rate: number;
    Recovered: number;
    Recovered_Rate: number;
}

const G_STYLE_INITIAL = {
    color: '#4974ff',
    fillOpacity: 0.7,
    weight: 2
};

const G_STYLE_HOVER = {
    weight: 5,
    color: 'white'
};

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
    public leafletMap: L.Map;
    public leafletOptions: any = {
        layers: [
            tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: 'Bastien MAURICE'
            })
        ],
        zoom: 3,
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

    
    constructor(
        private http: HttpClient,
        private ref: ChangeDetectorRef
    ) { 
        this.widthSidebar = OLD_WIDTH_SIDEBAR;
        this.isOpenSidebar = true;
        this.selectedTypeGraph = EGraphType.CONFIRMED;
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

    public dateChanged(newDate: Date): void {
        this.selectedDate = newDate;
        this.updateStyleMap();

    }
    private updateMinMaxMeanTopLegendInfos(): void {
        const propsId = this.getArgsId();
        let minValue: number;
        let maxValue: number;
        let meanValue = 0;
        let meanValueItemTotal = 0;

        let minValueDayBefore: number;
        let maxValueDayBefore: number;
        let meanValueDayBefore = 0;
        let meanValueItemTotalDayBefore = 0;

        this.globalLayer.eachLayer((current) => {            
            current.feature.properties.value.forEach((prop) => {
                if (isDateEqual(new Date(prop.Date), this.selectedDate)) {
                    meanValue += prop[propsId];
                    meanValueItemTotal++;
                    if (minValue === undefined) {
                        minValue = prop[propsId];
                    } else {
                        if (prop[propsId] < minValue) {
                            minValue = prop[propsId];
                        }
                    }
    
                    if (maxValue === undefined) {
                        maxValue = prop[propsId];
                    } else {
                        if (prop[propsId] > maxValue) {
                            maxValue = prop[propsId];
                        }
                    }
                }

                // Calcul des données de legendes pour J-1
                const dayBefore = new Date(this.selectedDate);
                dayBefore.setDate(dayBefore.getDate()-1);
                if (isDateEqual(dayBefore, new Date(prop.Date))) {
                    meanValueDayBefore += prop[propsId];
                    meanValueItemTotalDayBefore++;
                    if (minValueDayBefore === undefined) {
                        minValueDayBefore = prop[propsId];
                    } else {
                        if (prop[propsId] < minValueDayBefore) {
                            minValueDayBefore = prop[propsId];
                        }
                    }
    
                    if (maxValueDayBefore === undefined) {
                        maxValueDayBefore = prop[propsId];
                    } else {
                        if (prop[propsId] > maxValueDayBefore) {
                            maxValueDayBefore = prop[propsId];
                        }
                    }
                }
            });

        });


        this.onHoverLegendInfosValueMean = Number(Math.round(meanValue / meanValueItemTotal).toFixed(2));
        this.onHoverLegendInfosValueMin = Number(minValue.toFixed(2));
        this.onHoverLegendInfosValuemax = Number(maxValue.toFixed(2));

        this.onHoverLegendInfosValueMeanDayBefore = Number((Math.round(meanValueDayBefore / meanValueItemTotalDayBefore) -
            this.onHoverLegendInfosValueMean).toFixed(2));
        this.onHoverLegendInfosValueMinDayBefore = Number((minValue - minValueDayBefore).toFixed(2));
        this.onHoverLegendInfosValuemaxDayBefore = Number((maxValueDayBefore - maxValue).toFixed(2));

    }

    private updateLegendValues(): void {
        let maxValue = 0;
        this.globalLayer.eachLayer((current) => {

            current.feature.properties.value.forEach((prop: ITemplateProps) => {
                if (isDateEqual(new Date(prop.Date), this.selectedDate)) {
                    switch (this.selectedTypeGraph) {
                        case EGraphType.CONFIRMED: {
                            if (prop.Confirmed > maxValue) {
                                maxValue = prop.Confirmed;
                            }
                            break;
                        }
                        case EGraphType.DEATH: {
                            if (prop.Death > maxValue) {
                                maxValue = prop.Death;
                            }
                            break;
                        }
                        case EGraphType.ACTIVE: {
                            if (prop.Active > maxValue) {
                                maxValue = prop.Active;
                            }
                            break;
                        }
                        case EGraphType.RECOVERED: {
                            if (prop.Recovered > maxValue) {
                                maxValue = prop.Recovered;
                            }
                            break;
                        }
                        case EGraphType.RECOVERY_RATE: {
                            if (prop.Recovered_Rate > maxValue) {
                                maxValue = prop.Recovered_Rate;
                            }
                            break;
                        }
                        case EGraphType.MORTALITY_RATE: {
                            if (prop.Mortality_Rate > maxValue) {
                                maxValue = prop.Mortality_Rate;
                            }
                            break;
                        }
                    }


                }
            });
        });

        let tick = Math.round(maxValue / 7)

        this.selectedLegendInfos = [
            tick * 6,
            tick * 5,
            tick * 4,
            tick * 3,
            tick * 2,
            tick
        ];
    }


    public updateStyleMap(): void {
        this.updateLengendColor();
        this.updateLegendValues();
        this.updateMinMaxMeanTopLegendInfos();
        let argsId: string;
        switch (this.selectedTypeGraph) {
            case EGraphType.CONFIRMED: {
                argsId = 'Confirmed';
                this.isColorInversed = true;
                break;
            }
            case EGraphType.DEATH: {
                argsId = 'Death';
                this.isColorInversed = true;

                break;
            }
            case EGraphType.ACTIVE: {
                argsId = 'Active';
                this.isColorInversed = true;


                break;
            }
            case EGraphType.RECOVERED: {
                argsId = 'Recovered';
                this.isColorInversed = false;

                break;
            }
            case EGraphType.RECOVERY_RATE: {
                argsId = 'Recovered_Rate';
                this.isColorInversed = false;

                break;
            }
            case EGraphType.MORTALITY_RATE: {
                argsId = 'Mortality_Rate';
                this.isColorInversed = true;

                break;
            }
        }

        this.globalLayer.eachLayer((current) => {
            current.feature.properties.value.forEach((prop: ITemplateProps) => {
                if (isDateEqual(new Date(prop.Date), this.selectedDate)) {
                    current.setStyle({
                        fillColor: this.getColor(prop[argsId]),
                        fillOpacity: 0.7,
                        weight: 2
                    });
                }
            });
        });

    }

    public updateLengendColor(): void {
        switch (this.selectedTypeGraph) {
            case EGraphType.CONFIRMED: {
                this.selectedLegendColorGradient = G_redGradient;
                break;
            }
            case EGraphType.DEATH: {
                this.selectedLegendColorGradient = G_redGradient;
                break;
            }
            case EGraphType.ACTIVE: {
                this.selectedLegendColorGradient = G_orangeGradient;

                break;
            }
            case EGraphType.RECOVERED: {
                this.selectedLegendColorGradient = G_greenGradient;

                break;
            }
            case EGraphType.RECOVERY_RATE: {
                this.selectedLegendColorGradient = G_greenGradient;
                break;
            }
            case EGraphType.MORTALITY_RATE: {
                this.selectedLegendColorGradient = G_redGradient;
                break;
            }
        }
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

    public miseEnFormeLegendBottomTitle(): boolean {
        if (this.selectedTypeGraph === EGraphType.MORTALITY_RATE
            || this.selectedTypeGraph === EGraphType.RECOVERY_RATE) {
            return true;
        } else {
            return false;
        }
    }

    private getColor(value: number) {
        return value > this.selectedLegendInfos[0] ? this.selectedLegendColorGradient[0] :
            value > this.selectedLegendInfos[1] ? this.selectedLegendColorGradient[1] :
                value > this.selectedLegendInfos[2] ? this.selectedLegendColorGradient[2] :
                    value > this.selectedLegendInfos[3] ? this.selectedLegendColorGradient[3] :
                        value > this.selectedLegendInfos[4] ? this.selectedLegendColorGradient[4] :
                            this.selectedLegendColorGradient[5];
    }


    private initDatesMinMax(): void {
        this.globalLayer.eachLayer((current) => {
            //let listProps: ITemplateProps[];
            //listProps = current.feature.properties.value;
            //current.feature.properties.value
            current.feature.properties.value.forEach((prop: ITemplateProps) => {
                if (this.minDate === undefined) {
                    this.minDate = new Date(prop.Date);
                }
                if (this.maxDate === undefined) {
                    this.maxDate = new Date(prop.Date);
                }
                if (this.selectedDate === undefined) {
                    this.selectedDate = new Date(prop.Date);
                }
                if (new Date(prop.Date) > this.maxDate) {
                    this.maxDate = new Date(prop.Date);
                    this.selectedDate = new Date(prop.Date);
                }

                if (new Date(prop.Date) < this.minDate) {
                    this.minDate = new Date(prop.Date);
                }
            });
        });
    }

    ngOnInit(): void {

        this.http.get(G_MAP_GEOJSON_GLOBAL_PATH).subscribe((json: any) => {
            this.globalLayer = L.geoJSON(json, {
                style: G_STYLE_INITIAL,
                onEachFeature: (feature, layer) => {
                    layer.on('mouseover', (e) => this.highlightFeature(e));
                    layer.on('mouseout', (e) => this.resetHighlight(e));
                }
            });
            //this.layersControl.push(this.franceLayer);
            //this.updateDateMinMaxSelected();
            this.initDatesMinMax();
            this.updateStyleMap();


        });
    }

    onMapReady(map: L.Map) {
        this.leafletMap = map;
    }



    public resetHighlight(e): void {
        this.isHoveringItem = false;
        this.globalLayer.eachLayer((current) => {
            current.setStyle(G_STYLE_INITIAL);
        });

        this.onHoverLegendInfos = null;
        this.onHoverLegendInfosValue = null;
        this.ref.detectChanges();
    }

    private getArgsId(): string {
        let argsId: string;
        switch (this.selectedTypeGraph) {
            case EGraphType.CONFIRMED: {
                argsId = 'Confirmed';
                break;
            }
            case EGraphType.DEATH: {
                argsId = 'Death';
                break;
            }
            case EGraphType.ACTIVE: {
                argsId = 'Active';

                break;
            }
            case EGraphType.RECOVERED: {
                argsId = 'Recovered';

                break;
            }
            case EGraphType.RECOVERY_RATE: {
                argsId = 'Recovered_Rate';
                break;
            }
            case EGraphType.MORTALITY_RATE: {
                argsId = 'Mortality_Rate';
                break;
            }
        }
        return argsId;
    }

    
    private highlightFeature(e): void {
        this.isHoveringItem = true;
        
        const layer = e.target;

        layer.setStyle(G_STYLE_HOVER);

        let value: number;
        let valueDayBefore: number;
        const arg =  this.getArgsId();

        // Calcul des données de legendes pour J-1
        const dayBefore = new Date(this.selectedDate);
        dayBefore.setDate(dayBefore.getDate() - 1);

        layer.feature.properties.value.forEach((prop: ITemplateProps) => {
            if (isDateEqual(new Date(prop.Date), this.selectedDate)) {
                value = prop[arg];
            }

            if (isDateEqual(new Date(prop.Date), dayBefore)) {
                valueDayBefore = prop[arg];
            }
        });

        if (value) {
            this.onHoverLegendInfos = layer.feature.properties.CountryName as string;
            this.onHoverLegendInfosValue = Number(value.toFixed(2));
            this.onHoverLegendInfosValueDayBefore = Number((value - valueDayBefore).toFixed(2));
        } else {
            this.onHoverLegendInfos =  layer.feature.properties.CountryName as string;
            this.onHoverLegendInfosValue = null;
            this.onHoverLegendInfosValueDayBefore = null;
        }

        
        this.ref.detectChanges();
    }

}
