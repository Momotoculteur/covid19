import { Component, OnInit } from '@angular/core';
import { EGranulariteCarte } from '../../shared/enum/EGranulariteCarte';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';
import { FranceRow } from 'src/app/shared/class/FranceRow';
import { G_FRANCE_DATA_PATH } from 'src/app/shared/constant/CGlobal';

import * as clonedeep from 'lodash.clonedeep';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    public currentGranulariteCarte: EGranulariteCarte;
    public typeGranu: EGranulariteCarte[];

    public allData: FranceRow[];
    public filtredData: FranceRow[];

    public lastDate: Date;

    public nbEntree: number;


    public graphDeath = {
        data: [],
        layout: {
            title: 'Cas décédés',
            autosize: true
        },
        config: {
            responsive: true
        }
    };

    public graphRecovered = {
        data: [],
        layout: {
            title: 'Cas guérris',
            autosize: true
        },
        config: {
            responsive: true
        }
    };

    public graphActive = {
        data: [],
        layout: {
            title: 'Cas actifs',
            autosize: true
        },
        config: {
            responsive: true
        }
    };

    public graphConfirmed = {
        data: [],
        layout: {
            title: 'Cas confirmés',
            autosize: true
        },
        config: {
            responsive: true
        }
    };

    public graphHospitalised = {
        data: [],
        layout: {
            title: 'Cas hospitalisés',
            autosize: true
        },
        config: {
            responsive: true
        }
    };

    public graphHReanimation = {
        data: [],
        layout: {
            title: 'Cas réanimés',
            autosize: true
        },
        config: {
            responsive: true
        }
    };

    constructor(private http: HttpClient) {
        this.currentGranulariteCarte = EGranulariteCarte.PAYS;
        this.typeGranu = [EGranulariteCarte.DEPARTEMENT, EGranulariteCarte.REGION, EGranulariteCarte.PAYS];
        this.nbEntree = 0;
        this.allData = [];

        this.lastDate = new Date('2020-03-23');

        this.loadData();
    }

    public updateFiltredData(): void {
        this.filtredData = this.allData.filter(currentData =>
            currentData.getDate().getDate() === this.lastDate.getDate()
            && currentData.getDate().getMonth() === this.lastDate.getMonth()
            && currentData.getDate().getFullYear() === this.lastDate.getFullYear()
            && currentData.getTypeCarte() === this.currentGranulariteCarte);

        switch(this.currentGranulariteCarte) {
            case EGranulariteCarte.PAYS : {
                this.loadGraphDataForCountry();
                break;
            }
            case EGranulariteCarte.REGION : {
                this.loadGraphDataForRegion();
                break;
            }
            case EGranulariteCarte.DEPARTEMENT : {
                this.loadGraphDataForDepartemental();
                break;
            }
        }

        console.log(this.filtredData)


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
                        ));
                }
    
                this.nbEntree++;
            }
            
        });

        this.filtredData = clonedeep(this.allData);
        this.updateFiltredData();

    }


    private loadGraphDataForCountry(): void {
        this.cleanAllGraph();

    }

    private loadGraphDataForRegion(): void {
        this.cleanAllGraph();

    }

    private loadGraphDataForDepartemental(): void {
        this.cleanAllGraph();
    }

    public addRow(graph) {

    }

    private cleanAllGraph(): void {
        this.graphDeath.data = [];
        this.graphRecovered.data = [];
        this.graphActive.data = [];
        this.graphConfirmed.data = [];
    }



    

    ngOnInit(): void {
    }

}
