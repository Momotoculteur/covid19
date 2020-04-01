import { Component, OnInit } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { UPDATE_PLOTLY_VIEW, G_GLOBAL_DATA_PATH, isDateEqual, isDateBetween } from 'src/app/shared/constant/CGlobal';
import { EGraphType } from 'src/app/shared/enum/EGraphType';
import { EPlotType } from 'src/app/shared/enum/EPlotType';
import { EBarMode } from 'src/app/shared/enum/EBarMode';
import { EScatterMode } from 'src/app/shared/enum/EScatterMode';
import { IGraphicDefinition, IGaphicDataDefinition } from 'src/app/shared/interface/IGraphicDefinition';
import { HttpClient } from '@angular/common/http';
import { GlobalRow } from '../../shared/class/GlobbalRow';
import * as clonedeep from 'lodash.clonedeep';
import { ITemplateCountryDisplay } from 'src/app/shared/interface/ITemplateCountryDisplay';
import { ELegend } from 'src/app/shared/enum/ELegends';

const MIN_WIDTH_SIDEBAR = 300;
let OLD_WIDTH_SIDEBAR = 300;



@Component({
    selector: 'app-graphique',
    templateUrl: './graphique.component.html',
    styleUrls: ['./graphique.component.scss']
})
export class GraphiqueComponent implements OnInit {

    public isOpenSidebar: boolean;
    public widthSidebar: number;

    public allData: GlobalRow[];
    public filtredData: GlobalRow[];

    public allCountry: ITemplateCountryDisplay[];


    // Date
    public minDate: Date;
    public maxDate: Date;
    public currentDate: Date;
    public selectedDateMin: Date;
    public selectedDateMax: Date;
    public uniqueDate: boolean;

    public selectedUniqueCountry: ITemplateCountryDisplay;
    public selectedMultipleCountry: ITemplateCountryDisplay[];

    public listTypeGraph: EGraphType[];
    public aliasPlotType = EPlotType;

    public allBarSubmob: EBarMode[];
    public selectedBarSubmod: EBarMode;

    public allScatterSubmod: EScatterMode[];
    public selectedScatterSubmod: string;

    public selectedGap: number;
    public selectedGapGroup: number;

    public uniqueGraphique: boolean;
    public selectedSpecificGraphicsList: EGraphType[];

    public selectedPlotType: EPlotType;
    public listPlotType: EPlotType[];

    public allGraphics: IGraphicDefinition[];

    constructor(
        private http: HttpClient,
    ) {
        this.allData = [];
        this.allCountry = [];
        this.isOpenSidebar = true;
        this.widthSidebar = OLD_WIDTH_SIDEBAR;
        this.uniqueDate = true;
        this.uniqueGraphique = true;
        this.selectedSpecificGraphicsList = [];
        this.allBarSubmob = [EBarMode.GROUP, EBarMode.STACK];
        this.selectedBarSubmod = EBarMode.GROUP;
        this.selectedScatterSubmod = '';
        this.selectedGap = 0.1;
        this.selectedGapGroup = 0.1;
        this.allScatterSubmod = [EScatterMode.LINES, EScatterMode.MARKERS];
        this.listTypeGraph = [
            EGraphType.ACTIVE,
            EGraphType.CONFIRMED,
            EGraphType.DEATH,
            EGraphType.RECOVERED,
            EGraphType.RECOVERY_RATE,
            EGraphType.MORTALITY_RATE
        ];
        this.selectedPlotType = EPlotType.BAR;
        this.listPlotType = [EPlotType.BAR, EPlotType.SCATTER];
        this.allGraphics = [];




        this.initializeGlobalGraphics();
        this.loadData();


    }

    private loadData(): void {
        this.http.get(G_GLOBAL_DATA_PATH, { responseType: 'text' })
            .subscribe(data => {
                this.parseXmlFile(data);
            });

    }

