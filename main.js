/*
====================================================Fichier Main de la librairie========================================================================
===================================permet d'accéder aux différentes fonctions et offre une interface====================================================
========================================================================================================================================================
*/
let colors = require('colors');
const main = require('caporal');
let Planning = require('./Planning');
let Personne = require('./Personne');
let PlanningList = require('./PlanningList');
let csvToICalParser = require('./csvToICalParser');
let Intervention = require('./Intervention');
let fs = require('fs');

console.log("===============================================".blue);
console.log("======Bienvenue dans la librairie YAdom========".blue);
console.log("===============================================".blue);
console.log("Que souhaitez-vous faire?".green)

main
    .version('1.0.0')
    .description('Librairie permettant de manipuler les plannings de YAdom!')


    .command('AddPlanning', 'Ajoute un planning vide')
    .argument('<typePersonne>', 'Ecrire "i" pour intervenant ou "b" pour bénéficiaire')
    .action(function (args, options) {
        /*
        Entrer les infos de la personne
        Creer une nouvelle Personne et l'ajouter à la liste des Personnes
        Créer un nouveau Planning et l'ajouter à la liste des planning
        Créer un affichage en objet
        Dire que le planning a été crée
        TODO vérifier que le planning n'est pas déjà dans la liste
         */
        if (args.typePersonne === ('i')) {
            process.stdin.setEncoding('utf8');
            let infos;
            console.log("Entrez les informations de l'intervenant: <nom> <prenom> <domaine>");
            infos = process.stdin.read();
            process.stdin.on('readable', function () {
                infos = process.stdin.read();
                if (infos !== null/*TODO vérifier que les 3 champs sont entrés */) {
                    let separator = /\n| /;
                    infos = infos.split(separator);
                    // Créer une nouvelle personne et l'ajouter à la liste des intervenants
                    //TODO vérifier que la personne n'existe pas déjà
                    let intervenant = new Personne.intervenant(infos[0], infos[1], infos[2]);
                    let plan = new Planning('Intervenant', intervenant, []);
                    let planningList = new PlanningList('./planningIntervenants.json');
                    planningList.addPlanning(plan);
                    planningList.saveList();
                    process.exit();
                } else {
                    console.log("Les informations entrées sont éronées, veuillez réessayer!");
                }
            });
        } else if (args.typePersonne === ('b')) {
            process.stdin.setEncoding('utf8');
            var infos;
            console.log("Entrez les informations du bénéficiare: <civilite>: M ou Mme <nom> <adresse>: séparer les champs de l'adresse par'_'");
            infos = process.stdin.read();
            process.stdin.on('readable', function () {
                infos = process.stdin.read();
                if (infos !== null) {
                    let separator = /\n| /;
                    infos = infos.split(separator);
                    // Créer une nouvelle personne et l'ajouter à la liste des bénéficiaires
                    let beneficiaire = new Personne.beneficiaire(infos[0], infos[1], infos[2].replace("_", " "));
                    let plan = new Planning('Benenficiaire', beneficiaire, []);
                    let planningList = new PlanningList('./planningBeneficiaires.json');
                    planningList.addPlanning(plan);
                    planningList.saveList();
                    process.exit();
                } else {
                    console.log("Les informations entrées sont éronées, veuillez réessayer!");
                }
            })
        } else {
            console.log("Le type de planning n'a pas été reconnu, veuillez réessayer!");
        }

    })

    .command('SupprPlanning', 'Supprime un planning')
    .argument('<typePersonne>', "'i' ou 'b'")
    .argument('<nom>', 'Nom de la personne dont on souhaite supprimer le planning')
    .action(function (args, options) {
        let fileName = '';
        let fileName2 = '';
        if (args.typePersonne === 'i') {
            fileName = './planningIntervenants.json';
            fileName2 = './planningBeneficiaires.json';
        } else if (args.typePersonne === 'b') {
            fileName = './planningBeneficiaires.json';
            fileName2 = './planningIntervenants.json';
        } else {
            console.log("Vous avez entré un mauvais type de personne!");
        }
        let planningList = new PlanningList(fileName);
        let planningList2 = new PlanningList(fileName2);
        let obj = planningList.list.findIndex(function (obj) {
            return obj["_personne"]._nom === args.nom;
        });
        if (obj === -1) {
            console.log("Il n'existe de pas de planning lié à ce nom! Veuillez réessayer!");
        } else {
            planningList2.deleteInterventions(args.nom);
            planningList.deletePlanning(obj);
            planningList.saveList();
        }

    })

    .command('ModifyInfos', 'Modifie les paramètres d un planning')
    .argument('<typePersonne>', 'i ou b')
    .argument('<nomPersonne>', 'Nom de la personne dont on souhaite modifier les interventions')
    .action(function (args, options) {
            if (args.typePersonne === 'i') {
                process.stdin.setEncoding('utf8');
                let infos;
                console.log("Entrez les nouvelles informations de l'intervenant: <nom> <prenom> <domaine>");
                infos = process.stdin.read();
                process.stdin.on('readable', function () {
                    infos = process.stdin.read();
                    if (infos !== null) {
                        let separator = /\n| /;
                        infos = infos.split(separator);
                        // Créer une nouvelle personne et l'ajouter à la liste des intervenants
                        //TODO vérifier que la personne n'existe pas déjà
                        let planningList = new PlanningList('./planningIntervenants.json');
                        let obj = planningList.list.findIndex(function (obj) {
                            return obj["_personne"]._nom === args.nomPersonne;
                        });
                        planningList.list[obj]["_personne"] = {
                            _nom: infos[0],
                            _prenom: infos[1],
                            _domaine: infos[2],
                        };
                        planningList.saveList();
                    }
                    process.exit();
                });
            }
            else if (args.typePersonne === 'b') {
                process.stdin.setEncoding('utf8');
                let infos;
                console.log("Entrez les nouvelles informations du beneficiaire: <civilite>:M ou Mme <nom> <adresse>: séparer les champs de l'adresse par'_'");
                infos = process.stdin.read();
                process.stdin.on('readable', function () {
                    infos = process.stdin.read();
                    if (infos !== null) {
                        let separator = /\n| /;
                        infos = infos.split(separator);
                        // Créer une nouvelle personne et l'ajouter à la liste des intervenants
                        //TODO vérifier que la personne n'existe pas déjà
                        let planningList = new PlanningList('./planningBeneficiaires.json');
                        let obj = planningList.list.findIndex(function (obj) {
                            return obj["_personne"]._nom === args.nomPersonne;
                        });
                        planningList.list[obj]["_personne"] = {
                            _civilite: infos[0],
                            _nom: infos[1],
                            _adresse: infos[2],
                        };
                        planningList.saveList();
                    }
                    process.exit();
                });
            } else {
                console.log("Le type de planning n'a pas été reconnu, veuillez réessayer!");
            }

        }
    )

    .command('AddIntervention', 'Ajoute une intervention à un couple de plannings')
    .argument('<nomBeneficiaire>', 'le nom du bénéficiaire demandant une intervention')
    .argument('<nomIntervenant>', "Nom de l'intervennant")
    .argument('<jour>', 'le jour où ajouter l\'intervention')
    .argument('<heureDebut>', 'l\'heure de début où ajouter l\'intervention format: exemple 10h30')
    .argument('<heureFin>', 'l\'heure de fin où ajouter l\intervention')
    .action(function (args, options) {

        let planningInter = new PlanningList('./planningIntervenants.json');
        let planningBenef = new PlanningList('./planningBeneficiaires.json');

        let indexInt = planningInter.list.findIndex(function (obj) {
            console.log(obj);
            return obj._personne._nom === args.nomIntervenant;
        });
        console.log(indexInt);
        //TODO : Vérifier lors de l'import csv, de créer un objet personne
        let indexBenef = planningBenef.list.findIndex(function (obj) {
            return obj._personne._nom === args.nomBeneficiaire;
        });
        console.log(indexBenef);
        let intervention = new Intervention(args.heureDebut, args.heureFin, args.jour, planningInter.list[indexInt]._personne,
            planningBenef.list[indexBenef]._personne);
        let planInter = new Planning(planningInter.list[indexInt]._type, planningInter.list[indexInt]._personne, planningInter.list[indexInt]._interventionsList);
        let planBenef = new Planning(planningBenef.list[indexBenef]._type, planningBenef.list[indexBenef]._personne, planningBenef.list[indexBenef]._interventionsList);
        let heureDebut = intervention.horaireMinutes(args.heureDebut);
        let heureFin = intervention.horaireMinutes(args.heureFin);
        intervention.heureDebut = heureDebut;
        intervention.heureFin = heureFin;
        planInter.addIntervention(intervention);
        planBenef.addIntervention(intervention);
        planningBenef.list[indexBenef] = planBenef;
        planningInter.list[indexInt] = planInter;
        planningBenef.saveList();
        planningInter.saveList();
    })

    .command('SupprInter', 'supprime une intervention des 2 plannings concernés')
    .argument('<nom>', 'nom de la personne')
    .argument('<jour>', 'le jour où supprimer l\'intervention')
    .argument('<heureDebut>', 'l\'heure de début où supprimer l\'intervention')
    .argument('<type>', "type de personne : 'i' pour intervenant, 'b' pour beneficiaire")
    .action(function (args, options) {

        let planningBenef = new PlanningList('./planningBeneficiaires.json');
        let planningInter = new PlanningList('./planningIntervenants.json');

        if (args.type === 'i') {
            let indexInt = planningInter.list.findIndex(function (obj) {
                return obj._personne._nom === args.nom;
            });
            let planInter = new Planning(planningInter.list[indexInt]._type, planningInter.list[indexInt]._personne, planningInter.list[indexInt]._interventionsList);
            planInter.deleteIntervention(args.jour, args.heureDebut, "_intervenant");
            let indexBenef = planningBenef.list.findIndex(function (obj) {
                return obj._interventionsList._nom === args.nom;
            });
            let planBenef = new Planning(planningBenef.list[indexBenef]._type, planningBenef.list[indexBenef]._personne, planningBenef.list[indexBenef]._interventionsList)
            planBenef.deleteIntervention(args.jour, args.heureDebut, "_beneficiaire");
            planningInter.list[indexInt] = planInter;
            planningBenef.list[indexBenef] = planBenef;

        } else if (args.type === 'b') {
            let indexInt = planningBenef.list.findIndex(function (obj) {
                return obj["_personne"]._nom === args.nom;
            });
            let planBenef = new Planning(planningBenef.list[indexInt]._type, planningBenef.list[indexInt]._personne, planningBenef.list[indexInt]._interventionsList);
            planBenef.deleteIntervention(args.jour, args.heureDebut, "_beneficiaire");
            let indexBenef = planningInter.list.findIndex(function (obj) {
                return obj["_personne"]._nom === nomInter;
            });
            let planInter = new Planning(planningInter.list[indexBenef].type, planningInter.list[indexBenef]._personne, planningInter.list[indexBenef]._interventionsList);
            planInter.deleteIntervention(args.jour, args.heureDebut, "_intervenant");
            planningInter.list[indexInt] = planInter;
            planningBenef.list[indexBenef] = planBenef;
        }
        planningInter.saveList();
        planningBenef.saveList();
    })

    .command('ExporterPlanningCSV', 'Exporte un planning au format iCal')
    .argument('<fichier>', 'chemin du fichier à exporter (si fichier csv)')
    .argument('<typePersonne>', 'Ecrire "i" pour intervenant ou "b" pour bénéficiaire')
    .argument('[date]', 'date du début de la semaine écrite au format AAAAMMJJ')
    .action(function (args, options) {
        //    TODO convertir le csv en Json et convertir le jSon en fichier iCal sans l'ajouter à la liste des plannings

        //1 . On lit le fichier à l'aide du parser
        if (args.typePersonne === ('i')) {
            let importedPlanning = new csvToICalParser(args.fichier, args.typePersonne);
            importedPlanning.tokenize();
            importedPlanning.parseToJson();
            let planningJson = importedPlanning.planningJson;
            let planning = new Planning(planningJson["type"], planningJson[importedPlanning.typePersonne], planningJson["interventions"]);
            let fileName = planning.fileName();

            let arrayLength = planning.interventionsList.length;
            console.log('nombre dinterventions :' + planning.interventionsList.length);

            let interventionsAjouter = '';
            for (i = 0; i < arrayLength; i++) {
                var nbJourToAdd;
                switch (planning.interventionsList[i].jour) {
                    case "lundi" :
                        nbJourToAdd = 1;
                        break;

                    case "mardi" :
                        nbJourToAdd = 2;
                        break;

                    case "mercredi" :
                        nbJourToAdd = 3;
                        break;

                    case "jeudi" :
                        nbJourToAdd = 4;
                        break;

                    case "vendredi" :
                        nbJourToAdd = 5;
                        break;

                    case "samedi" :
                        nbJourToAdd = 6;
                        break;

                    case "dimanche" :
                        nbJourToAdd = 7;
                        break;
                }
                let inter = new Intervention (planning.interventionsList[i].heureDebut, planning.interventionsList[i].heureFin, planning.interventionsList[i].jour, planning.interventionsList[i].intervenant, planning.interventionsList[i].beneficiaire);
                interventionsAjouter = interventionsAjouter + 'BEGIN:VEVENT\n' +
                'DTSTART:' + '2018010' + nbJourToAdd + 'T' + inter.minutesToHeures(inter.heureDebut) + '00Z\n' +
                'DTEND:' + '2018010' + nbJourToAdd + 'T' + inter.minutesToHeures(inter.heureFin) + '00Z\n' +
                'SUMMARY: ' + planning.personne.domaine + '\n' +
                'LOCATION: ' + planning.interventionsList[i].beneficiaire.adresse + '\n' +
                'ATTENDEE: ' + planning.personne.nom + ', ' + planning.interventionsList[i].beneficiaire.nom + '\n' +
                'END:VEVENT\n';
            }

            fs.writeFile('Planning_' + planning.personne.nom,
                'BEGIN:VCALENDAR\n' +
                'VERSION:1.0\n' +
                'X-WR-CALNAME:Planning_' + planning.personne.nom + '\n' +
                interventionsAjouter +
                'END:VCALENDAR\n'
            );
        }
        else if (args.typePersonne === ('b')) {
            let importedPlanning = new csvToICalParser(args.fichier, args.typePlanning);
            importedPlanning.tokenize();
            importedPlanning.parseToJson();
            let planningJson = importedPlanning.planningJson;
            let planning = new Planning(planningJson["type"], planningJson[importedPlanning.typePersonne], planningJson["interventions"]);
            let fileName = planning.fileName();

            let interventionsAjouter = '';
            let arrayLength = planning.interventionsList.length;
            console.log('nombre dinterventions :' + planning.interventionsList.length);

            for (i = 0; i < arrayLength; i++) {
                var nbJourToAdd;
                switch (planning.interventionsList[i].jour) {
                    case "lundi" :
                        nbJourToAdd = 1;
                        break;

                    case "mardi" :
                        nbJourToAdd = 2;
                        break;

                    case "mercredi" :
                        nbJourToAdd = 3;
                        break;

                    case "jeudi" :
                        nbJourToAdd = 4;
                        break;

                    case "vendredi" :
                        nbJourToAdd = 5;
                        break;

                    case "samedi" :
                        nbJourToAdd = 6;
                        break;

                    case "dimanche" :
                        nbJourToAdd = 7;
                        break;
                }
                let inter = new Intervention (planning.interventionsList[i].heureDebut, planning.interventionsList[i].heureFin, planning.interventionsList[i].jour, planning.interventionsList[i].intervenant, planning.interventionsList[i].beneficiaire);
                interventionsAjouter = interventionsAjouter + 'BEGIN:VEVENT\n' +
                'DTSTART:' + '2018010' + nbJourToAdd + 'T' + inter.minutesToHeures(inter.heureDebut) + '00Z\n' +
                'DTEND:' + '2018010' + nbJourToAdd + 'T' + inter.minutesToHeures(inter.heureFin) + '00Z\n' +
                'SUMMARY: ' + planning.interventionsList[i].intervenant.domaine + '\n' +
                'LOCATION: ' + planning.personne.adresse + '\n' +
                'ATTENDEE: ' + planning.personne.nom + ', ' + planning.interventionsList[i].intervenant.nom + '\n' +
                'END:VEVENT\n'
            }


            fs.writeFile('Planning_' + planning.personne.nom, 
                'BEGIN:VCALENDAR\n' +
                'VERSION:1.0\n' +
                'X-WR-CALNAME:Planning_' + planning.personne.nom + '\n' +
                interventionsAjouter +
                'END:VCALENDAR\n'
            );
        }

    })


    .command('ComparerPlanning', 'compare entre eux plusieurs plannings au format Gdoc')
    .argument('<fichier>', 'chemin du fichier du bénévole à comparer')
    .argument('<jour>', 'le jour auquel vous souhaitez comparer')
    .argument('[fichier1]', 'chemin d\'un fichier à comparer avec le premier')
    .argument('[fichier2]', 'chemin d\'un fichier à comparer avec le premier')
    .argument('[fichier3]', 'chemin d\'un fichier à comparer avec le premier')
    .action(function (args, options) {

        google.charts.load('current', {'packages': ['timeline']});
        google.charts.setOnLoadCallback(drawChart);


        //on place les fichiers à traiter dans un tableau
        var tableauFichier = [args.fichier, args.fichier1, args.fichier2, args.fichier3];


        //on créé un tableau vide qui contiendra les fichiers parsé
        let tableauFichierParse = new Array();
        //on remplit le tableau des fichiers parsés
        let planning = new Array();
        for (i = 0; i < 3; i++) {
            tableauFichierParse[i] = new csvToICalParser(tableauFichier[i], args.typePlanning);
            tableauFichierParse[i].tokenize();
            tableauFichierParse[i].parseToJson();
            let planningJson = tableauFichierParse[i].planningJson;
            planning[i] = new Planning(planningJson["type"], planningJson[tableauFichierParse[i].typePersonne], planningJson["interventions"]);

        }


        //On assigne a une variable le fichier qui a le plus d'Interventions

        //On dessine un graphique GoogleCharts

        function drawChart() {
            var container = document.getElementById('timeline');
            var chart = new google.visualization.Timeline(container);
            var dataTable = new google.visualization.DataTable();

            //chaque intervention est associée à une personne et a une heure de début et de fin
            dataTable.addColumn({type: 'string', id: 'Nom Personne'});
            dataTable.addColumn({type: 'date', id: 'Start'});
            dataTable.addColumn({type: 'date', id: 'End'});

            //on examine chaque fichier parsé
            for (var i = 0; i < 3; i++) {
                //à chaque intervention du fichier contenue dans le jour choisi par l'utilisateur
                planning[i].interventionsList.forEach(function (plan) {
                    let indices = [];
                    let indexes = plan._interventionsList.indexOf(args.jour);
                    while (indexes != -1) {
                        indices.push(indexes);
                        indexes = plan._interventionsList.indexOf(args.jour, indexes + 1);
                    }
                    for (let k = 0; k < indices.length; k++) {
                        dataTable.addRows([
                            [planning[i].nom,
                                new Date(0, 0, 0, planning[i].interventionsList[indices[k]].minutesToHeures(heureDebut).tabHoraire[0], planning[i].interventionsList[indices[k]].minutesToHeures(heureDebut).tabHoraire[1], 0),
                                new Date(0, 0, 0, planning[i].interventionsList[indices[k]].minutesToHeures(heureFin).tabHoraire[0], planning[i].interventionsList[indices[k]].minutesToHeures(heureFin).tabHoraire[1], 0)]])
                    }
                })
                //on ajoute une intervention pour la personne i.


            }
            chart.draw(dataTable);

        }


    })

    .command('ImportPlanning', 'Importer un planning au format csv')
    .argument('<planningcsv>', 'Fichier contenant un planning au format csv')
    .argument('<typePlanning>', "Type de personne: 'i' pour intervenant, 'b' pour bénéficiaire")
    .action(function (args, options) {

        // Convertir le planning csv en format Json
        let importedPlanning = new csvToICalParser(args.planningcsv, args.typePlanning);
        importedPlanning.tokenize();
        importedPlanning.parseToJson();
        let planningJson = importedPlanning.planningJson;

        //créer un objet personne, un objet planning, un objet intervention pour chaque intervention
        let personne = global["Personne.",planningJson.typePersonne]("sadaoui", "walid", "foot");
        console.log(personne);

        //Gijs
        // let importedPlanning = new csvToICalParser(args.planningcsv, args.typePlanning);
        // importedPlanning.tokenize();
        // importedPlanning.parseToJson();
        // let planningJson = importedPlanning.planningJson;
        // console.log("Plan", planningJson);
        //
        // let planning = new Planning(planningJson["type"], planningJson[importedPlanning.typePersonne], planningJson["interventions"]);
        // let fileName = planning.fileName();
        // let planningList = new PlanningList(fileName);
        // planningList.addPlanning(planning);
        // planningList.saveList();
        // // TODO ajouter les interventions aux plannings
        // let type = '';
        // if (args.typePlanning === 'i') {
        //     planningList = new PlanningList('./planningBeneficiaires.json');
        //     type = "beneficiaire";
        // } else {
        //     planningList = new PlanningList('./planningIntervenants.json');
        //     type = "intervenant";
        // }
        //
        // planning.interventionsList.forEach(function (intervention) {
        //     let index = planningList.list.findIndex(function (obj) {
        //         return obj._personne.nom === intervention[type].nom;
        //     });
        //     let inter = new Intervention(intervention.heureDebut, intervention.heureFin, intervention.jour, intervention.intervenant, intervention.beneficiaire);
        //     if (index !== -1) {
        //         planningList.list[index]._interventionsList.push(inter);
        //     }
        // });
        // planningList.saveList();
    });
main.parse(process.argv);

