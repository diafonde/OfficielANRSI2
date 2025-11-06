#!/bin/bash
cd "$(dirname "$0")"
git add .
git commit -m "anrsi last version  - fixed budget warnings"
git push
ng build --configuration production --base-href "/OfficielAnrsi2/" --output-path ../docs
cp ../docs/index.html ../docs/404.html
touch ../.nojekyll
cd ..
git add docs/ .nojekyll
git commit -m "Déploiement automatique - budget warnings resolved"
git push origin main