echo .
echo Changement env Python...
echo .
call activate DeepL
D:

echo .
echo MAJ Data Monde...
echo .
cd D:\DeeplyLearning\Github\COVID-19
git checkout master
git pull


echo .
echo MAJ Data France...
echo .
cd D:\DeeplyLearning\Github\data
git checkout .
git checkout master
git pull
call npm run build
D:

echo .
echo Conversion des nouvelles data...
echo .
cd D:\DeeplyLearning\Github\SITE_PERSO_GITPAGE\covid19
git checkout master
cd src\scripts
call python convertRawData.py
D:
call python augmentGeojsonData.py
D:
git add -u

echo .
echo Sauvegarde des nouvelles data sur Github...
echo .
git commit -m "Daily commit update data - %date%"
git push origin master

echo .
echo Deploiement nouvelles data sur Github Pages...
echo .
call npm run deploy
D:

pause