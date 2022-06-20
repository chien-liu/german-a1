function createNullTable(id, nrow, ncol) {
    // prototype function
    table = document.getElementById(id);

    for (let i = 0; i < nrow; i++) {
        const tr = table.insertRow();
        for (let j = 0; j < ncol; j++) {
            const td = tr.insertCell();
            td.appendChild(document.createTextNode(`Cell I${i}/J${j}`));
        }
    }
}

function createTable(data, table_id, blank_col = []) {
    const headers = data["headers"];
    const arr = data["arr"];
    const table = document.getElementById(table_id);
    
    // flush table
    table.innerHTML="" ;
    
    // print headers
    const tr = table.insertRow();
    for (let j = 0; j < headers.length; j++) {
        const td = tr.insertCell();
        td.appendChild(document.createTextNode(headers[j]));
        td.style.fontWeight = "bold";
    }

    // print content rows
    for (let i = 0; i < arr.length; i++) {
        const tr = table.insertRow();
        for (let j = 0; j < headers.length; j++) {
            const td = tr.insertCell();
            if (blank_col.includes(headers[j])) {
                const input = document.createElement('input');
                input.type = "text";
                input.size = 10;
                input.id = table_id + "_" + i.toString() + "_" + j.toString();
                input.onblur = function () { compareAnswer(input.id, arr[i][j]) };
                td.appendChild(input);
            } else {
                td.appendChild(document.createTextNode(arr[i][j]));
            }
        }
    }
}

function getGermanVerbData(shuffle = true) {
    const url =
        "https://raw.githubusercontent.com/chien-liu/german-a1/main/tables/perfekt.csv";
    var request = new XMLHttpRequest();

    request.onload = function () {
        var reader = new FileReader();
        reader.readAsText(request.response);
        reader.onload = function (e) {
            const text = e.target.result;
            const data = csvToArray(text, shuffle);
            createTable(data, id = "perfekt_test", blank_col = ["perfekt", "hat / ist"]);
            createTable(data, id = "perfekt_answer");
        };
    };
    request.open("GET", url, true);
    request.responseType = "blob";
    request.send();
}

function getArticleData(shuffle = false) {
    const url =
        "https://raw.githubusercontent.com/chien-liu/german-a1/main/tables/article.csv";
    var request = new XMLHttpRequest();

    request.onload = function () {
        var reader = new FileReader();
        reader.readAsText(request.response);
        reader.onload = function (e) {
            const text = e.target.result;
            const data = csvToArray(text, shuffle);
            createTable(data, id = "article_test", blank_col = ["Nom", "Akk", "Dat"]);
            createTable(data, id = "article_answer");
        };
    };
    request.open("GET", url, true);
    request.responseType = "blob";
    request.send();
}


function getPronomenData(shuffle = false) {
    const url =
        "https://raw.githubusercontent.com/chien-liu/german-a1/main/tables/pronomen.csv";
    var request = new XMLHttpRequest();

    request.onload = function () {
        var reader = new FileReader();
        reader.readAsText(request.response);
        reader.onload = function (e) {
            const text = e.target.result;
            const data = csvToArray(text, shuffle);
            createTable(data, id = "pronomen_test", blank_col = ["Akk", "Dat"]);
            createTable(data, id = "pronomen_answer");
        };
    };
    request.open("GET", url, true);
    request.responseType = "blob";
    request.send();
}

function csvToArray(str, shuffle, delimiter = ",") {
    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter).map(function (str) {
        return str.trim();
    });

    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf("\n") + 1).split("\n").filter(String);
    // Map the rows
    // split values from each row into an array
    var arr = rows.map(function (row) {
        const el = row.split(delimiter);
        const elTrim = el.map(function (str) {
            return str.trim();
        });
        return elTrim;
    });



    if (shuffle) {
        shuffleArray(arr);
    }
    // return headers and array
    return { headers, arr };
}

function shuffleArray(array) {
    array.sort(() => Math.random() - 0.5);
}

function compareAnswer(id, answer) {
    const input = document.getElementById(id);

    if (input.value == answer) {
        input.style.color = "green";
    } else {
        input.style.color = "red";
    }
    input.style.fontWeight = "bold";
}
