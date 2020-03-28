import { ELegend } from '../enum/ELegends';

export interface IGraphicDefinition {
    data: IGaphicDataDefinition[];
    config: {
        responsive: boolean;
    };
    layout: {
        title: string;
        autosize: boolean;
        bargap?: number;
        bargroupgap?: number;
        barmode?: string;
    };
    typeGraphic: string;
}

export interface IGaphicDataDefinition {
    x: any[];
    y: any[];
    type: string;
    name?: ELegend;
    marker?: {
        color: string;
    };
    legendgroup?: string;
    showlegend?: boolean;
    mode?: string;
}

