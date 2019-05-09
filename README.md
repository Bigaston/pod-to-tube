# pod-to-tube

PodToTube est (encore) un service pour LastPod.pm! Avec celui-ci, vous pourrez directement à partir de votre flux RSS et du numéro de l'épisode (0=dernier episode, 1 celui d'avant, etc).

## Programmes requis
- [FFMPEG](https://ffmpeg.org/)
- [NodeJS](https://nodejs.org/en/)

## Installation et utilisation
- Copiez le contenu de ce repo (ou récuperez le [ici](https://github.com/Bigaston/pod-to-tube/releases))
- Ouvrez un terminal de commande dans le dossier téléchargé et executez `npm install`
- Lancez ensuite le programme avec `node lastpod.js`
- Pour finir, rendez vous sur [localhost:44444](http://localhost:44444) pour ajouter votre flux
- La terminal de commande vous donne des informations sur l'avancée de la création. Quand "Vidéo générée!" est affiché, vous pouvez retrouver votre vidéo dans "export"

- Vous pouvez modifier l'image "background.png" dans le dossier assets pour modifier le fond

## Améliorations prévues
- Préparation automatique de la description Youtube contenant le chapitrage et autre
- Upload directe sur Youtube
- Portage du système sur Linux (marche uniquement sur Windows pour le moment)
- Détection automatique de nouveaux épisodes
- Amélioration de l'interface Web avec selection automatique de l'épisode
- Ajout d'informations sur la vidéo (description courte, liens vers la vidéo, chapitrage, barre de chargement, durée)
- Executable simplifié avec Electron

## Retour
Vous avez des retours à faire sur ce projet? N'hésitez pas à me contacter sur [Twitter](https://twitter.com/Bigaston) pour avoir de l'aide!