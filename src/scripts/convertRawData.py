### IMPORT
import pandas as pd
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
    print(data.granularite.unique())

    #data = data.groupby(['date', 'granularite', 'maille_code', 'maille_nom'])['cas_confirmes', 'deces', 'reanimation', 'hospitalises', 'gueris'].max()

    data = data.groupby(['date', 'granularite', 'maille_code', 'maille_nom'])['cas_confirmes', 'deces', 'reanimation', 'hospitalises', 'gueris'].max()
    data['active'] = data['cas_confirmes'] - data['deces'] - data['gueris']
    data['taux_mortalite'] = round((data['deces'] / data['cas_confirmes']), 3) * 100
    data['taux_guerison'] = round((data['gueris'] / data['cas_confirmes']), 3) * 100

    data = data.fillna(0)

    data['cas_confirmes'] = data['cas_confirmes'].astype(int)
    data['deces'] = data['deces'].astype(int)
    data['reanimation'] = data['reanimation'].astype(int)
    data['hospitalises'] = data['hospitalises'].astype(int)
    data['gueris'] = data['gueris'].astype(int)
    data['active'] = data['active'].astype(int)



    print(data.dtypes)
    data.to_csv('../assets/data/france/data.csv', encoding='utf-8', index=True)

if __name__== "__main__":
    mergeRawData()
