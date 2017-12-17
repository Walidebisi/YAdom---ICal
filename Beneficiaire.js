class Beneficiaire  {
    constructor(nom, civilite, adresse) {
        this._nom = nom;
        this._civilite = civilite;
        this._adresse = adresse;
    }
    get nom(){
        return this._nom;
    }

    set nom(nom){
        this._nom=nom;
    }

    get adresse(){
        return this._adresse;
    }

    set adresse(adresse){
        this._adresse=adresse;
    }

    get civilite(){
        return this._civilite;
    }

    set civilite(civilite){
        this._civilite=civilite;
    }
}

module.exports = Beneficiaire;