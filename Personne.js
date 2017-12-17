let Intervenant = require('./Intervenant');
let Beneficiaire = require('./Beneficiaire');

class Personne {
    constructor (nom, identite, info, type){
        this._nom = nom;
        this._identite = identite;
        this._info = info;
        this._type = type;
    }

    get nom(){
        return this._nom;
    }

    set nom(nom){
        this._nom=nom;
    }

    get identite() {
        return this._identite;
    }

    set identite(identite) {
        this._identite = identite;
    }


    get type() {
        return this._type;
    }

    set type(type) {
        this._type = type;
    }

    get info() {
        return this._info;
    }

    set info(info) {
        this._info = info;
    }

    createPersonne(){
        let personne;
        if (this.type === "i"){
            personne = new Intervenant(this._nom, this._identite, this._info);
        } else {
            personne = new Beneficiaire(this._nom, this._identite, this._info);
        }
        return personne;
    }
}

module.exports = Personne;