    private parseXmlFile(csvContent: string): void {
        const csvContentByLine = csvContent.split('\n');
        let nbEntree = 0;

        csvContentByLine.forEach((csvLine) => {
            // Verif ligne non vide, inséré par Pandas
            if (csvLine.length && csvLine !== '') {
                const currentLine = csvLine.split(',');
                if (nbEntree === 0) {

                } else {
                    this.allData.push(new GlobalRow(
                        new Date(currentLine[0]),
                        currentLine[1],
                        currentLine[2],
                        Number(currentLine[3]),
                        Number(currentLine[4]),
                        Number(currentLine[5]),
                        Number(currentLine[6]),
                        Number(currentLine[7]),
                        Number(currentLine[8])
                    ));

                    if (this.maxDate === undefined) {
                        this.maxDate = new Date(currentLine[0]);
                    }
                    if (this.minDate === undefined) {
                        this.minDate = new Date(currentLine[0]);
                    }

                    if (new Date(currentLine[0]).getTime() > this.maxDate.getTime()) {
                        this.maxDate = new Date(currentLine[0]);
                    }
                    if (new Date(currentLine[0]).getTime() < this.minDate.getTime()) {
                        this.minDate = new Date(currentLine[0]);
                    }

                    const alreadyExist = this.allCountry.find((cur) => cur.country === String(currentLine[2]) && cur.region === String(currentLine[1]));
                    if (!(alreadyExist)) {
                        this.allCountry.push({
                            region: String(currentLine[1]),
                            country: String(currentLine[2])
                        });
                    }
                }
                nbEntree++;
            }
        });
        this.selectedDateMax = new Date(this.maxDate);
        const tmpselectedDateMin = new Date(this.selectedDateMax);
        tmpselectedDateMin.setDate(tmpselectedDateMin.getDate() - 1);
        this.selectedDateMin = tmpselectedDateMin;
        this.currentDate = new Date(this.maxDate);

        this.filtredData = clonedeep(this.allData);

        this.selectedUniqueCountry = this.allCountry[0];
        this.selectedMultipleCountry = [this.allCountry[0]];

        this.updateFiltredData();

    }

