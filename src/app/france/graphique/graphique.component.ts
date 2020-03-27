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
    public currentDateMin: Date;
    public currentDateMax: Date;

    public uniqueDate: boolean;

    public uniqueGraphique: boolean;
    public listTypeGraph: EGraphType[];
    public selectedListTypeGraph: FormControl;
    
    public allGraphics: IGraphicDefinition[];
    public selectedSpecificGraphicsList: EGraphType[];

    public currentPlotType: EPlotType;
    public listPlotType: EPlotType[];

    public aliasPlotType = EPlotType;

    public allBarSubmob: EBarMode[];
    public selectedBarSubmod: EBarMode;
    public allScatterSubmod: EScatterMode[];

    public globalGraph = {
        data: [],
        layout: {
            title: 'Graphique global',
            autosize: true,
        },
        config: {
            responsive: true
        }
    };

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
        this.currentPlotType = EPlotType.BAR;
        this.listPlotType = [EPlotType.BAR, EPlotType.SCATTER];
        this.selectedListTypeGraph = new FormControl();
        this.allGraphics = [];
        this.nbEntree = 0;
        this.allData = [];
        this.minDate = new Date('01-02-2020');
        this.maxDate = new Date('01-02-2020');
        const tmpCurrentDateMin = new Date(LAST_DATE);
        tmpCurrentDateMin.setDate(tmpCurrentDateMin.getDate() - 1);
        this.currentDateMin = tmpCurrentDateMin;
        this.currentDateMax = new Date(LAST_DATE);
        this.currentDate = LAST_DATE;
        this.uniqueGraphique = true;
        this.selectedSpecificGraphicsList = [];

        this.allBarSubmob = [EBarMode.GROUP, EBarMode.STACK];
        this.selectedBarSubmod = EBarMode.GROUP;
        this.allScatterSubmod = [EScatterMode.LINES, EScatterMode.POINTS]

        this.initializeGlobalGraphics();
        this.loadData();
    }

    public updateGraphicType(newType: EPlotType): void {
        this.currentPlotType = newType;
        this.allGraphics.forEach((currentGraphic) => {
            currentGraphic.data.forEach((currentData) => {
                currentData.type = this.currentPlotType.toLowerCase();
            });
        });
    }

    public updateBarSubmod(newVal: EBarMode): void {
        this.selectedBarSubmod = newVal;
        console.log(this.selectedBarSubmod)
        this.allGraphics.forEach((currentGraphic) => {
            currentGraphic.layout.barmode = this.selectedBarSubmod.toLowerCase();
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
            type: EPlotType.BAR,
            name: graphicName
        });
        const toPush: IGraphicDefinition = {
            data: dataToPush,
            config: {
                responsive: true
            },
            layout: {
                title: graphicName,
                autosize: true,
                bargap: 0.1,
                bargroupgap: 0.1,
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
        this.currentDateMin = newVal;
        this.updateFiltredData();
    }
    public updateDateCurrentMax(newVal: Date): void {
        this.currentDateMax = newVal;
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
                    && this.isDateBetween(row.getDate(), this.currentDateMin, this.currentDateMax)) {
                    this.addRow(row);
                }
            });
        }


        console.log(this.allGraphics);


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

        this.allGraphics.forEach((currentGraphics) => {
            let hideLegendfAlreadyExist: boolean;
            if (currentGraphics.data.length > 0) {
                hideLegendfAlreadyExist = false;
            } else {
                hideLegendfAlreadyExist = true;
            }

            switch (currentGraphics.typeGraphic) {
                case EGraphType.GLOBAL: {
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getDeces()],
                        type: this.currentPlotType.toLowerCase(),
                        name: 'Cas Décés',
                        marker : {
                            color: 'red'
                        },
                        legendgroup: 'Décés',
                        showlegend: hideLegendfAlreadyExist
                    
                    });
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getCasConfirme()],
                        type: this.currentPlotType.toLowerCase(),
                        name: 'Cas confirmés',
                        marker : {
                            color: 'grey'
                        },
                        legendgroup: 'Confirmés',
                        showlegend: hideLegendfAlreadyExist,

                    });
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getReanimation()],
                        type: this.currentPlotType.toLowerCase(),
                        name: 'Cas réanimés',
                        marker : {
                            color: 'orange'
                        },
                        legendgroup: 'Réanimés',
                        showlegend: hideLegendfAlreadyExist


                    });
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getHospitalise()],
                        type: this.currentPlotType.toLowerCase(),
                        name: 'Cas hospitalisés',
                        marker : {
                            color: 'yellow'
                        },
                        legendgroup: 'Hospitalisés',
                        showlegend: hideLegendfAlreadyExist


                    });
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getGueris()],
                        type: this.currentPlotType.toLowerCase(),
                        name: 'Cas guérris',
                        marker : {
                            color: 'green'
                        },
                        legendgroup: 'Guérris',
                        showlegend: hideLegendfAlreadyExist

                    });
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getActif()],
                        type: this.currentPlotType.toLowerCase(),
                        name: 'Cas actifs',
                        marker : {
                            color: 'blue'
                        },
                        legendgroup: 'Actifs',
                        showlegend: hideLegendfAlreadyExist
                    });

                    break;
                }

                case EGraphType.ACTIVE: {
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getActif()],
                        name: 'Cas actifs',
                        type: this.currentPlotType.toLowerCase(),
                        marker : {
                            color: 'blue'
                        },
                        legendgroup: 'Actifs',
                        showlegend: hideLegendfAlreadyExist
                    });
                    break;
                }
                case EGraphType.CONFIRMED: {
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getCasConfirme()],
                        name: 'Cas confirmés',
                        type: this.currentPlotType.toLowerCase(),
                        marker : {
                            color: 'grey'
                        },
                        legendgroup: 'Confirmés',
                        showlegend: hideLegendfAlreadyExist
                    });
                    break;
                }
                case EGraphType.DEATH: {
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getDeces()],
                        type: this.currentPlotType.toLowerCase(),
                        name: 'Cas Décés',
                        marker : {
                            color: 'red'
                        },
                        legendgroup: 'Décés',
                        showlegend: hideLegendfAlreadyExist
                    });
                    break;
                }
                case EGraphType.HOSPITALIZED: {
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getHospitalise()],
                        name: 'Cas hospitalisés',
                        type: this.currentPlotType.toLowerCase(),
                        marker : {
                            color: 'yellow'
                        },
                        legendgroup: 'Hospitalisés',
                        showlegend: hideLegendfAlreadyExist
                    });
                    break;
                }
                case EGraphType.REANIMATED: {
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getReanimation()],
                        name: 'Cas réanimés',
                        type: this.currentPlotType.toLowerCase(),
                        marker : {
                            color: 'orange'
                        },
                        legendgroup: 'Réanimés',
                        showlegend: hideLegendfAlreadyExist
                    });
                    break;
                }
                case EGraphType.RECOVERED: {
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getGueris()],
                        name: 'Cas guérris',
                        type: this.currentPlotType.toLowerCase(),
                        marker : {
                            color: 'green'
                        },
                        legendgroup: 'Guérris',
                        showlegend: hideLegendfAlreadyExist
                    });
                    break;
                }



            }
        })












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
