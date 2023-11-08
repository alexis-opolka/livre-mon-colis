# SAE-32 - Développer une application communicante

Une application client/serveur de suivi de livraison de colis.

On veut pouvoir localiser les colis à tout instant (position GPS: latitude,longitude) et suivre l'historique de leurs déplacements.
A chaque étape de la livraison d'un colis, on va donc enregistrer la date et la nouvelle position du colis.

L'application client/serveur sera écrite en python fonctionnera en TCP sur le port 3456.
En option, on pourra chiffrer les échanges de données (TLS).

- Fonctionnalités obligatoires:
  - identification à partir des utilisateurs d'une base de données.
  - notions de droits pour les utilisateurs (voir ci-dessous).
  - stockage de tous les évènements (authentification, commandes, erreurs, ...) dans un fichier de traces horodaté.

- Réaliser enfin une interface graphique et/ou WEB et/ou Mobile de suivi de colis ainsi que la partie gestion permettant à :

  - un expéditeur de "créer" le colis dans l'application en indiquant le transporteur et le destinataire.
  - un transporteur :
    - de préparer une livraison avec plusieurs colis dans un véhicule donné (liste ordonnée).
    - de modifier la position GPS d'un/plusieurs colis (par exemple: tous ceux restant dans un véhicule de transport).
    - d'indiquer la livraison d'un colis à un destinataire.
  - un destinataire de valider la réception d'un colis.

Chaque colis est identifié et possède un poids, 3 dimensions (hauteur,largeur,longueur) et un état:

  - EMBALLE: Date d'emballage (expéditeur)
  - ARRIVE: Date de arrivée au dépot (transporteur)
  - DEPART: Date de départ du dépot + identifiant livraison (transporteur)
  - LIVRE: Date de livraison (transporteur)
  - RECU: Date de reception (destinataire)

De plus on connaît pour chaque colis : `l'expéditeur`, `le transporteur` et `le destinataire` du colis (`nom`,`adresse`,`codePostal`,`ville`,`mail`,`tel`).

Un expéditeur n'aura pas les mêmes "commandes" qu'un transporteur ou qu'un destinataire :

  - Expéditeur:
    - listDest, showDest id, createDest, modifDest[^1] id, deleteDest[^2] id
    - listTransp, showTransp id, createTransp, modifTransp[^1] id, deleteTransp[^2] id
    - listColis, showColis id, createColis, modifColis[^1] id, deleteColis[^2] id, gpsColis[^1] id
  - Transporteur:
    - listVehic, showVehic id, createVehic, modifVehic[^1] id, deleteVehic[^2] id, gpsVehic[^1] id
    - listLivr, showLivr id, createLivr, deleteLivr[^2] id
    - listColis, showColis id, livreColis[^4] id
      - addColisLivr[^1] id, livrId, insertColisLivr[^1] id, rank, livrId, delColisLivr[^1] id, livrId
  - Destinataire:
    - showColis[^3] id, recuColis[^3] id
  - Administrateur:
    - possède tous les droits
    - listExp, showExp id, createExp, modifExp[^1] id, deleteExp[^2] id

  [^1]: si il en est le créateur,
  [^2]: si il n'est pas utilisé,
  [^3]: si il en est le destinataire,
  [^4]: si il en est le transporteur

---

## Exemple de valeurs

```txt
Aliexpress - c512,1.2 Kg,h8,l12,L21 - John DOE

ManoMano - c514,0.7 Kg,h4,l21,L30 - Bob MARTIN

Amazon - c513,1.7 Kg,h18,l20,L40 - John DOE

Ebay - c515,1.1 Kg,h12,l20,L35 - Alice SMITH

       c517,0.2 Kg,h1,l21,L30 - Clark BLACK

cdiscount - c516,0.8 Kg,h6,l12,L15 - Dilan WHITE

            c518,0.9 Kg,h7,l12,L15 - Elian GRAY

DHL Vehic4-Renault Trafic ; Livr18:c514,c517,c516

UPS Vehic5-Peugeot Boxer ; Livr19:c512,c513,c515

FEDEX Vehic6-Citroen Jumper

17-04-2023 09:32:15,c512,43.591476,3.892096

18-04-2023 10:44:18,c515,43.591587,3.891715

18-04-2023 10:52:04,c513,43.591587,3.891715

18-04-2023 11:32:04,Vehic5,43.591587,3.891715

18-04-2023 11:33:04,Vehic5,43.591154,3.883240

18-04-2023 11:34:04,Vehic5,43.597277,3.875687

18-04-2023 11:35:04,Vehic5,43.604238,3.867705

18-04-2023 11:35:48,Vehic5,43.607345,3.868199+c512-LIVRE+c513-LIVRE
```

## Copyright &copy; 2023 Alexis Opolka & Mathys Domergue - All Rights Reserved
