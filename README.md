# Covid19 - Data visualisation

## Description
Site permettant de suivre l'avancé de la pandemie du Covid-19.

**https://momotoculteur.github.io/covid19**

**SPECIAL FRANCE : du 24 Janvier au 22 Avril**
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


**SPECIAL MONDE : du 24 Janvier au 22 Avril**
+ Granularité : 
    + Pays global

+ Courbes : 
    + Cas actifs
    + Cas confirmés
    + Cas décédés
    + Cas Soignés
    + Taux mortalité
    + Taux soigné


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

### Scripts utiles
| Type  | Nom |
| ------------- | ------------- |
| augmentGeojsonData.py  | Ajoute à nos donneés GeoJSON les valeurs de l'évolution de la pandémie  |
| convertRawData.py  | Récupérere les données France et Monde des dépôts précédent, et procéde à des opérations de merge, de calcul de nouvelles variables et de netoyage, pour être exploitable par notre application web  |
| dailyAutoCommitUpdateData.bat | Le plus important. Permet de Git pull les deux dépôts de données Monde et France, d'appeler les scripts augmentGeojsonData.py et convertRawData.py, de push sur la branch master de notre dépôt les nouvelles données à jour, et enfin de lancer un build Angular de notre application et de push notre build sur la branch gh-pages, pour mettre à jour notre site en production disponible via le lien cité plus haut. |

### Mise à jour de l'application

#### MAJ data
- Assurez vous d'avoir Git Clone les deux dépôts précedant ( Données France & Monde )
- Faite un git pull des deux dépôts précédent pour avoir les dernières valeurs à jour.
- Lancez les scripts convertRawData.py, puis augmentGeojsonData.py.

#### Deploiement
- Pour réaliser un build de notre application et le rendre accessible depuis l'exterieur :
`$ npm run deploy`

#### Tout-en-un (MAJ data + deploiement)
- Dans **src/scripts**, lancez **dailyAutoCommitUpdateData.bat**. 
