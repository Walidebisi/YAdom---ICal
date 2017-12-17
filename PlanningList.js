let fs = require('fs');

class PlanningList {
    constructor(fileName) {
        this.fileName = fileName;
        this.listJson = fs.readFileSync(fileName, 'utf8');
        this.list = JSON.parse(this.listJson);
    }

    addPlanning(planning) {
        this.list.push(planning);
    }

    updatePlanning(planning) {

    }

    deleteInterventions(nom){
        this.list.forEach(function(plan){
            plan.deleteIntervention(nom);
        })
    }
    showList(){
        /*
        TODO Faire un affichage type intervenant: "Planning de 'nom' : 'jour' 'heureDebut-heureFin' chez 'nom_bénéficiaire' 'adresse'
        TODO Faire un affichage type bénéficiare: "Planning de 'nom' : 'jour' 'heureDebut-heureFin' 'type_intervention' par 'nom_intervenant'
         */
        this.list.forEach(function (element) {
            console.log(element.showPlanning());
        })
    }

    saveList() {
        let listString = JSON.stringify(this.list);
        //console.log(listString);
        fs.writeFileSync(this.fileName, listString, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("File Saved!");
        })
    }

    deletePlanning(index){
        this.list.splice(index, 1);
    }

    deleteInterventions(nom){
        this.list.forEach(function(plan){
            let indices = [];
            let indexes = plan._interventionsList.indexOf(nom);
            while (indexes != -1){
                indices.push(indexes);
                indexes = plan._interventionsList.indexOf(nom, indexes + 1);
            }
            for (let i = 0; i < indices.length; i++){
                plan._interventionsList.slice(indices[i], 1);
            }
        })

    }
/*
Pour chaque intervention du planning ajouté creer une nouvelle inter puis cherche le nom du benef
dans l'autre liste de planning le créer si il existe pas  et ajoute l'inter dans son planning
Pour chaque planning, check la liste d'intervention si tu trouves le nom de l'autre
Pour chaque intervention où tu trouve le nom
 */
    addInterventions(nom){
        this.list.forEach(function(plan){
            let indices = [];
            let indexes = plan._interventionsList.indexOf(nom);
            while (indexes != -1){
                indices.push(indexes);
                indexes = plan._interventionsList.indexOf(nom, indexes + 1);
            }
            for (let i = 0; i < indices.length; i++){
                plan._interventionsList.push();
            }
        })

    }

    clearList(){
        let brackets = [];
        fs.writeFileSync(this.fileName, brackets, function (err) {
            if (err) {
                console.log(err);
            }
        })
    }
}

module.exports = PlanningList;