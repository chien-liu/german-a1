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

function createVerbAnswerTable(data) {
    const headers = data["headers"];
    const arr = data["arr"];
    table = document.getElementById("perfekt_answer");

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
            td.appendChild(document.createTextNode(arr[i][j]));
        }
    }
}

function createVerbTestTable(data) {
    const headers = data["headers"];
    const arr = data["arr"];
    table = document.getElementById("perfekt_test");

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

            if (headers[j] == "perfekt") {
                const input = document.createElement('input');
                input.type = "text";
                input.id = i.toString() + "_" + j.toString();
                input.onblur = function () { compareAnswer(input.id, arr[i][j]) };
                td.appendChild(input);
            } else {
                td.appendChild(document.createTextNode(arr[i][j]));
            }
        }
    }


};

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
            createVerbTestTable(data);
            createVerbAnswerTable(data);
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
