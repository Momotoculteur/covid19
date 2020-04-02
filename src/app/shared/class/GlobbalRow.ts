export class GlobalRow {

    private date: Date;
    private region: string;
    private country: string;
    private death: number;
    private confirmed: number;
    private recovered: number;
    private active: number;
    private mortalityRate: number;
    private recoveryRate: number;


    constructor(
        _date: Date,
        _region: string,
        _country: string,
        _confirmed: number,
        _death: number,
        _recovered: number,
        _active: number,
        _mortalityRate: number,
        _recoveryRate: number
    ) {
        this.date = _date;
        this.region = _region;
        this.country = _country;
        this.death = _death;
        this.confirmed = _confirmed;
        this.recovered = _recovered;
        this.active = _active;
        this.mortalityRate = _mortalityRate;
        this.recoveryRate = _recoveryRate;
    }

    public getDate(): Date {
        return this.date;
    }
    public setDate(_date: Date): void {
        this.date = _date;
    }

    public getRegion(): string {
        return this.region;
    }
    public setRegion(_region: string): void {
        this.region = _region;
    }

    public getCountry(): string {
        return this.country;
    }
    public setCountry(_country: string): void {
        this.country = _country;
    }

    public getDeath(): number {
        return this.death;
    }
    public setDeath(_death: number): void {
        this.death = _death;
    }

    public getConfirmed(): number {
        return this.confirmed;
    }
    public setConfirmed(value: number) {
        this.confirmed = value;
    }

    public getRecovered(): number {
        return this.recovered;
    }
    public setRecovered(value: number) {
        this.recovered = value;
    }

    public getActive(): number {
        return this.active;
    }
    public setActive(value: number) {
        this.active = value;
    }

    public getMortalityRate(): number {
        return this.mortalityRate;
    }
    public setMortalityRate(value: number) {
        this.mortalityRate = value;
    }
    public getRecoveryRate(): number {
        return this.recoveryRate;
    }
    public setRecoveryRate(value: number) {
        this.recoveryRate = value;
    }


}