    public onResizeEnd(event: ResizeEvent): void {
        OLD_WIDTH_SIDEBAR = event.rectangle.width;
        this.widthSidebar = event.rectangle.width;
        UPDATE_PLOTLY_VIEW();
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

    public updateBarSubmod(newVal: EBarMode): void {
        this.selectedBarSubmod = newVal;
        this.allGraphics.forEach((currentGraphic: IGraphicDefinition) => {
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

    public addGraphics(graphicName: string, xData: number[], yData: number[], graphicType) {
        const dataToPush: IGaphicDataDefinition[] = [];
        dataToPush.push({
            x: xData,
            y: yData,
            type: this.selectedPlotType,
            mode: this.selectedScatterSubmod
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

    public updateDateContener(newVal: boolean): void {
        this.uniqueDate = newVal;
        this.updateFiltredData();

    }

    public initializeGlobalGraphics() {
        this.deleteAllGraphics();
        this.addGraphics('Graphique Global', [], [], EGraphType.GLOBAL);
        UPDATE_PLOTLY_VIEW();
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

    public updateFiltredData(): void {

        this.cleanAllDataGraph();
        if (this.uniqueDate) {
            if (this.uniqueGraphique) {
                this.filtredData.forEach((row: GlobalRow) => {
                    if (this.selectedUniqueCountry.country === row.getCountry()
                        && this.selectedUniqueCountry.region === row.getRegion()
                        && isDateEqual(row.getDate(), this.currentDate)) {
                        this.addRow(row);
                    }
                });
            } else {
                this.filtredData.forEach((row: GlobalRow) => {
                    this.selectedMultipleCountry.forEach((currentSelectedCountry: ITemplateCountryDisplay) => {
                        if (currentSelectedCountry.region === row.getRegion()
                            && currentSelectedCountry.country === row.getCountry()
                            && isDateEqual(row.getDate(), this.currentDate)) {
                            this.addRowMultipleDate(row);
                        }
                    });
                });
            }

        } else {
            if (this.uniqueGraphique) {
                this.filtredData.forEach((row: GlobalRow) => {
                    if (this.selectedUniqueCountry.region === row.getRegion()
                        && this.selectedUniqueCountry.country === row.getCountry()
                        && isDateBetween(row.getDate(), this.selectedDateMin, this.selectedDateMax)) {
                        this.addRow(row);

                    }
                });
            } else {
                this.filtredData.forEach((row: GlobalRow) => {
                    this.selectedMultipleCountry.forEach((currentSelectedCountry: ITemplateCountryDisplay) => {
                        if (currentSelectedCountry.region === row.getRegion()
                            && currentSelectedCountry.country === row.getCountry()
                            && isDateBetween(row.getDate(), this.selectedDateMin, this.selectedDateMax)) {
                            this.addRowMultipleDate(row);
                        }
                    });
                });
            }
        }


    }


    private addRowMultipleDate(row: GlobalRow): void {
        const completeDate = row.getDate().getDate() + '-' + row.getDate().getMonth() + '-' + row.getDate().getFullYear();

        this.allGraphics.forEach((currentGrap: IGraphicDefinition) => {
            let hideLegendfAlreadyExist: boolean;
            if (currentGrap.data.length > 0) {
                hideLegendfAlreadyExist = false;
            } else {
                hideLegendfAlreadyExist = true;
            }

            let fullNameCountryLegend = row.getCountry();
            if (row.getRegion() !== '') {
                fullNameCountryLegend += ' - ' + row.getRegion();
            }

            switch (currentGrap.typeGraphic) {
                case EGraphType.ACTIVE: {
                if (currentGrap.data.length === 0) {
                    currentGrap.data.push({
                        x: [completeDate],
                        y: [row.getActive()],
                        name: fullNameCountryLegend,
                        type: this.selectedPlotType.toLowerCase(),
                        legendgroup: fullNameCountryLegend,
                        showlegend: true,
                        mode: this.selectedScatterSubmod
                    });
                } else {
                    let alreadyExist = false;
                    currentGrap.data.forEach((currentData: IGaphicDataDefinition) => {
                        if (currentData.name === fullNameCountryLegend && !alreadyExist) {
                            alreadyExist = true;
                            currentData.x.push(completeDate);
                            currentData.y.push(row.getActive());
                        }
                    });
                    if (!alreadyExist) {
                        currentGrap.data.push({
                            x: [completeDate],
                            y: [row.getActive()],
                            name: fullNameCountryLegend,
                            type: this.selectedPlotType.toLowerCase(),
                            legendgroup: fullNameCountryLegend,
                            showlegend: true,
                            mode: this.selectedScatterSubmod
                        });
                    }
                }
                break;
            }
                case EGraphType.CONFIRMED: {
                if (currentGrap.data.length === 0) {
                    currentGrap.data.push({
                        x: [completeDate],
                        y: [row.getConfirmed()],
                        name: fullNameCountryLegend,
                        type: this.selectedPlotType.toLowerCase(),
                        legendgroup: fullNameCountryLegend,
                        showlegend: true,
                        mode: this.selectedScatterSubmod
                    });
                } else {
                    let alreadyExist = false;
                    currentGrap.data.forEach((currentData: IGaphicDataDefinition) => {
                        if (currentData.name === fullNameCountryLegend && !alreadyExist) {
                            alreadyExist = true;
                            currentData.x.push(completeDate);
                            currentData.y.push(row.getConfirmed());
                        }
                    });
                    if (!alreadyExist) {
                        currentGrap.data.push({
                            x: [completeDate],
                            y: [row.getConfirmed()],
                            name: fullNameCountryLegend,
                            type: this.selectedPlotType.toLowerCase(),
                            legendgroup: fullNameCountryLegend,
                            showlegend: true,
                            mode: this.selectedScatterSubmod
                        });
                    }
                }
                break;
            }
                case EGraphType.DEATH: {
                if (currentGrap.data.length === 0) {
                    currentGrap.data.push({
                        x: [completeDate],
                        y: [row.getDeath()],
                        name: fullNameCountryLegend,
                        type: this.selectedPlotType.toLowerCase(),
                        legendgroup: fullNameCountryLegend,
                        showlegend: true,
                        mode: this.selectedScatterSubmod
                    });
                } else {
                    let alreadyExist = false;
                    currentGrap.data.forEach((currentData: IGaphicDataDefinition) => {
                        if (currentData.name === fullNameCountryLegend && !alreadyExist) {
                            alreadyExist = true;
                            currentData.x.push(completeDate);
                            currentData.y.push(row.getDeath());
                        }
                    });
                    if (!alreadyExist) {
                        currentGrap.data.push({
                            x: [completeDate],
                            y: [row.getDeath()],
                            name: fullNameCountryLegend,
                            type: this.selectedPlotType.toLowerCase(),
                            legendgroup: fullNameCountryLegend,
                            showlegend: true,
                            mode: this.selectedScatterSubmod
                        });
                    }
                }
                break;
            }
                case EGraphType.RECOVERED: {
                if (currentGrap.data.length === 0) {
                    currentGrap.data.push({
                        x: [completeDate],
                        y: [row.getRecovered()],
                        name: fullNameCountryLegend,
                        type: this.selectedPlotType.toLowerCase(),
                        legendgroup: fullNameCountryLegend,
                        showlegend: true,
                        mode: this.selectedScatterSubmod
                    });
                } else {
                    let alreadyExist = false;
                    currentGrap.data.forEach((currentData: IGaphicDataDefinition) => {
                        if (currentData.name === fullNameCountryLegend && !alreadyExist) {
                            alreadyExist = true;
                            currentData.x.push(completeDate);
                            currentData.y.push(row.getRecovered());
                        }
                    });
                    if (!alreadyExist) {
                        currentGrap.data.push({
                            x: [completeDate],
                            y: [row.getRecovered()],
                            name: fullNameCountryLegend,
                            type: this.selectedPlotType.toLowerCase(),
                            legendgroup: fullNameCountryLegend,
                            showlegend: true,
                            mode: this.selectedScatterSubmod
                        });
                    }
                }
                break;
            }
                case EGraphType.MORTALITY_RATE: {
                if (currentGrap.data.length === 0) {
                    currentGrap.data.push({
                        x: [completeDate],
                        y: [row.getMortalityRate()],
                        name: fullNameCountryLegend,
                        type: this.selectedPlotType.toLowerCase(),
                        legendgroup: fullNameCountryLegend,
                        showlegend: true,
                        mode: this.selectedScatterSubmod
                    });
                } else {
                    let alreadyExist = false;
                    currentGrap.data.forEach((currentData: IGaphicDataDefinition) => {
                        if (currentData.name === fullNameCountryLegend && !alreadyExist) {
                            alreadyExist = true;
                            currentData.x.push(completeDate);
                            currentData.y.push(row.getMortalityRate());
                        }
                    });
                    if (!alreadyExist) {
                        currentGrap.data.push({
                            x: [completeDate],
                            y: [row.getMortalityRate()],
                            name: fullNameCountryLegend,
                            type: this.selectedPlotType.toLowerCase(),
                            legendgroup: fullNameCountryLegend,
                            showlegend: true,
                            mode: this.selectedScatterSubmod
                        });
                    }
                }
                break;
            }
                case EGraphType.RECOVERY_RATE: {
                if (currentGrap.data.length === 0) {
                    currentGrap.data.push({
                        x: [completeDate],
                        y: [row.getRecoveryRate()],
                        name: fullNameCountryLegend,
                        type: this.selectedPlotType.toLowerCase(),
                        legendgroup: fullNameCountryLegend,
                        showlegend: true,
                        mode: this.selectedScatterSubmod
                    });
                } else {
                    let alreadyExist = false;
                    currentGrap.data.forEach((currentData: IGaphicDataDefinition) => {
                        if (currentData.name === fullNameCountryLegend && !alreadyExist) {
                            alreadyExist = true;
                            currentData.x.push(completeDate);
                            currentData.y.push(row.getRecoveryRate());
                        }
                    });
                    if (!alreadyExist) {
                        currentGrap.data.push({
                            x: [completeDate],
                            y: [row.getRecoveryRate()],
                            name: fullNameCountryLegend,
                            type: this.selectedPlotType.toLowerCase(),
                            legendgroup: fullNameCountryLegend,
                            showlegend: true,
                            mode: this.selectedScatterSubmod
                        });
                    }
                }
                break;
            }
        }
        });
}

    private addRow(row: GlobalRow): void {
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
                if (currentGraphics.data.length === 0) {
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getDeath()],
                        type: this.selectedPlotType.toLowerCase(),
                        name: ELegend.DEATH,
                        marker: {
                            color: 'red'
                        },
                        legendgroup: 'Décés',
                        showlegend: hideLegendfAlreadyExist,
                        mode: this.selectedScatterSubmod
                    });
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getConfirmed()],
                        type: this.selectedPlotType.toLowerCase(),
                        name: ELegend.CONFIRMED,
                        marker: {
                            color: 'grey'
                        },
                        legendgroup: 'Confirmés',
                        showlegend: hideLegendfAlreadyExist,
                        mode: this.selectedScatterSubmod
                    });
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getRecovered()],
                        type: this.selectedPlotType.toLowerCase(),
                        name: ELegend.RECOVERED,
                        marker: {
                            color: 'green'
                        },
                        legendgroup: 'Guérris',
                        showlegend: hideLegendfAlreadyExist,
                        mode: this.selectedScatterSubmod
                    });
                    currentGraphics.data.push({
                        x: [completeDate],
                        y: [row.getActive()],
                        type: this.selectedPlotType.toLowerCase(),
                        name: ELegend.ACTIVE,
                        marker: {
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
                                currentData.y.push(row.getActive());
                                break;
                            }
                            case ELegend.DEATH: {
                                currentData.x.push(completeDate);
                                currentData.y.push(row.getDeath());
                                break;
                            }
                            case ELegend.RECOVERED: {
                                currentData.x.push(completeDate);
                                currentData.y.push(row.getRecovered());
                                break;
                            }
                            case ELegend.CONFIRMED: {
                                currentData.x.push(completeDate);
                                currentData.y.push(row.getConfirmed());
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
                    y: [row.getActive()],
                    name: ELegend.ACTIVE,
                    type: this.selectedPlotType.toLowerCase(),
                    marker: {
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
                    y: [row.getConfirmed()],
                    name: ELegend.CONFIRMED,
                    type: this.selectedPlotType.toLowerCase(),
                    marker: {
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
                    y: [row.getDeath()],
                    type: this.selectedPlotType.toLowerCase(),
                    name: ELegend.DEATH,
                    marker: {
                        color: 'red'
                    },
                    legendgroup: 'Décés',
                    showlegend: hideLegendfAlreadyExist,
                    mode: this.selectedScatterSubmod
                });
                break;
            }
            case EGraphType.RECOVERED: {
                currentGraphics.data.push({
                    x: [completeDate],
                    y: [row.getRecovered()],
                    name: ELegend.RECOVERED,
                    type: this.selectedPlotType.toLowerCase(),
                    marker: {
                        color: 'green'
                    },
                    legendgroup: 'Guérris',
                    showlegend: hideLegendfAlreadyExist,
                    mode: this.selectedScatterSubmod
                });
                break;
            }
            case EGraphType.MORTALITY_RATE: {
                currentGraphics.data.push({
                    x: [completeDate],
                    y: [row.getMortalityRate()],
                    name: ELegend.RECOVERED,
                    type: this.selectedPlotType.toLowerCase(),
                    marker: {
                        color: 'purple'
                    },
                    legendgroup: 'Taux de mortalité',
                    showlegend: hideLegendfAlreadyExist,
                    mode: this.selectedScatterSubmod
                });
                break;
            }
            case EGraphType.RECOVERY_RATE: {
                currentGraphics.data.push({
                    x: [completeDate],
                    y: [row.getRecoveryRate()],
                    name: ELegend.RECOVERED,
                    type: this.selectedPlotType.toLowerCase(),
                    marker: {
                        color: 'pink'
                    },
                    legendgroup: 'Taux de soignés',
                    showlegend: hideLegendfAlreadyExist,
                    mode: this.selectedScatterSubmod
                });
                break;
            }

        }
    });

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


    private cleanAllDataGraph(): void {
    this.allGraphics.forEach((graphics) => {
        graphics.data = [];
    });
}

    private deleteAllGraphics(): void {
    this.allGraphics = [];
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
            data.mode = this.selectedScatterSubmod;
        });
    });
}

    public updateGraphicType(newType: EPlotType): void {
    this.selectedPlotType = newType;
    this.allGraphics.forEach((currentGraphic) => {
        currentGraphic.data.forEach((currentData) => {
            currentData.type = this.selectedPlotType.toLowerCase();
        });
    });
}

    public updateBarGap(newValue: number, typeBar: string) {
    switch (typeBar) {
        case 'gap': {
            this.selectedGap = newValue;
            this.allGraphics.forEach((currentGraphic) => {
                currentGraphic.layout.bargap = this.selectedGap;
            });
            break;
        }
        case 'gapGroup': {
            this.selectedGapGroup = newValue;
            this.allGraphics.forEach((currentGraphic) => {
                currentGraphic.layout.bargroupgap = this.selectedGapGroup;
            });
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

ngOnInit(): void {
}

}
