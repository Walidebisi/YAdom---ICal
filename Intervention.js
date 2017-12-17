class Intervention {
    constructor(heureDebut, heureFin, jour, intervenant, beneficiaire){
        this._heureDebut = heureDebut;
        this._heureFin = heureFin;
        this._jour = jour;
        this._intervenant = intervenant;
        this._beneficiaire = beneficiaire;
    }

    get heureDebut() {
        return this._heureDebut;
    }

    set heureDebut(value) {
        this._heureDebut = value;
    }

    get heureFin() {
        return this._heureFin;
    }

    set heureFin(value) {
        this._heureFin = value;
    }

    get jour() {
        return this._jour;
    }

    set jour(value) {
        this._jour = value;
    }

    get intervenant() {
        return this._intervenant;
    }

    set intervenant(value) {
        this._intervenant = value;
    }

    get beneficiaire() {
        return this._beneficiaire;
    }

    set beneficiaire(value) {
        this._beneficiaire = value;
    }


//Fonction utilisée pour passer les heures minutes en une chaine hhmm
    minutesToHeures(heure){
        let horaire = heure/60;
        if (horaire < 10){
            horaire = horaire.toString().split(".");
            horaire[0] = "0" + horaire[0];
        }
        else {
            horaire = horaire.toString().split(".");
        }
        let heures = horaire[0];
        //console.log('heures:' + heures);
        let minutes = horaire[1];
        if (minutes === '5'){
            minutes = "30";
        } else {
            minutes = "00";
        }
        //console.log('minutes:' + minutes);
        let hhmm = "" + heures + "h" + minutes ;
        return hhmm;
    }

//Fonction utilisée pour transformer les heures au format HHhMM en heures minutes
    horaireMinutes(heure){
        let horaire = heure.split("h");
        heure = 60*parseInt(horaire[0]) + parseInt(horaire[1]);
        return heure
    }

    displayIntervention(){
        console.log(this.jour, this.minutesToHeures(this.heureDebut), "-", this.minutesToHeures(this.heureFin)
            + ": " + this.intervenant.fonction, "par", this.intervenant.prenom, this.intervenant.nom);
    }

}

module.exports = Intervention;