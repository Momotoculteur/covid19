import { Component, OnInit } from '@angular/core';
import * as leaflet from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    public map;

    constructor(
        private http: HttpClient
    ) {

    }

    ngOnInit(): void {
        this.map = leaflet.map('map').setView([47.0708191, 1.2772772], 6);
        leaflet.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			id: "mapbox",
			attribution: "Bastien MAURICE"
		}).addTo(this.map);
    }


}
