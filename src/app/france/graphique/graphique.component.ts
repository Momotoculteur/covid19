import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EGranulariteCarte } from 'src/app/shared/enum/EGranulariteCarte';
import { FranceRow } from 'src/app/shared/class/FranceRow';
import { HttpClient } from '@angular/common/http';
import { LAST_DATE, UPDATE_PLOTLY_VIEW, G_FRANCE_DATA_PATH } from 'src/app/shared/constant/CGlobal';
import * as clonedeep from 'lodash.clonedeep';
import { ResizeEvent } from 'angular-resizable-element';
import { EGraphType } from '../../shared/enum/EGraphType';
import { FormControl } from '@angular/forms';
import { IGraphicDefinition, IGaphicDataDefinition } from 'src/app/shared/interface/IGraphicDefinition';
import { EPlotType } from 'src/app/shared/enum/EPlotType';
import { EBarMode } from '../../shared/enum/EBarMode';
import { EScatterMode } from '../../shared/enum/EScatterMode';
import { ELegend } from 'src/app/shared/enum/ELegends';

const MIN_WIDTH_SIDEBAR = 300;
let OLD_WIDTH_SIDEBAR = 300;

const DEFAULT_COUNTRY = 'FRA';
const DEFAULT_REGION = 'REG-75';
const DEFAULT_DEPARTEMENTAL = 'DEP-33';

@Component({
    selector: 'app-graphique',
    templateUrl: './graphique.component.html',
    styleUrls: ['./graphique.component.scss']
})
export class GraphiqueComponent implements OnInit {
    public allData: FranceRow[];
    public filtredData: FranceRow[];

    public nbEntree: number;

    public currentGranulariteCarte: EGranulariteCarte;
    public allMapviewType: EGranulariteCarte[];
    public isOpenSidebar: boolean;
    public widthSidebar: number;

    public minDate: Date;
    public maxDate: Date;
    public currentDate: Date;
    public selectedDateMin: Date;
    public selectedDateMax: Date;

    public uniqueDate: boolean;

    public uniqueGraphique: boolean;
    public listTypeGraph: EGraphType[];
    
    public allGraphics: IGraphicDefinition[];
    public selectedSpecificGraphicsList: EGraphType[];

    public selectedPlotType: EPlotType;
    public listPlotType: EPlotType[];

    public aliasPlotType = EPlotType;

    public allBarSubmob: EBarMode[];
    public selectedBarSubmod: EBarMode;

    public allScatterSubmod: EScatterMode[];
    public selectedScatterSubmod: string;

    public selectedGap: number;
    public selectedGapGroup: number;



    constructor(
        private http: HttpClient,
    ) {
        this.currentGranulariteCarte = EGranulariteCarte.PAYS;
        this.allMapviewType = [EGranulariteCarte.PAYS, EGranulariteCarte.REGION, EGranulariteCarte.DEPARTEMENT];
        this.isOpenSidebar = true;
        this.widthSidebar = OLD_WIDTH_SIDEBAR;
        this.uniqueDate = true;
        this.listTypeGraph = [
            EGraphType.ACTIVE,
            EGraphType.CONFIRMED,
            EGraphType.DEATH,
            EGraphType.HOSPITALIZED,
            EGraphType.REANIMATED,
            EGraphType.RECOVERED
        ];
        this.selectedPlotType = EPlotType.BAR;
        this.listPlotType = [EPlotType.BAR, EPlotType.SCATTER];
        this.allGraphics = [];
        this.nbEntree = 0;
        this.allData = [];
        this.minDate = new Date('01-02-2020');
        this.maxDate = new Date('01-02-2020');
        const tmpselectedDateMin = new Date(LAST_DATE);
        tmpselectedDateMin.setDate(tmpselectedDateMin.getDate() - 1);
        this.selectedDateMin = tmpselectedDateMin;
        this.selectedDateMax = new Date(LAST_DATE);
        this.currentDate = LAST_DATE;
        this.uniqueGraphique = true;
        this.selectedSpecificGraphicsList = [];

        this.allBarSubmob = [EBarMode.GROUP, EBarMode.STACK];
        this.selectedBarSubmod = EBarMode.GROUP;
        this.allScatterSubmod = [EScatterMode.LINES, EScatterMode.MARKERS];
        this.selectedScatterSubmod = 'lines';

        this.selectedGap = 0.1;
        this.selectedGapGroup = 0.1;




        this.initializeGlobalGraphics();
        this.loadData();
    }

