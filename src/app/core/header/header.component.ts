import { Component, OnInit } from '@angular/core';
import { faWineGlassAlt, faGlobe } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public iconFrance: any;
  public iconWorld: any;

  constructor() { 
    this.iconFrance = faWineGlassAlt;
    this.iconWorld = faGlobe;
  }

  ngOnInit(): void {
  }

}
