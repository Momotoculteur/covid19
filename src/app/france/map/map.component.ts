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
    public geojson;
    public info;
    constructor(
        private http: HttpClient
    ) {

    }

    ngOnInit(): void {
        this.map = leaflet.map('map').setView([47.0708191, 1.2772772], 6);
        leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            id: 'mapbox',
            attribution: 'Bastien MAURICE'
        }).addTo(this.map);
        this.info = new leaflet.Control();

        function resetHighlight(e) {
            this.geojson.resetStyle(e.target);
            this.info.update();
        }
    
        function zoomToFeature(e) {
            this.map.fitBounds(e.target.getBounds());
        }
    
        function highlightFeature(e) {
            const layer = e.target;
    
            layer.setStyle({
                weight: 5,
                color: "#666",
                dashArray: "",
                fillOpacity: 0.2
            });
    
            if (!leaflet.Browser.ie && !leaflet.Browser.edge) {
                layer.bringToFront();
            }
        }

        this.http.get('assets/geo/france/region.json').subscribe((json: any) => {
            this.geojson = leaflet.geoJSON(json, {
                style: {
                    color: "white",
                    fillColor: "red",
                    fillOpacity: 0.1
                },
                onEachFeature: function onEachFeature(feature, layer) {

                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                        click: zoomToFeature
                    });
                }
            }).addTo(this.map);
        });



    }



}



