function loadPerfektData(shuffle) {
    /* Entry Point */
    const name = "perfekt";
    if (sessionStorage.getItem(name) === null) {
        fetchFromGithub(name, callback = updatePerfektTable, shuffle);
    } else {
        updatePerfektTable(shuffle);
    }
}

function loadArticleData(shuffle) {
    /* Entry Point */
    const name = "article";
    if (sessionStorage.getItem(name) === null) {
        fetchFromGithub(name, callback = updateArticleTable, shuffle);
    } else {
        updateArticleTable(shuffle);
    }
}

function loadPronomenData(shuffle) {
    /* Entry Point */
    const name = "pronomen";
    if (sessionStorage.getItem(name) === null) {
        fetchFromGithub(name, callback = updatePronomenTable, shuffle);
    } else {
        updatePronomenTable(shuffle);
    }
}

function loadNounData(shuffle) {
    /* Entry Point */
    const name = "noun";
    if (sessionStorage.getItem(name) === null) {
        fetchFromGithub(name, callback = updateNounTable, shuffle);
    } else {
        updateNounTable(shuffle);
    }
}

function fetchFromGithub(name, callback, ...args) {
    console.log("fetchFromGithub");
    const url = `https://raw.githubusercontent.com/chien-liu/german-a1/main/tables/${name}.csv`;
    var request = new XMLHttpRequest();

    request.onload = function () {
        var reader = new FileReader();
        reader.readAsText(request.response);
        reader.onload = function (e) {
            const text = e.target.result;
            const data = csvToArray(text);
            sessionStorage.setItem(name, JSON.stringify(data));
            callback(...args);
        };
    };
    request.open("GET", url, true);
    request.responseType = "blob";
    request.send();
}

function updatePerfektTable(shuffle) {
    var data = JSON.parse(sessionStorage.getItem("perfekt"));
    if (shuffle) {
        shuffleArray(data["arr"]);
    }
    createTable(data, id = "perfekt_test", blank_col = ["perfekt", "hat / ist"]);
    createTable(data, id = "perfekt_answer");
}

function updateArticleTable(shuffle) {
    var data = JSON.parse(sessionStorage.getItem("article"));
    if (shuffle) {
        shuffleArray(data["arr"]);
    }
    createTable(data, id = "article_test", blank_col = ["Nom", "Akk", "Dat"]);
    createTable(data, id = "article_answer");
}

function updatePronomenTable(shuffle) {
    var data = JSON.parse(sessionStorage.getItem("pronomen"));
    if (shuffle) {
        shuffleArray(data["arr"]);
    }
    createTable(data, id = "pronomen_test", blank_col = ["Akk", "Dat"]);
    createTable(data, id = "pronomen_answer");
}

function updateNounTable(shuffle) {
    var data = JSON.parse(sessionStorage.getItem("noun"));
    if (shuffle) {
        shuffleArray(data["arr"]);
    }
    createTable(data, id = "noun_test", blank_col = ["article", "plural"]);
    createTable(data, id = "noun_answer");
}

function createTable(data, table_id, blank_col = []) {
    const headers = data["headers"];
    const arr = data["arr"];
    console.log(arr)
    const table = document.getElementById(table_id);

    // flush table
    table.innerHTML = "";

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

function csvToArray(str, delimiter = ",") {
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

    // return headers and array
    return { headers, arr };
}

function shuffleArray(arr) {
    arr.sort(() => Math.random() - 0.5);
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

function saveCorretCount(dictName, key) {
    dic = JSON.parse(localStorage.getItem(dictName));
    if (dic === null) {
        var dic = {};
    }
    if (dic[key] === null) {
        dic[key] = 1;
    } else {
        dic[key] = dic[key] + 1;
    }
    localStorage.setItem(dictName, JSON.stringify(dic));
}