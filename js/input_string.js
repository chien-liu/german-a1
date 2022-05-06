function compareAnswer(id, answer) {
    const input = document.getElementById(id);

    if (input.value == answer) {
        input.style.color = "green";
    } else {
        input.style.color = "red";
    }
    input.style.fontWeight = "bold";
}
