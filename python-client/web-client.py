import requests
import json


def parse_json_c(page):
    data=page.json()
    for données in data:
        id=données["id"]
        poids=données["weight"]
        hauteur=données["dimension"]["height"]
        l=données["dimension"]["width"]
        L=données["dimension"]["length"]
        print(f'Voici votre commande {id}, il pèse {poids} et voici ces dimensions,h: {hauteur}, l: {l} et L: {L}')
        for stateful_key, stateful_data in données["state"].items():
            ### stateful_key == wrapped, storage-arrival, etc.
            ### stateful_data == {"state": bool, "timestamp": str}

            if stateful_data["state"] == True:
                print("Etat du colis:", stateful_key, "timestamp:", stateful_data["timestamp"])
            else:
                print("Etat du colis:", stateful_key, "timestamp: unknown")

def parse_json_u(page):
    data=page.json()
    for données in data:
        nom=données["name"]
        adresse=données["address"]
        liste_colis=données["packages"]
        print(f"Vous êtes {nom}, votre adresse est {adresse}, liste des colis {liste_colis}")
        
def parse_json_l(page):
    print("bonjour")

def get_user_input() -> int:
    try:
        demande = int(input(' -1: Vous authentifier \n -2: Suivie de colis \n -3: Listes des transporteurs \n Que voulez-vous faire: \n '))
    except KeyboardInterrupt:
        print("Bye bye!")
        exit()
    except Exception:
        ### Should work fine without it but to be sure
        ### we shouldn't unassign the recursion call
        demande = get_user_input()

    return demande

def get_transport_input() -> str:
    try:
        transporteur = input("Quel transporteur voulez-vous consulter :")
    except KeyboardInterrupt:
        print("Bye bye !")
        exit()
    except Exception:
        transporteur = get_transport_input()

    return transporteur.lower()

print('Bonjour que voulez-vous')
demande = get_user_input()
url= "https://api.github.com/events"


### Ce dictionnaire est présent seulement le temps que l'environnement
### de dev soit monté correctement
###
### //////////////////////////////////////////////////////////////////
###
###                 A NE PAS UTILISER EN PRODUCTION
###
### //////////////////////////////////////////////////////////////////
transporteurs = {
    "dpd": {
        "id": "001",
        "name": "DPD",
        "vehicle": {
            "id": "65731bb120d499455eedda46",
            "gps": ""
        },
        "packages": [],
        "is-working": True
    },
    "ups": {
        "id": "002",
        "name": "UPS",
        "vehicle": {
            "id": "65731bb120d499455eedda46",
            "gps": ""
        },
        "packages": [],
        "is-working": True
    }


}

if demande == 1:
    user = input('Vous êtes : \n')
    new_url= f"{url}client/{user}"
    print (f"Votre url est {new_url}")
    page=requests.get(new_url)
    pstate=page.status_code
    if pstate == requests.codes.ok:
        parse_json_u(page)
    else:
        print(f"Votre code erreur: {pstate}")            

elif demande == 2:
    id = input('Votre numéro de colis : \n')
    new_url= "{url}colis/{id}"
    print (f"Votre url est {new_url}")
    page=requests.get(new_url)
    pstate=page.status_code
    if pstate == requests.codes.ok:
        parse_json_c(page)
    else:
        print(f"Votre code erreur{pstate}")   
             
else:
    print("Voici la liste des transporteurs: \n - DPD \n - Colissimo \n - Chronopost \n - DHl \n - Fedex \n - UPS")

    transporteur = get_transport_input()

    if transporteur in transporteurs.keys():
        transporteur_data = transporteurs[transporteur]
        print(f"Tu consulte {transporteur_data['name']}")
    else:
        print(f"Désolé, nous ne connaissons pas le transporteur {transporteur}")




_id = input("Est-ce un id").lower()

if _id == "oui":
    i=input("Votre ID: ")
    requests.get(f"https://localhost:4000/api/delivery/id/{i}")
elif _id == "non":
    n=input("Votre nom: ")
    requests.get(f"https://localhost:4000/api/delivery/name/{n}")
else:
    print("I don't understand")

