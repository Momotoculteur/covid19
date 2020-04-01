import { Component, OnInit } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { UPDATE_PLOTLY_VIEW, G_GLOBAL_DATA_PATH } from 'src/app/shared/constant/CGlobal';
import { EGraphType } from 'src/app/shared/enum/EGraphType';
import { EPlotType } from 'src/app/shared/enum/EPlotType';
import { EBarMode } from 'src/app/shared/enum/EBarMode';
import { EScatterMode } from 'src/app/shared/enum/EScatterMode';
import { IGraphicDefinition, IGaphicDataDefinition } from 'src/app/shared/interface/IGraphicDefinition';
import { HttpClient } from '@angular/common/http';

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

    // Date
    public minDate: Date;
    public maxDate: Date;
    public currentDate: Date;
    public selectedDateMin: Date;
    public selectedDateMax: Date;
    public uniqueDate: boolean;

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