    public updateBarGap(newValue: number, typeBar: string) {
        switch (typeBar) {
            case 'gap': {
                this.selectedGap = newValue;
                this.allGraphics.forEach((currentGraphic) => {
                    currentGraphic.layout.bargap = this.selectedGap;
                });
                console.log('bar ' + this.selectedGap)
                break;
            }
            case 'gapGroup': {
                this.selectedGapGroup = newValue;
                this.allGraphics.forEach((currentGraphic) => {
                    currentGraphic.layout.bargroupgap = this.selectedGapGroup;
                });
                console.log('barGroup ' + this.selectedGapGroup)

                break;
            }
        }
    }

    public updateGraphicType(newType: EPlotType): void {
        this.selectedPlotType = newType;
        this.allGraphics.forEach((currentGraphic) => {
            currentGraphic.data.forEach((currentData) => {
                currentData.type = this.selectedPlotType.toLowerCase();
            });
        });
    }

    public updateBarSubmod(newVal: EBarMode): void {
        this.selectedBarSubmod = newVal;
        this.allGraphics.forEach((currentGraphic: IGraphicDefinition) => {
            currentGraphic.layout.barmode = this.selectedBarSubmod.toLowerCase();
        });
    }

    public updateScatterSubmod(newVal: EScatterMode[]): void {
        this.selectedScatterSubmod = '';
        let index = 1;
        newVal.forEach((submod: EScatterMode) => {
            this.selectedScatterSubmod += submod.toLowerCase();
            if (index < newVal.length) {
                this.selectedScatterSubmod += '+';
            }
            index++;
        });


        this.allGraphics.forEach((currentGraphic) => {
            currentGraphic.data.forEach((data) => {
                data.mode = 'lines';
            });
        });
    }

    public updateNumberOfGraphique(arrayGraphiqueActive: EGraphType[]) {
        this.selectedSpecificGraphicsList = arrayGraphiqueActive;
        this.redrawSpecificGraphicsList();
    }



    public redrawSpecificGraphicsList() {
        this.deleteAllGraphics();
        this.selectedSpecificGraphicsList.forEach((currentGraph) => {
            const completeGraphName = 'Graphique ' + currentGraph;
            this.addGraphics(completeGraphName, [], [], currentGraph);
        });
        UPDATE_PLOTLY_VIEW();
        this.updateFiltredData();
    }

    public initializeGlobalGraphics() {
        this.deleteAllGraphics();
        this.addGraphics('Graphique Global', [], [], EGraphType.GLOBAL);
        UPDATE_PLOTLY_VIEW();
    }

    public addGraphics(graphicName: string, xData: number[], yData: number[], graphicType) {
        const  dataToPush: IGaphicDataDefinition[] = [];
        dataToPush.push({
            x: xData,
            y: yData,
            type: this.selectedPlotType,
            mode: 'lines'
        });
        const toPush: IGraphicDefinition = {
            data: dataToPush,
            config: {
                responsive: true
            },
            layout: {
                title: graphicName,
                autosize: true,
                bargap: this.selectedGap,
                bargroupgap: this.selectedGapGroup,
                barmode: this.selectedBarSubmod.toLowerCase()

            },
            typeGraphic: graphicType
        };
        this.allGraphics.push(toPush);
    }

