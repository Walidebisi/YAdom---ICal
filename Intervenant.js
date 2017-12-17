class Intervenant {
    constructor(nom, prenom, domaine) {
        this._nom = nom;
        if (!arguments.length) {
            this._prenom = "";
        }
        this._prenom = prenom;
        this._domaine = domaine;
    }

    get nom() {
        return this._nom;
    }

    set nom(nom) {
        this._nom = nom;
    }

    get prenom() {
        return this._prenom;
    }

    set prenom(prenom) {
        this._prenom = prenom;
    }

    get domaine() {
        return this._domaine;
    }

    set domaine(domaine) {
        this._domaine = domaine;
    }

}

module.exports = Intervenant;