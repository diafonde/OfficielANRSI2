#!/bin/bash
cd "$(dirname "$0")"
git add .
git commit -m "anrsi version 3 - fixed budget warnings"
git push
ng build --configuration production --base-href "/OfficielANRSI/" --output-path ../docs
cp ../docs/index.html ../docs/404.html
touch ../.nojekyll
cd ..
git add docs/ .nojekyll
git commit -m "Déploiement automatique - budget warnings resolved"
git push origin main