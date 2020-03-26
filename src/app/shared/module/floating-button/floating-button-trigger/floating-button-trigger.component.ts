import { Component, Injector, Input, HostBinding, HostListener } from '@angular/core';
import { FloatingButtonComponent } from '../floating-button/floating-button.component';


@Component({
    selector: 'floating-button-trigger',
    templateUrl: './floating-button-trigger.component.html',
    styleUrls: ['./floating-button-trigger.component.scss']
})
export class FloatingButtonTriggerComponent {

    private _parent: FloatingButtonComponent;

    /**
     * Whether this trigger should spin (360dg) while opening the speed dial
     */
    @HostBinding('class.eco-spin') get sp() {
        return this.spin;
    }

    @Input() spin = false;

    constructor(injector: Injector) {
        this._parent = injector.get(FloatingButtonComponent);
    }

    @HostListener('click', ['$event'])
    _onClick(event: Event): void {
        if (!this._parent.fixed) {
            this._parent.toggle();
            event.stopPropagation();
        }
    }

}


