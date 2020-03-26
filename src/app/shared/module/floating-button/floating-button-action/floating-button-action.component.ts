import {
    AfterContentInit,
    Component,
    ContentChild,
    ContentChildren,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Inject,
    Injector,
    Input,
    OnDestroy,
    Output,
    QueryList,
    Renderer2,
    ViewEncapsulation,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { DOCUMENT } from '@angular/common';
import { forkJoin, fromEvent, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { FloatingButtonComponent } from '../floating-button/floating-button.component';

const Z_INDEX_ITEM = 23;

export type Direction = 'up' | 'down' | 'left' | 'right';
export type AnimationMode = 'fling' | 'scale';

@Component({
    selector: 'floating-button-action',
    templateUrl: './floating-button-action.component.html',
    styleUrls: ['./floating-button-action.component.scss']
})
export class FloatingButtonActionComponent implements AfterContentInit {
    private _parent: FloatingButtonComponent;

    @ContentChildren(MatButton) _buttons: QueryList<MatButton>;

    /**
     * Whether the min-fab button exist in DOM
     */
    public miniFabVisible = false;

    /**
     * The timeout ID for the callback to show the mini-fab buttons
     */
    private showMiniFabAnimation: ReturnType<typeof setTimeout>;

    /**
     * When we will remove mini-fab buttons from DOM, after the animation is complete
     */
    private hideMiniFab: Subscription | null;

    constructor(injector: Injector, private renderer: Renderer2) {
        this._parent = injector.get(FloatingButtonComponent);
    }

    ngAfterContentInit(): void {
        this._buttons.changes.subscribe(() => {
            this.initButtonStates();
            this._parent.setActionsVisibility();
        });

        this.initButtonStates();
    }

    private initButtonStates(): void {
        this._buttons.forEach((button, i) => {
            this.renderer.addClass(button._getHostElement(), 'eco-fab-action-item');
            this.changeElementStyle(button._getHostElement(), 'z-index', '' + (Z_INDEX_ITEM - i));
        });
    }

    show(): void {
        if (!this._buttons) {
            return;
        }

        this.resetAnimationState();
        this.miniFabVisible = true;

        this.showMiniFabAnimation = setTimeout(() => {
            this._buttons.forEach((button, i) => {
                let transitionDelay = 0;
                let transform;
                if (this._parent.animationMode === 'scale') {
                    // Incremental transition delay of 65ms for each action button
                    transitionDelay = 3 + (65 * i);
                    transform = 'scale(1)';
                } else {
                    transform = this.getTranslateFunction('0');
                }

                const hostElement = button._getHostElement();
                this.changeElementStyle(hostElement, 'transition-delay', transitionDelay + 'ms');
                this.changeElementStyle(hostElement, 'opacity', '1');
                this.changeElementStyle(hostElement, 'transform', transform);
            });
        }, 50); // Be sure that *ngIf can show elements before trying to animate them
    }

    private resetAnimationState(): void {
        clearTimeout(this.showMiniFabAnimation);
        if (this.hideMiniFab) {
            this.hideMiniFab.unsubscribe();
            this.hideMiniFab = null;
        }
    }

    hide(): void {
        if (!this._buttons) {
            return;
        }

        this.resetAnimationState();

        const obs = this._buttons.map((button, i) => {
            let opacity = '1';
            let transitionDelay = 0;
            let transform;

            if (this._parent.animationMode === 'scale') {
                transitionDelay = 3 - (65 * i);
                transform = 'scale(0)';
                opacity = '0';
            } else {
                transform = this.getTranslateFunction((55 * (i + 1) - (i * 5)) + 'px');
            }

            const hostElement = button._getHostElement();

            this.changeElementStyle(hostElement, 'transition-delay', transitionDelay + 'ms');
            this.changeElementStyle(hostElement, 'opacity', opacity);
            this.changeElementStyle(hostElement, 'transform', transform);

            return fromEvent(hostElement, 'transitionend').pipe(take(1));
        });

        // Wait for all animation to finish, then destroy their elements
        this.hideMiniFab = forkJoin(obs).subscribe(() => this.miniFabVisible = false);

    }

    private getTranslateFunction(value: string): string {
        const dir = this._parent.direction;
        const translateFn = (dir === 'up' || dir === 'down') ? 'translateY' : 'translateX';
        const sign = (dir === 'down' || dir === 'right') ? '-' : '';

        return translateFn + '(' + sign + value + ')';
    }

    private changeElementStyle(elem: any, style: string, value: string) {
        // FIXME - Find a way to create a "wrapper" around the action button(s) provided by the user, so we don't change it's style tag
        this.renderer.setStyle(elem, style, value);
    }
}