    public onResizeEnd(event: ResizeEvent): void {
        OLD_WIDTH_SIDEBAR = event.rectangle.width;
        this.widthSidebar = event.rectangle.width;
        UPDATE_PLOTLY_VIEW();
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

    public updateDateContener(newVal: boolean): void {
        this.uniqueDate = newVal;
        this.updateFiltredData();

    }

    public updateGraphiqueContener(newVal: boolean): void {
        this.uniqueGraphique = newVal;
        if (this.uniqueGraphique) {
            this.initializeGlobalGraphics();
            this.updateFiltredData();

        } else {
            if (this.selectedSpecificGraphicsList.length) {
                this.redrawSpecificGraphicsList();
            } else {
                this.deleteAllGraphics();
            }
        }
        this.updateFiltredData();

    }
    public updateDateCurrentMin(newVal: Date): void {
        this.selectedDateMin = newVal;
        this.updateFiltredData();
    }
    public updateDateCurrentMax(newVal: Date): void {
        this.selectedDateMax = newVal;
        this.updateFiltredData();
    }


    public updateDate(newDate: Date): void {
        this.currentDate = newDate;
        this.updateFiltredData();
    }


    public updateFiltredData(): void {
        this.cleanAllDataGraph();
        let tmpDefaultDisplay;
        switch (this.currentGranulariteCarte) {
            case EGranulariteCarte.PAYS : {
                tmpDefaultDisplay = DEFAULT_COUNTRY;
                break;
            }
            case EGranulariteCarte.REGION : {
                tmpDefaultDisplay = DEFAULT_REGION;
                break;
            }
            case EGranulariteCarte.DEPARTEMENT : {
                tmpDefaultDisplay = DEFAULT_DEPARTEMENTAL;
                break;
            }
        }

        if (this.uniqueDate) {
            this.filtredData.forEach((row: FranceRow) => {
                if (row.getCodeTypeCarte() === tmpDefaultDisplay
                    && this.isDateEqual(row.getDate(), this.currentDate)) {
                    this.addRow(row);
                }
            });
        } else {
            this.filtredData.forEach((row: FranceRow) => {
                if (row.getCodeTypeCarte() === tmpDefaultDisplay
                    && this.isDateBetween(row.getDate(), this.selectedDateMin, this.selectedDateMax)) {
                    this.addRow(row);
                }
            });
        }

        console.log(this.allGraphics)


    }

    
    private isDateBetween(dateToCompare: Date, dateMin: Date, dateMax: Date): boolean {
        if (dateToCompare.getMonth() >= dateMin.getMonth()
            && dateToCompare.getFullYear() >= dateMin.getFullYear()
            && dateToCompare.getDate() >= dateMin.getDate()
            && dateToCompare.getMonth() <= dateMax.getMonth()
            && dateToCompare.getFullYear() <= dateMax.getFullYear()
            && dateToCompare.getDate() <= dateMax.getDate()
            ) {
            return true;
        } else {
            return false;
        }
    }




    private loadData(): void {
        this.http.get(G_FRANCE_DATA_PATH, {responseType: 'text'})
        .subscribe(data => {
            this.parseXmlFile(data);
        });

    }

    private parseXmlFile(csvContent: string): void {
        const csvContentByLine = csvContent.split('\n');

        csvContentByLine.forEach((csvLine) => {
            // Verif ligne non vide, inséré par Pandas
            if (csvLine.length && csvLine !== '') {
                const currentLine = csvLine.split(',');
                if (this.nbEntree === 0) {
    
                } else {
                    this.allData.push(new FranceRow(
                        new Date(currentLine[0]),
                        EGranulariteCarte[currentLine[1].toUpperCase()],
                        currentLine[2],
                        currentLine[3],
                        Number(currentLine[4]),
                        Number(currentLine[5]),
                        Number(currentLine[6]),
                        Number(currentLine[7]),
                        Number(currentLine[8]),
                        Number(currentLine[9]),
                        Number(currentLine[10]),
                        Number(currentLine[11])
                    ));
                    if (new Date(currentLine[0]).getTime() > this.maxDate.getTime()) {
                        this.maxDate = new Date(currentLine[0]);
                    }
                    if (new Date(currentLine[0]).getTime() < this.minDate.getTime()) {
                        this.minDate = new Date(currentLine[0]);
                    }
                }
    
                this.nbEntree++;
            }
            
        });

        this.filtredData = clonedeep(this.allData);
        this.updateFiltredData();

    }

    private addRow(row: FranceRow): void {
        const completeDate = row.getDate().getDate() + '-' + row.getDate().getMonth() + '-' + row.getDate().getFullYear();
        console.log(row)
        this.allGraphics.forEach((currentGraphics) => {
            let hideLegendfAlreadyExist: boolean;
            if (currentGraphics.data.length > 0) {
                hideLegendfAlreadyExist = false;
            } else {
                hideLegendfAlreadyExist = true;
            }

            switch (currentGraphics.typeGraphic) {
                case EGraphType.GLOBAL: {
                    if (currentGraphics.data.length === 0) {
                        currentGraphics.data.push({
                            x: [completeDate],
                            y: [row.getDeces()],
                            type: this.selectedPlotType.toLowerCase(),
                            name: ELegend.DEATH,
                            marker : {
                                color: 'red'
                            },
                            legendgroup: 'Décés',
                            showlegend: hideLegendfAlreadyExist,
                            mode: this.selectedScatterSubmod
                        });
                        currentGraphics.data.push({
                            x: [completeDate],
                            y: [row.getCasConfirme()],
                            type: this.selectedPlotType.toLowerCase(),
                            name: ELegend.CONFIRMED,
                            marker : {
                                color: 'grey'
                            },
                            legendgroup: 'Confirmés',
                            showlegend: hideLegendfAlreadyExist,
                            mode: this.selectedScatterSubmod
                        });
                        currentGraphics.data.push({
                            x: [completeDate],
                            y: [row.getReanimation()],
                            type: this.selectedPlotType.toLowerCase(),
                            name: ELegend.REANIMATED,
                            marker : {
                                color: 'orange'
                            },
                            legendgroup: 'Réanimés',
                            showlegend: hideLegendfAlreadyExist,
                            mode: this.selectedScatterSubmod
                        });
                        currentGraphics.data.push({
                            x: [completeDate],
                            y: [row.getHospitalise()],
                            type: this.selectedPlotType.toLowerCase(),
                            name: ELegend.HOSPITALIZED,
                            marker : {
                                color: 'yellow'
                            },
                            legendgroup: 'Hospitalisés',
                            showlegend: hideLegendfAlreadyExist,
                            mode: this.selectedScatterSubmod
                        });
                        currentGraphics.data.push({
                            x: [completeDate],
                            y: [row.getGueris()],
                            type: this.selectedPlotType.toLowerCase(),
                            name: ELegend.RECOVERED,
                            marker : {
                                color: 'green'
                            },
                            legendgroup: 'Guérris',
                            showlegend: hideLegendfAlreadyExist,
                            mode: this.selectedScatterSubmod
                        });
                        currentGraphics.data.push({
                            x: [completeDate],
                            y: [row.getActif()],
                            type: this.selectedPlotType.toLowerCase(),
                            name: ELegend.ACTIVE,
                            marker : {
                                color: 'blue'
                            },
                            legendgroup: 'Actifs',
                            showlegend: hideLegendfAlreadyExist,
                            mode: this.selectedScatterSubmod
                        });
                    } else {
                        currentGraphics.data.forEach((currentData: IGaphicDataDefinition) => {
                            switch (currentData.name) {
                                case ELegend.ACTIVE: {
                                    currentData.x.push(completeDate);
                                    currentData.y.push(row.getActif());
                                    break;
                                }
                                case ELegend.DEATH: {
                                    currentData.x.push(completeDate);
                                    currentData.y.push(row.getDeces());
                                    break;
                                }
                                case ELegend.REANIMATED: {
                                    currentData.x.push(completeDate);
                                    currentData.y.push(row.getReanimation());
                                    break;
                                }
                                case ELegend.RECOVERED: {
                                    currentData.x.push(completeDate);
                                    currentData.y.push(row.getGueris());
                                    break;
                                }
                                case ELegend.HOSPITALIZED: {
                                    currentData.x.push(completeDate);
                                    currentData.y.push(row.getHospitalise());
                                    break;
                                }
                                case ELegend.CONFIRMED: {
                                    currentData.x.push(completeDate);
                                    currentData.y.push(row.getCasConfirme());
                                    break;
                                }
                            }
                        });
                    }






                break;
            }

                case EGraphType.ACTIVE: {
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getActif()],
                        name: ELegend.ACTIVE,
                        type: this.selectedPlotType.toLowerCase(),
                        marker : {
                            color: 'blue'
                        },
                        legendgroup: 'Actifs',
                        showlegend: hideLegendfAlreadyExist,
                        mode: this.selectedScatterSubmod
                    });
                    break;
                }
                case EGraphType.CONFIRMED: {
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getCasConfirme()],
                        name: ELegend.CONFIRMED,
                        type: this.selectedPlotType.toLowerCase(),
                        marker : {
                            color: 'grey'
                        },
                        legendgroup: 'Confirmés',
                        showlegend: hideLegendfAlreadyExist,
                        mode: this.selectedScatterSubmod
                    });
                    break;
                }
                case EGraphType.DEATH: {
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getDeces()],
                        type: this.selectedPlotType.toLowerCase(),
                        name: ELegend.DEATH,
                        marker : {
                            color: 'red'
                        },
                        legendgroup: 'Décés',
                        showlegend: hideLegendfAlreadyExist,
                        mode: this.selectedScatterSubmod
                    });
                    break;
                }
                case EGraphType.HOSPITALIZED: {
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getHospitalise()],
                        name: ELegend.HOSPITALIZED,
                        type: this.selectedPlotType.toLowerCase(),
                        marker : {
                            color: 'yellow'
                        },
                        legendgroup: 'Hospitalisés',
                        showlegend: hideLegendfAlreadyExist,
                        mode: this.selectedScatterSubmod
                    });
                    break;
                }
                case EGraphType.REANIMATED: {
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getReanimation()],
                        name: ELegend.REANIMATED,
                        type: this.selectedPlotType.toLowerCase(),
                        marker : {
                            color: 'orange'
                        },
                        legendgroup: 'Réanimés',
                        showlegend: hideLegendfAlreadyExist,
                        mode: this.selectedScatterSubmod
                    });
                    break;
                }
                case EGraphType.RECOVERED: {
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getGueris()],
                        name: ELegend.RECOVERED,
                        type: this.selectedPlotType.toLowerCase(),
                        marker : {
                            color: 'green'
                        },
                        legendgroup: 'Guérris',
                        showlegend: hideLegendfAlreadyExist,
                        mode: this.selectedScatterSubmod
                    });
                    break;
                }

            }
        });

    }

    public toggleSidebar(): void {
        this.isOpenSidebar = !this.isOpenSidebar;
        if (this.isOpenSidebar) {
            this.widthSidebar = OLD_WIDTH_SIDEBAR;
        } else {
            this.widthSidebar = 30;
        }
        UPDATE_PLOTLY_VIEW();

    }


    private isDateEqual(date1: Date, date2: Date): boolean {
        if (date1.getMonth() === date2.getMonth()
            && date1.getFullYear() === date2.getFullYear()
            && date1.getDate() === date2.getDate()) {
            return true;
        } else {
            return false;
        }
    }
 

    private cleanAllDataGraph(): void {
        this.allGraphics.forEach((graphics) => {
            graphics.data = [];
        });
    }

    private deleteAllGraphics(): void {
        this.allGraphics = [];
    }



    

    ngOnInit(): void {
    }
}
