### IMPORT
import pandas as pd
import numpy as np
###

def mergeRawData():
    '''
    SCRIPT
    Permet de merge 3 flux de données différents
    Prends les maxs de chaque variables
    :return:
    '''
    data = pd.read_csv('D:\\DeeplyLearning\\Github\\data\\dist\\chiffres-cles.csv')

    data['granularite'] = data['granularite'].replace('collectivite-outremer', 'DOMTOM')

    data['granularite'] = data['granularite'].apply(lambda x: x.upper())

    #data = data.groupby(['date', 'granularite', 'maille_code', 'maille_nom'])['cas_confirmes', 'deces', 'reanimation', 'hospitalises', 'gueris'].max()

    data = data.groupby(['date', 'granularite', 'maille_code', 'maille_nom'])['cas_confirmes', 'deces', 'reanimation', 'hospitalises', 'gueris'].max().reset_index()
    #data = data.groupby(['date', 'granularite', 'maille_code', 'maille_nom'])['cas_confirmes'].max().reset_index()
    #print(data[data.maille_nom == 'Nouvelle-Aquitaine'])
    #data = data.fillna(method='bfill')
    data = data.fillna(0)

    # print(data[data.maille_nom =='Nouvelle-Aquitaine'])
    data['cas_confirmes'] = data['cas_confirmes'].astype(int)
    data['deces'] = data['deces'].astype(int)
    data['reanimation'] = data['reanimation'].astype(int)
    data['hospitalises'] = data['hospitalises'].astype(int)
    data['gueris'] = data['gueris'].astype(int)
    #data['active'] = data['active'].astype(int)
    data['active'] = data['cas_confirmes'] - data['deces'] - data['gueris']
    data['active'] = data['active'].astype(int)

    data['active'] = np.where(data['active'] < 0, 0, data['active'])
    data['taux_mortalite'] = round((data['deces'] / data['cas_confirmes']), 3) * 100
    data['taux_guerison'] = round((data['gueris'] / data['cas_confirmes']), 3) * 100

    # Données manquantes, donnant des absurdités ( taux negatifs )
    data = data.fillna(0)
    data = data.replace([np.inf, -np.inf], 0)

    #print(data[data.maille_nom == 'Dordogne'])
    print(data)
    data.to_csv('../assets/data/france/data.csv', encoding='utf-8', index=False)

if __name__== "__main__":
    mergeRawData()
