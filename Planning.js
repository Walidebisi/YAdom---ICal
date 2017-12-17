var personne = require('./Personne')
var intervention = require('./Intervention')

//var parser = require('./csvToICalParser')


class Planning {
    constructor(type, personne, interventions) {
        this._personne = personne;
        //intervenant ou bénéficiaire
        this._type = type;
        if (!arguments.length) {
            this._interventionsList = [];
        } else {
            this._interventionsList = interventions;
        }
    }


    get type() {
        return this._type;
    }

    set type(type) {
        this._type = type;
    }

    get personne() {
        return this._personne;
    }

    set personne(personne) {
        this._personne = personne;
    }

    get interventionsList() {
        return this._interventionsList;
    }

    fileName() {
        let fileName = '';
        if (this.type === 'i') {
            fileName = './Database/planningIntervenants.json';
        } else {
            fileName = './Database/planningBeneficiaires.json';
        }
        return fileName;
    }

    deleteIntervention(jour, heureDebut, type) {
        let index = this.interventionsList.findIndex(function (obj) {
            console.log(obj);
            return (obj._jour == jour && obj._heureDebut == heureDebut);
        });
        console.log(index);
        let nom = this.interventionsList[index][type]._nom;
        this.interventionsList.splice(index, 1);
        return nom;
    }

    addIntervention(intervention) {
        console.log(this._interventionsList);
        this._interventionsList.push(intervention);
    }

    displayInterventions(){
        this.interventionsList.forEach(function(element){
            element.displayIntervention();
        })
    }

    showPlanning() {
        console.log("Planning ", this._personne.civilite, ".", this._personne.nom, "-- ", this._personne.adresse);
        this._interventionsList.forEach(function (intervention) {
            console.log(intervention)
        })
    }

}

module.exports = Planning;
