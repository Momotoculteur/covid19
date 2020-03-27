import { Component, OnInit } from '@angular/core';
import { EGranulariteCarte } from '../../shared/enum/EGranulariteCarte';
import { HttpClient } from '@angular/common/http';
import { FranceRow } from 'src/app/shared/class/FranceRow';
import { G_FRANCE_DATA_PATH, UPDATE_PLOTLY_VIEW, LAST_DATE } from 'src/app/shared/constant/CGlobal';

import * as clonedeep from 'lodash.clonedeep';
import { ResizeEvent } from 'angular-resizable-element';

const MIN_WIDTH_SIDEBAR = 200;
let OLD_WIDTH_SIDEBAR = 200;

const DEFAULT_COUNTRY = 'FRA';
const DEFAULT_REGION = 'REG-75';
const DEFAULT_DEPARTEMENTAL = 'DEP-33';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {



    public allData: FranceRow[];
    public filtredData: FranceRow[];

    public nbEntree: number;

    public isDisplayed_graphDeath: boolean;
    public isDisplayed_graphRecovered: boolean;
    public isDisplayed_graphActive: boolean;
    public isDisplayed_graphConfirmed: boolean;
    public isDisplayed_graphHospitalized: boolean;
    public isDisplayed_graphReanimated: boolean;

    public currentGranulariteCarte: EGranulariteCarte;
    public allMapviewType: EGranulariteCarte[];
    public isOpenSidebar: boolean;
    public widthSidebar: number;

    public minDate: Date;
    public maxDate: Date;
    public currentDate: Date;

    

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
        private http: HttpClient
    ) {
        
        this.currentGranulariteCarte = EGranulariteCarte.PAYS;
        this.allMapviewType = [EGranulariteCarte.PAYS, EGranulariteCarte.REGION, EGranulariteCarte.DEPARTEMENT];
        this.isOpenSidebar = true;
        this.widthSidebar = OLD_WIDTH_SIDEBAR;
        

        this.nbEntree = 0;
        this.allData = [];
        this.minDate = new Date('01-02-2020');
        this.maxDate = new Date('01-02-2020');
        this.currentDate = LAST_DATE;

        this.loadData();
    }

    public onResizeEnd(event: ResizeEvent): void {
        console.log(event.rectangle.width)
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

    public refreshGraph(): void {
        this.updateFiltredData();
    }

    public updateDate(newDate: Date): void {
        console.log(newDate)
        this.currentDate = newDate;
        this.refreshGraph();
    }


    public updateFiltredData(): void {
        /*
        this.filtredData = this.allData.filter(currentData =>
            currentData.getDate().getDate() === LAST_DATE.getDate()
            && currentData.getDate().getMonth() === LAST_DATE.getMonth()
            && currentData.getDate().getFullYear() === LAST_DATE.getFullYear()
            && currentData.getTypeCarte() === this.currentGranulariteCarte);
            */
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

        this.filtredData.forEach((row: FranceRow) => {
            if (row.getCodeTypeCarte() === tmpDefaultDisplay
                && this.isDateEqual(row.getDate(), this.currentDate)) {
                this.addRow(row);
            }
        });

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
        this.globalGraph.data.push({
            x: [completeDate],
            y: [row.getDeces()],
            type: 'bar',
            name: 'Décés'
        });

        this.globalGraph.data.push({
            x: [completeDate],
            y: [row.getCasConfirme()],
            name: 'Cas confirmés',
            type: 'bar'
        });

        this.globalGraph.data.push({
            x: [completeDate],
            y: [row.getReanimation()],
            name: 'Cas réanimés',
            type: 'bar'
        });

        this.globalGraph.data.push({
            x: [completeDate],
            y: [row.getHospitalise()],
            name: 'Cas hospitalisés',
            type: 'bar'
        });

        this.globalGraph.data.push({
            x: [completeDate],
            y: [row.getGueris()],
            name: 'Cas guérris',
            type: 'bar'
        });

        this.globalGraph.data.push({
            x: [completeDate],
            y: [row.getActif()],
            name: 'Cas actifs',
            type: 'bar'
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
        this.globalGraph.data = [];
    }



    

    ngOnInit(): void {
    }

}
