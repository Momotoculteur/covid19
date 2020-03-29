# Covid19 - Data visualisation

## Description
Site permettant de suivre l'avancé de la pandemie du Covid-19.

**https://momotoculteur.github.io/covid19**

**SPECIAL FRANCE : du 24 Janvier au 27 Mars**
+ Granularité : 
    + Pays global
    + Région
    + Département

+ Courbes : 
    + Cas actifs
    + Cas confirmés
    + Cas décédés
    + Cas hospitalisés
    + Cas Réanimés
    + Cas Soignés
    + Taux mortalité
    + Taux soigné


**SPECIAL MONDE : à venir...**


## Informations

### Technos & Framework

| Type  | Nom |
| ------------- | ------------- |
| Web  | Angular 9  |
| Ui  | Material components  |
| IDE  | Visual code  |
| Graphiques  | Plotly  |


### Data Sources
| Type  | Nom |
| ------------- | ------------- |
| Données France  | github.com/opencovid19-fr/data  |
| Données Monde  | github.com/CSSEGISandData/COVID-19  |


### Mise à jour de l'app

#### MAJ data
1. Git pull Data France
2. `$ python src/scripts/convertRawData`

#### Deploiement
1. `$ npm run deploy`