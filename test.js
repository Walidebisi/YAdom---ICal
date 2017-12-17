let csvParser = require('./csvToICalParser');
let Personne = require('./Personne');
let Beneficiaire = require('./Beneficiaire');
let Intervenant = require('./Intervenant');
let Intervention = require('./Intervention');
let Planning = require('./Planning');
let PlanningList = require('./PlanningList');

/*
Importer un Planning CSV
 */

// Conversion en json
let analyzer = new csvParser('./Samples/S20_Int_Demaison.csv', 'i');
analyzer.tokenize();
analyzer.parseToJson();
let plan = analyzer.planningJson;
let infos = analyzer.json2array(plan[analyzer.typePersonne]);

// Creation de la personne
let personne = new Personne(infos[1], infos[0], infos[2], analyzer.type);
personne = personne.createPersonne();

//Ajout des interventions dans la liste de la personne
let interventionsList = [];
plan.interventions.forEach(function (element) {
    let intervention = new Intervention(element.heureDebut, element.heureFin, element.jour, element.intervenant, element.beneficiaire);
    interventionsList.push(intervention);
});

// Creation du planning
let planning = new Planning(plan.type, personne, interventionsList);

// Affichage des interventions
// planning.displayInterventions();
// console.log(interventionsList[0]);
/*
Ajout des interventions dans les autres plannings
TODO Gérer les conflits
 */
interventionsList.forEach(function (intervention) {
    let planInter = new Planning(analyzer.typeInter, intervention[analyzer.typePersonneInter], []);
    let fileName = planInter.fileName();
    let planListInter = new PlanningList(fileName);
    console.log(planInter);
    let index = planListInter.list.indexOf(planInter.personne.nom);
    if (index === -1){
        planInter.addIntervention(intervention);
        planListInter.addPlanning(planInter);
    } else {
        planListInter.list[index].interventionsList.push(intervention);
    }
    planListInter.saveList();
});


// Ajout du planning à la liste des plannings
let fileName = planning.fileName();
let planList = new PlanningList(fileName);
planList.addPlanning(planning);
planList.saveList();
/*
J'ai besoin:
 - une intervenantsList
 - une beneficiairesList
 */