//recuperer le format csv
let fs = require('fs');
let Intervention = require('./Intervention');
let Personne = require('./Personne');
let Planning = require('./Planning');
let PlanningList = require('./PlanningList');

class csvToICalParser {

    // type est le type de planning : valeurs possibles :'i' pour intervenant ou 'b' pour bénéficiaire
    constructor(csvFile, type) {

        //Déclaration des variables
        this.planning = fs.readFileSync(csvFile, 'utf8');
        this._planningJson = {};
        this.type = type;
        this.typePersonne = type;
    }

    get planningJson() {
        return this._planningJson;
    }

    //Tokenization
    tokenize() {
        let separator = /\r\n/;
        this.planning = this.planning.split(separator);
    }

    parseToJson() {
        // Extraction des informations sur la personne
        let personne = this.planning.shift();
        personne = personne.split('-- ');
        let identite = personne[0].replace('### ', '');
        identite = identite.split('. ');
        let infosPersonne = {};
        if (this.type === 'i') {
            infosPersonne = {
                prenom: identite[0],
                nom: identite[1],
                domaine: personne[1],
            };
        } else {
            infosPersonne = {
                civilite: identite[0],
                nom: identite[1],
                adresse: personne[1],
            };
        }

        // Extraction des interventions
        let header = this.planning.shift();
        header = header.split(';');
        let donnees = this.planning.join(';');
        donnees = donnees.split(';');

        let nbJours = header.length;
        let nbCreneaux = donnees.length / nbJours;
        let dureeCreneau =1440/nbCreneaux;
        let interventionList = [];
        let interventionPrecedente = {};

        for (let i = 0; i < donnees.length; i++) {
            let indexJour = i % nbJours;
            let heureMinutes = (Math.trunc(i / nbJours)) * dureeCreneau; //i=0 h=0 i=1 h=30 i=2 h=60
            if (donnees[i] !== 'vide') {
                // Extraction de l'intervention
                let intervention = {
                    jour: header[indexJour],
                    intervention: donnees[i],
                    heureDebut: heureMinutes,
                    heureFin: heureMinutes + dureeCreneau,
                    //typeIntervention: this.type,
                };
                let separator2 = /\r\n|\(|\)/;
                let identiteIntervention = donnees[i].split(separator2);

                if (this.type === 'i') {
                    let nom = identiteIntervention[0].split(". ");
                    let adresse = identiteIntervention[1];
                    let beneficiaire = {
                        civilite: nom[0],
                        nom: nom[1],
                        adresse: adresse,
                    };
                    intervention["intervenant"] = infosPersonne;
                    intervention["beneficiaire"] = beneficiaire;
                } else {
                    let intervenant = {};
                    let nom = identiteIntervention[1].split(". ");
                    let fonction = identiteIntervention[0];
                    if (nom.length === 1) {
                        intervenant = {
                            nom: nom[0],
                            fonction: fonction,
                        }
                    } else {
                        intervenant = {
                            prenom: nom[0],
                            nom: nom[1],
                            fonction: fonction,
                        };
                    }
                    intervention["intervenant"] = intervenant;
                    intervention["beneficiaire"] = infosPersonne;
                }

                /*

                 */
                if (interventionPrecedente[indexJour] !== undefined
                    && intervention["heureDebut"] === interventionPrecedente[indexJour]["heureFin"]
                    && donnees[i] === interventionPrecedente[indexJour]["intervention"]) {

                        interventionPrecedente[indexJour]["heureFin"] = interventionPrecedente[indexJour]["heureFin"] + dureeCreneau;
                        //  Modifier l'intervention existante dans interventionList, accéder à la bonne intervention grâce à l'index?
                        let obj = interventionList.findIndex(function (obj) {
                            return obj.intervention === donnees[i];

                    });
                    interventionList[obj]["heureFin"] = intervention["heureFin"];
                } else {
                    interventionList.push(intervention);
                }
                interventionPrecedente[indexJour] = intervention;
            }
        }
        //console.log(interventionList);

        if (this.type === 'i') {
            this.typePersonne = "Intervenant";
        } else {
            this.typePersonne = "Bénéficiaire";
        }

        let typePlanning = "type";
        this._planningJson[typePlanning] = this.typePersonne;
        this._planningJson[this.typePersonne] = infosPersonne;
        this._planningJson["interventions"] = interventionList;
    }

    //Convert a json object to an array
    json2array(json){
        let result = [];
        let keys = Object.keys(json);
        keys.forEach(function(key){
            result.push(json[key]);
        });
        return result;
    }

    jsonToICal(){

    }

    verifyFormat(file){
    }

    convertToICal(planJSon){

    }
}

module.exports = csvToICalParser;




