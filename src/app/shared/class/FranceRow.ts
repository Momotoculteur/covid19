import { EGranulariteCarte } from '../enum/EGranulariteCarte';
import { __decorate } from 'tslib';
export class FranceRow {

    private date: Date;
    private typeCarte: EGranulariteCarte;
    private codeTypeCarte: string;
    private libeleTypeCarte: string;
    private casConfirme: number;
    private deces: number;
    private reanimation: number;
    private hospitalise: number;
    private gueris: number;
    private sourceNom: string;
    private sourceUrl: string;
    private sourceType: string;

    constructor(
        _date: Date,
        _typeCarte: EGranulariteCarte,
        _codeTypeCarte: string,
        _libeleTypeCarte: string,
        _casConfirme: number,
        _deces: number,
        _reanimation: number,
        _hospitalise: number,
        _gueris: number,
        _sourceNom: string,
        _sourceUrl: string,
        _sourceType: string,
    ) {
        this.date = _date;
        this.typeCarte = _typeCarte;
        this.codeTypeCarte = _codeTypeCarte;
        this.libeleTypeCarte = _libeleTypeCarte;
        this.casConfirme = _casConfirme;
        this.deces = _deces;
        this.reanimation = _reanimation;
        this.hospitalise = _hospitalise;
        this.gueris = _gueris;
        this.sourceNom = _sourceNom;
        this.sourceUrl = _sourceUrl;
        this.sourceType = _sourceType;
    }

    public getDate(): Date {
        return this.date;
    }
    public getTypeCarte(): EGranulariteCarte {
        return this.typeCarte;
    }
    public getCodeTypeCarte(): string {
        return this.codeTypeCarte;
    }
    public getLibeleTypeCarte(): string {
        return this.libeleTypeCarte;
    }
    public getCasConfirme(): number {
        return this.casConfirme;
    }
    public getDeces(): number {
        return this.deces;
    }
    public getReanimation(): number {
        return this.reanimation;
    }
    public getHospitalise(): number {
        return this.hospitalise;
    }
    public getGueris(): number {
        return this.gueris;
    }
    public getSourceNom(): string {
        return this.sourceNom;
    }
    public getSourceUrl(): string {
        return this.sourceUrl;
    }
    public getSourceType(): string {
        return this.sourceType;
    }

    public setDate(_date: Date): void {
        this.date = _date;
   }
   public setTypeCarte(_typeCarte: EGranulariteCarte): void {
        this.typeCarte = _typeCarte;
   }
   public setCodeTypeCarte(_codeTypeCarte: string): void {
        this.codeTypeCarte = _codeTypeCarte;
   }
   public setLibeleTypeCarte(_libeleTypeCarte): void {
        this.libeleTypeCarte = _libeleTypeCarte;
   }
   public setCasConfirme(_casConfirme: number): void {
        this.casConfirme = _casConfirme;
   }
   public setDeces(_deces: number): void {
        this.deces = _deces;
   }
   public setReanimation(_reanimation: number): void {
        this.reanimation = _reanimation;
   }
   public setHospitalise(_hospitalise: number): void {
        this.hospitalise = _hospitalise;
   }
   public setGueris(_gueris: number): void {
        this.gueris = _gueris;
   }
   public setSourceNom(_sourceNom: string): void {
        this.sourceNom = _sourceNom;
   }
   public setSourceUrl(_sourceUrl: string): void {
        this.sourceUrl = _sourceUrl;
   }
   public setSourceType(_sourceType: string): void {
        this.sourceType = _sourceType;
   }






}