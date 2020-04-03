import json
import pandas as pd
import re
from tqdm import tqdm

def augmentCountryFile():
    '''
    Ajoute l'ensemble des données du fichier généré France sous date trié dans le fichier de geojson du pays
    :return:
    '''
    print('\n\n')
    print('##########################')
    print('\t PAYS')
    print('##########################')

    print('\tOuverture fichier de base...')
    with open('./originalFranceGeojson/PAYS.json') as j1:
        rawFranceCountryJson = json.load(j1)

    rawFranceCountryJson['properties']['nom'] = 'France'
    rawFranceCountryJson['properties']['code'] = 'FRA'
    iso = []
    iso.append(rawFranceCountryJson)
    customized = {}
    customized['features'] = iso

    for pays in tqdm(customized['features']):
        countryAugmented = [];

        print('\tAjout nouvelles données...')
        for index, row in ALL_FRANCE_DATA.iterrows():
            if (row['granularite'] == 'PAYS'):
                if( pays['properties']['code'] == row['maille_code'] ):
                    countryAugmented.append({
                        'date': row['date'],
                        'confirmed': row['cas_confirmes'],
                        'death': row['deces'],
                        'reanimated': row['reanimation'],
                        'hospitalized': row['hospitalises'],
                        'recovered': row['gueris'],
                        'active': row['active'],
                        'mortalityRate': row['taux_mortalite'],
                        'recoveredRate': row['taux_guerison']
                    })
        countryAugmentedSorted = sorted(countryAugmented, key=lambda k: k['date'])
        pays['properties']['value'] = countryAugmentedSorted

    print('\tSauvegarde nouveau fichier...')

    with open("../assets/geo/france/geojsonCountry.json", "w", encoding='utf8') as outCountryFile:
        json.dump(customized, outCountryFile, indent=4, ensure_ascii=False)



def augmentRegionFile():
    '''
    Ajoute l'ensemble des données du fichier généré France sous date trié dans le fichier de geojson des régions
    :return:
    '''
    print('\n\n')
    print('##########################')
    print('\t REGION')
    print('##########################')

    print('\tOuverture fichier de base...')
    with open('./originalFranceGeojson/REGION.json') as j2:
        rawFranceRegionJson = json.load(j2)

    print('\tAjout nouvelles données...')
    for region in tqdm(rawFranceRegionJson['features']):
        regionAugmented = []
        for index, row in ALL_FRANCE_DATA.iterrows():
            if (row['granularite'] == 'REGION'):
                if( region['properties']['code']== re.sub( r'([a-zA-Z-]*-)', '', row['maille_code']) ):
                    regionAugmented.append({
                        'date': row['date'],
                        'confirmed': row['cas_confirmes'],
                        'death': row['deces'],
                        'reanimated': row['reanimation'],
                        'hospitalized': row['hospitalises'],
                        'recovered': row['gueris'],
                        'active': row['active'],
                        'mortalityRate': row['taux_mortalite'],
                        'recoveredRate': row['taux_guerison']
                    })
        #region['properties'].append({'value': regionAugmented})
        regionAugmentedSorted = sorted(regionAugmented, key=lambda k: k['date'])
        region['properties']['value'] = regionAugmentedSorted

    print('\tSauvegarde nouveau fichier...')

    with open("../assets/geo/france/geojsonRegion.json", "w", encoding='utf8') as outRegionFile:
        json.dump(rawFranceRegionJson, outRegionFile, sort_keys=True, ensure_ascii=False)





def augmentDepartementalFile():
    '''
    Ajoute l'ensemble des données du fichier généré France sous date trié dans le fichier de geojson des département
    :return:
    '''
    print('\n\n')
    print('##########################')
    print('\t DEPARTEMENT')
    print('##########################')

    print('\tOuverture fichier de base...')
    with open('./originalFranceGeojson/DEPARTEMENT.json') as j3:
        rawFranceDepartementalJson = json.load(j3)

    print('\tAjout nouvelles données...')

    for departement in tqdm(rawFranceDepartementalJson['features']):
        depAugmented = [];

        for index, row in ALL_FRANCE_DATA.iterrows():
            if (row['granularite'] == 'DEPARTEMENT'):
                if( departement['properties']['code']== re.sub( r'([a-zA-Z-]*-)', '', row['maille_code']) ):
                    depAugmented.append({
                        'date': row['date'],
                        'confirmed': row['cas_confirmes'],
                        'death': row['deces'],
                        'reanimated': row['reanimation'],
                        'hospitalized': row['hospitalises'],
                        'recovered': row['gueris'],
                        'active': row['active'],
                        'mortalityRate': row['taux_mortalite'],
                        'recoveredRate': row['taux_guerison']
                    })
        depAugmentedSorted = sorted(depAugmented, key=lambda k: k['date'])
        departement['properties']['value'] = depAugmentedSorted

    print('\tSauvegarde nouveau fichier...')

    with open("../assets/geo/france/geojsonDepartement.json", "w", encoding='utf8') as outDepFile:
        json.dump(rawFranceDepartementalJson, outDepFile, sort_keys=True, ensure_ascii=False)



def augmentWorldFile():
    '''
    Ajoute l'ensemble des données du fichier généré France sous date trié dans le fichier de geojson World
    :return:
    '''
    print('\n\n')
    print('##########################')
    print('\t MONDE')
    print('##########################')

    print('\tOuverture fichier de base...')
    with open('./originalWorldGeojson/countries.json') as j4:
        rawAllCountriesJson = json.load(j4)

    print('\tAjout nouvelles données...')
    for country in tqdm(rawAllCountriesJson['features']):
        # opti du json poids
        country['properties'].pop('ISO_A3', None)
        countryAugmented = []
        for index, row in ALL_GLOBAL_DATA.iterrows():
            if(row['Country/Region'] == country['properties']['CountryName']):
                countryAugmented.append({
                    'Date': row['Date'],
                    'Confirmed': row['Confirmed'],
                    'Death': row['Death'],
                    'Recovered': row['Recovered'],
                    'Active': row['Active'],
                    'Mortality_Rate': row['Mortality_Rate'],
                    'Recovered_Rate': row['Recovered_Rate']
                })


        countryAugmentedSorted = sorted(countryAugmented, key=lambda k: k['Date'])
        country['properties']['value'] = countryAugmentedSorted

    print('\tSauvegarde nouveau fichier...')
    with open("../assets/geo/global/geojsonGlobal.json", "w", encoding='utf8') as outDepFile:
        json.dump(rawAllCountriesJson, outDepFile, sort_keys=True, ensure_ascii=False)

if __name__== "__main__":
    print('\n\n')
    print('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    print('\t DEBUT ALGO GEOJSON')
    print('~~~~~~~~')
    print('\tLecture fichier de base FRANCE...')

    ALL_FRANCE_DATA = pd.read_csv('../assets/data/france/data.csv')
    ALL_GLOBAL_DATA = pd.read_csv('../assets/data/global/data.csv')
    augmentCountryFile()
    augmentRegionFile()
    augmentDepartementalFile()

    augmentWorldFile()

    print('\n\n')
    print('~~~~~~~~')
    print('\t FIN ALGO')
    print('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
