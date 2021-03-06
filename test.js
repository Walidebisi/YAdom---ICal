let csvParser = require('./csvToICalParser');
let Personne = require('./Personne');
let Beneficiaire = require('./Beneficiaire');
let Intervenant = require('./Intervenant');
let Intervention =require('./Intervention');
let Planning = require('./Planning');
let PlanningList = require('./PlanningList');

let analyzer = new csvParser('./Samples/S20_Dom_Dupont.csv', 'b');
analyzer.tokenize();
analyzer.parseToJson();
let plan = analyzer.planningJson;
let infos = analyzer.json2array(plan[analyzer.typePersonne]);
let personne = new Personne(infos[1], infos[0], infos[2], analyzer.type);
personne = personne.createPersonne();
console.log(personne);
let interventionsList = [];
plan.interventions.forEach(function(element){
 let intervention = new Intervention(element.heureDebut, element.heureFin, element.jour, element.intervenant, element.beneficiaire);
 interventionsList.push(intervention);
});
// console.log(interventionsList);
let planning = new Planning(plan.type, personne, interventionsList);
planning.displayInterventions();
/*
J'ai besoin:
 - une planningList d'intervenants
 - une planningList de beneficiaires
 - une intervenantsList
 - une beneficiairesList
 */