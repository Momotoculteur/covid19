import { Component, OnInit } from '@angular/core';
import { EGranulariteCarte } from '../../shared/enum/EGranulariteCarte';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';
import { FranceRow } from 'src/app/shared/class/FranceRow';



@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    public granuCarte: EGranulariteCarte;
    public typeGranu: EGranulariteCarte[];

    public allData: FranceRow[];

    public nbEntree: number;

    constructor(private http: HttpClient) {
        this.granuCarte = EGranulariteCarte.REGION;
        this.typeGranu = [EGranulariteCarte.DEPARTEMENT, EGranulariteCarte.REGION];
        this.nbEntree = 0;
        this.allData = [];


        this.loadData();
    }

    private loadData(): void {
        this.http.get('assets/data/france/chiffres-cles.csv', {responseType: 'text'})
        .subscribe(data => {
            //console.log(data);
            this.parseXmlFile(data);
        });

    }

    private parseXmlFile(csvContent: string): void {
        const csvContentByLine = csvContent.split('\n');

        csvContentByLine.forEach((csvLine) => {
            const currentLine = csvLine.split(',');
            if (this.nbEntree === 0) {

            } else {
                console.log(currentLine)
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
                    currentLine[9],
                    currentLine[10],
                    currentLine[11]
                    ));
            }
           
            this.nbEntree++;
        });

        console.log(this.allData)

    }

    ngOnInit(): void {
    }

}
