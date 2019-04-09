// Budget Controller
var budgetController = (function () {
    // Some Code
    // Définition des variables a récupéré 
    var Expense = function (id, description, value) {
        // value add or del
        this.id = id;
        // value description
        this.description = description;
        //  value Value (nombre)
        this.value = value;
    };
    // Définition des variables a récupéré 
    var Income = function (id, description, value) {
        // value add or del
        this.id = id;
        // value description
        this.description = description;
        //  value Value (nombre)
        this.value = value;
    };

    // generation du calcul (ToTal)
    var calculateTotal = function(type) {
        var sum = 0;
        // recupération de toute les data (Value) incrementer par l'Ut
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;

        /*
        Representation imagé de la function calculateTotal (ForEach)
        depart de la valeur par default à :
        0
        ensuite analyse du tableau [type] :
        [200, 400, 100]
        sum = 0 + 200
        sum = 200 + 400
        sum = 600 + 100 = 700    
        */

    }

    // définition des tableau a agrémenté des Value 
    var allExpenses = [];
    var allIcomes = [];
    // definition à 0 pour que le tableau s'agrémente au fur a mesur (+1)
    var totalExpenses = 0;
    // definition des tableau value (à incrementer) (par default)
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        // definition des resultats de valeurs suivant value (par default)
        totals: {
            exp: 0,
            inc: 0
        },
        // definittion par default du budget
        budget: 0,
        // commencer a -1 (100 - 100 = 0%)
        percentage: -1
    };

    // Gestion de la suite de caractere type, des, val
    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            // [1 2 3 4 5], next ID = 6
            // [1 2 4 6 8], next ID = 9
            // ID = lastID + 1

            // creat new ID 
            // creation et ajout de l'item dans un tableau
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            // ID = 0 (Par default)
            } else { 
                ID = 0;
            }

            // create new item based on 'inc' or 'exp' type
            // creation nouvelle item en "inc" ou "exp" = type
            // condition exp / inc (l'un ou l'autre) pour ajouter et calculer suivant le tableau
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            // push it into our data structure
            // metode push de rentré l item dans le tableau pour la base de donnée
            data.allItems[type].push(newItem);
            // return the new element
            // revoie le nouvelle item dans le tableau
            return newItem;
        },

        calculateBudget: function() {

            // calculate total income expense
            // calcul du total + / -
            calculateTotal('inc');
            calculateTotal('exp');

            // calculate the budget: income - expense
            // calcule de la difference + / -
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the % of income that we spent
            // calcule du % de difference en + / -
            if (data.totals.inc > 0) {
            data.percentage = Math.round ((data.totals.exp / data.totals.inc) * 100);
            }
            // calcule du % en negatif
            else {
                data.percentage = -1;
            } 

            // Expense = 100 & income 300, spent 33.333 = 100/300 = 0.3333 * 100

        },
        // recupération du resultat de la function calculate budget
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }
    };

    // TEST A EFFACE ***
    // var x = 23;
    // var add = function(a) {
    //     return x + a;
    // }
    // return {
    //     publicTest: function(b) {
    //         return add(b);
    //     }
    // }
})();

// UI Controller
var UIController = (function () {
    // inscription des value (obj)
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
    };
    // Some Code
    return {
        // récupération des valeurs
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, 
                // will be either inc or exp (ajouter la valeur + ou -)
                description: document.querySelector(DOMstrings.inputDescription).value,
                // will be either description ( ajouter la description)
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) 
                // will be either value (ajouter la valeur)
            };
        },
        // DOM changement de l'html suivant la value inseré par L'Utilisateur
        addListItem: function(obj, type) {
            var html, newHtml, element;
            //  create string with placeholder text
            // recuperation de l'html pour y mettre les atribue value
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // recuperation de l'html pour y mettre les atribue value
            else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //  replace placeholder text with some actual data
            // remplacement du html par le dom value ID
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            // atribution du DOM a element pour le newHTML
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            var fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            fieldsArr[0].focus();
        },
        
        //DOM Label titre definition des atribues (haut de page) 
        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = percentage + '%';
            }
            else {
                document.querySelector(DOMstrings.percentageLabel).textContent = percentage = '---';
            }
        },

        // ajouter les valeurs (console)
        getDOMstrings: function () {
            return DOMstrings;
        }
    }

})();

// Global app controller
var controller = (function (budgetCtrl, UICtrl) {
    var setupEventListeners = function () {
        // recuperation DOM (console)
        var DOM = UICtrl.getDOMstrings();
        // controle de la recuperation avec le boutton
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {

            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();

                // TEST A EFFACE ***
                // console.log('Enter was pressed ( la touche entré a été appuyé'); 
            }

            // TEST A EFFACE ***
            // console.log(event);
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };

    var updateBudget = function() {
        // 1. Calculate the budget
        // calcul du budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        //  renvoie de la valeur budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget
        // affichage du budget 
        UICtrl.displayBudget(budget);
        // console.log(budget);

    };

    var ctrlAddItem = function() {
        var input, newItem;

        // 1. get the field input data
        // inscription des données
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

        // TEST A EFFACE ***
        // console.log(input);
        // 2. add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        
        // 4. Clear the fields
        UICtrl.clearFields();

        // 5. Calculate & update the budget
        updateBudget();

        // 6. display the budget on the UI

        // TEST A EFFACE ***
        // console.log('It Work. (au boulot)');
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode,id;
        
        if(itemID) {
            // inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = splitID[1];

            // 1. delete the item from the data structure


            // 2. delete the item from UI


            // 3. Update and the show the new budget

            
        }

    };

    // TEST A EFFACE ***
    // var z = budgetCtrl.publicTest(5);
    // return {
    //     anotherPublic: function() {
    //         console.log(z);
    //     }
    // }

    return {
        init: function () {
            console.log("Aplication has started. (Démarrage de l'application");
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();

/*
À retenir :

-- 1. Toujour bien choisir les atribue de valeur (var, const, let, function, ...)( /!\ au Majuscule & Ponctuation ).
-- 2. Avoir un plan du site (back, front) en tête bien structuré !!
-- 3. Avoir les bonnes appli lié a l'editeur de texte (Visual studio).
-- 4. 
*/