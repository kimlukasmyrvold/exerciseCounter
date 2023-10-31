const addExerciseBtn = document.querySelector(".add_exercise_button");
addExerciseBtn.addEventListener("click", () => addExercise());

function addExercise(exerciseValue = document.querySelector("#exercise").value, goalValue = document.querySelector("#goal").value, amountValue = 0) {
    if (checkIfExerciseIsAdded(exerciseValue)) return;
    addExerciseToLocalStorage(exerciseValue, goalValue, amountValue);
    clearInputValues();

    const table = document.querySelector(".exercise_table");
    const row = table.insertRow(-1);

    const exercise = row.insertCell(0);
    exercise.textContent = exerciseValue;

    const goal = row.insertCell(1);
    goal.textContent = goalValue;

    const amount = row.insertCell(2);
    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = amountValue;
    amount.append(input);
}

function clearInputValues() {
    document.querySelector("#exercise").value = "";
    document.querySelector("#goal").value = "";
}

function checkIfExerciseIsAdded(exercise) {
    const rows = document.querySelectorAll(".exercise_table tr");
    for (let i = 1; i < rows.length; i++) {
        const td = rows[i].querySelector("td").textContent;
        if (td === exercise) {
            console.error(`Error: "${exercise}" is already added!`);
            return true;
        };
    }
}

function addExerciseToLocalStorage(exercise, goal, amount = 0) {
    const exerciseMap = {
        goal: goal,
        amount: amount,
    };

    const map = {
        [exercise]: exerciseMap,
        squats: exerciseMap,
        sitting: exerciseMap,
    };

    localStorage.setItem("exercises", JSON.stringify(map))
}

function getExerciseFromLocalStorage() {
    const exercises = JSON.parse(localStorage.getItem("exercises"));
    console.table(exercises);
}

getExerciseFromLocalStorage()