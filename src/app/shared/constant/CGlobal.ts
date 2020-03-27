export const G_FRANCE_DATA_PATH = 'assets/data/france/data.csv';

export function UPDATE_PLOTLY_VIEW(): void {
    window.dispatchEvent(new Event('resize'));
}

export const LAST_DATE = new Date('2020-03-23');
