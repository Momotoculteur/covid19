### IMPORT
import pandas as pd
import numpy as np
from tqdm import tqdm

###


def mergeRawDataFrance():
    '''
    SCRIPT
    Permet de merge 3 flux de données différents
    Prends les maxs de chaque variables
    :return:
    '''
    print('\n\n')
    print('##########################')
    print('\t FRANCE')
    print('##########################')

    print('\tPré traitement data...')

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
    data['taux_guerison'] = round((data['gueris'] / data['cas_confirmes'])*100, 2)
    data['taux_mortalite'] = round((data['deces'] / data['cas_confirmes'])*100, 2)

    # Données manquantes, donnant des absurdités ( taux negatifs )
    data = data.fillna(0)
    data = data.replace([np.inf, -np.inf], 0)
    #print(data['taux_mortalite'].tail(40))
    #print(data[data.maille_nom == 'Dordogne'])
    print('\tSauvegarde nouveau fichier...')
    data.to_csv('../assets/data/france/data.csv', encoding='utf-8', index=False)


def mergeRawDataWorld():
    print('\n\n')
    print('##########################')
    print('\t MONDE')
    print('##########################')
    print('\tOuverture fichier de base...')
    dataGlobalConfirmed = pd.read_csv('D:\\DeeplyLearning\\Github\\COVID-19\\csse_covid_19_data\\csse_covid_19_time_series\\time_series_covid19_confirmed_global.csv')
    dataGlobalDeath = pd.read_csv('D:\\DeeplyLearning\\Github\\COVID-19\\csse_covid_19_data\\csse_covid_19_time_series\\time_series_covid19_deaths_global.csv')
    dataGlobalRecovered = pd.read_csv('D:\\DeeplyLearning\\Github\\COVID-19\\csse_covid_19_data\\csse_covid_19_time_series\\time_series_covid19_recovered_global.csv')

    dataGlobalConfirmed = dataGlobalConfirmed.groupby(['Country/Region']).sum().reset_index()
    dataGlobalDeath = dataGlobalDeath.groupby(['Country/Region']).sum().reset_index()
    dataGlobalRecovered = dataGlobalRecovered.groupby(['Country/Region']).sum().reset_index()

    print('\tPreparation data de base...')
    dataGlobalConfirmed = dataGlobalConfirmed.drop(columns=['Lat', 'Long'])
    confirmedDateHeader = dataGlobalConfirmed.columns.values
    confirmedDateHeader = confirmedDateHeader[2:]

    dataGlobalDeath = dataGlobalDeath.drop(columns=['Lat', 'Long'])
    deathDateHeader = dataGlobalDeath.columns.values
    deathDateHeader = deathDateHeader[2:]

    dataGlobalRecovered = dataGlobalRecovered.drop(columns=['Lat', 'Long'])
    recoveredDateHeader = dataGlobalRecovered.columns.values
    recoveredDateHeader = recoveredDateHeader[2:]

    finalDeath = pd.DataFrame({
        'Date': pd.Series([], dtype='str'),
        'Country/Region': pd.Series([], dtype='str'),
        'Death': pd.Series([], dtype='int')
    })
    finalRecovered = pd.DataFrame({
        'Date': pd.Series([], dtype='str'),
        'Country/Region': pd.Series([], dtype='str'),
        'Recovered': pd.Series([], dtype='int')
    })
    finalConfirmed = pd.DataFrame({
        'Date': pd.Series([], dtype='str'),
        'Country/Region': pd.Series([], dtype='str'),
        'Confirmed': pd.Series([], dtype='int')
    })


    print('\tAjout data CONFIRMED...')
    for index, row in tqdm(dataGlobalConfirmed.iterrows(), total=dataGlobalConfirmed.shape[0]):
        for currentDate in confirmedDateHeader:
            finalConfirmed = finalConfirmed.append({
                'Date': currentDate,
                'Country/Region': row['Country/Region'],
                'Confirmed': row[currentDate]
            }, ignore_index=True)

    print('\tAjout data DEATH...')
    for index, row in tqdm(dataGlobalDeath.iterrows(), total=dataGlobalDeath.shape[0]):
        for currentDate in deathDateHeader:
            finalDeath = finalDeath.append({
                'Date': currentDate,
                'Country/Region': row['Country/Region'],
                'Death': row[currentDate]
            }, ignore_index=True)

    print('\tAjout data RECOVERED...')
    for index, row in tqdm(dataGlobalRecovered.iterrows(), total=dataGlobalRecovered.shape[0]):
        for currentDate in recoveredDateHeader:
            finalRecovered = finalRecovered.append({
                'Date': currentDate,
                'Country/Region': row['Country/Region'],
                'Recovered': row[currentDate]
            }, ignore_index=True)



    print('\tMerge des datas ...')
    finalAll = pd.merge(finalConfirmed, finalDeath, on=['Date', 'Country/Region'], validate="one_to_one", how='inner')
    finalAll = pd.merge(finalAll, finalRecovered, on=['Date', 'Country/Region'], validate="one_to_one", how='inner')

    finalAll['Recovered'] = finalAll['Recovered'].fillna(0)
    finalAll['Death'] = finalAll['Death'].fillna(0)
    finalAll['Confirmed'] = finalAll['Confirmed'].fillna(0)
    print('\tAjout colonne Active ...')
    finalAll['Active'] = finalAll['Confirmed'] - finalAll['Death'] - \
                           finalAll['Recovered']
    finalAll['Active'] = finalAll['Active'].astype(int)
    finalAll['Active'] = np.where(finalAll['Active'] < 0, 0, finalAll['Active'])

    print('\tAjout colonne Mortality rate ...')
    finalAll['Mortality_Rate'] = round((finalAll['Death'] / finalAll['Confirmed']) * 100, 2)
    finalAll['Mortality_Rate'] = finalAll['Mortality_Rate'].astype(float)


    print('\tAjout colonne Recovery rate ...')
    finalAll['Recovered_Rate'] = round((finalAll['Recovered'] / finalAll['Confirmed']) * 100, 2)
    finalAll['Recovered_Rate'] = finalAll['Recovered_Rate'].astype(float)


    # Inf données par des diviisons par 0 pour les taux
    finalAll = finalAll.fillna(0)
    finalAll = finalAll.replace([np.inf, -np.inf], 0)


    print('\tSauvegarde nouveau fichier...')
    finalAll.to_csv('../assets/data/global/data.csv', encoding='utf-8', index=False)




if __name__== "__main__":
    print('\n\n')
    print('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    print('\t DEBUT ALGO RAWDATA')
    print('~~~~~~~~')

    mergeRawDataFrance()

    mergeRawDataWorld()

    print('\n\n')
    print('~~~~~~~~')
    print('\t FIN ALGO')
    print('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')

