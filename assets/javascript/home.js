function triggerConfetti(x, y) {
    const confettiSettings = {
        particleCount: 100,
        spread: 100,
        origin: { x: x / window.innerWidth, y: y / window.innerHeight },
    };

    confetti.create(null, { resize: true })(confettiSettings);
}

function addExercise(exerciseValue = document.querySelector("#exercise").value, goalValue = document.querySelector("#goal").value, amountValue = 0) {
    if (checkForProblems(exerciseValue.toLowerCase(), goalValue)) return;
    addExerciseToLocalStorage(exerciseValue.toLowerCase(), goalValue, amountValue);

    // Clear inputs
    document.querySelector("#exercise").value = "";
    document.querySelector("#goal").value = "";

    // Add new row to end of table
    const table = document.querySelector(".exercise_table");
    const row = table.insertRow(-1);

    // Add exercise cell to row
    const exercise = row.insertCell(0);
    exercise.dataset.cell = "exercise";
    exercise.dataset.exercise = exerciseValue.toLowerCase();
    exercise.textContent = exerciseValue.toLowerCase();

    // Add goal cell to row
    const goal = row.insertCell(1);
    goal.dataset.cell = "goal";
    goal.textContent = goalValue;

    // Add amount cell to row
    const amount = row.insertCell(2);
    amount.dataset.cell = "amount";
    const input = document.createElement("input");
    input.type = "number";
    input.value = amountValue;
    input.min = 0;
    input.classList.add("amount");
    input.addEventListener("input", () => amountChanged(input));
    amount.append(input);

    // Add actions cell to row
    const actions = row.insertCell(3);
    actions.dataset.cell = "actions";

    // Actions container
    const actionsContainer = document.createElement("div");
    actionsContainer.classList.add("actions_container");

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("button");
    removeBtn.classList.add("remove_exercise_button");
    removeBtn.classList.add("destructive");
    removeBtn.onclick = removeExercise;
    removeBtn.textContent = "Remove";

    // Increase value by 5
    const increaseBtnBy5 = document.createElement("button");
    increaseBtnBy5.classList.add("button");
    increaseBtnBy5.classList.add("increaseValue_exercise_button");
    increaseBtnBy5.dataset.step = 5;
    increaseBtnBy5.onclick = addValue;
    increaseBtnBy5.textContent = "Add 5";

    // Increase value by 10
    const increaseBtnBy10 = document.createElement("button");
    increaseBtnBy10.classList.add("button");
    increaseBtnBy10.classList.add("increaseValue_exercise_button");
    increaseBtnBy10.dataset.step = 10;
    increaseBtnBy10.onclick = addValue;
    increaseBtnBy10.textContent = "Add 10";

    // Append actions to DOM
    actionsContainer.append(increaseBtnBy5);
    actionsContainer.append(increaseBtnBy10);
    actionsContainer.append(removeBtn);
    actions.append(actionsContainer);
}

function amountChanged(inputElement) {
    const inputValue = parseFloat(inputElement.value);
    const max = parseFloat(inputElement.parentNode.parentNode.querySelector("[data-cell='goal']").textContent);

    if (inputValue >= max) {
        const rect = inputElement.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        triggerConfetti(x, y);
    }

    updateExerciseFromLocalStorage(inputValue, inputElement);
}

function checkForProblems(exercise, goal) {
    let isBad = false;

    const rows = document.querySelectorAll(".exercise_table tr");
    for (let i = 1; i < rows.length; i++) {
        const td = rows[i].querySelector("td").dataset.exercise;
        if (td === exercise) {
            console.error(`Error: "${exercise}" is already added!`);
            isBad = true;
        };
    }

    if (exercise === "" || goal === "") {
        console.error(`Error: Values are empty!`);
        isBad = true;
    }

    if (!isNaN(exercise)) {
        console.error(`Exercise input cannot contain numbers!`);
        isBad = true;
    }

    return isBad;
}

function addValue() {
    const target = this.parentNode.parentNode.parentNode.querySelector(".amount");
    const step = this.dataset.step - 0;
    let value = target.value - 0;
    value += step;
    target.value = value;
    amountChanged(target);
}

function removeExercise() {
    const parentNode = this.parentNode.parentNode.parentNode;
    const index = parentNode.rowIndex;
    const exercise = parentNode.querySelector("[data-exercise]").dataset.exercise;

    document.querySelector(".exercise_table").deleteRow(index);
    removeExerciseFromLocalStorage(exercise);
}

function removeExerciseFromLocalStorage(exercise) {
    let exercises = JSON.parse(localStorage.getItem("exercises"));
    delete exercises[exercise];

    localStorage.setItem("exercises", JSON.stringify(exercises));
}

function updateExerciseFromLocalStorage(amount, inputElement) {
    const exercise = inputElement.parentNode.parentNode.querySelector("[data-exercise]").dataset.exercise;

    const exercises = JSON.parse(localStorage.getItem("exercises"));
    exercises[exercise].amount = amount;

    localStorage.setItem("exercises", JSON.stringify(exercises));
}

function addExerciseToLocalStorage(exercise, goal, amount = 0) {
    const exerciseValues = {
        goal: goal,
        amount: amount,
    };

    const exercises = JSON.parse(localStorage.getItem("exercises"));
    const newExercises = { ...exercises, [exercise.toLowerCase()]: exerciseValues };

    localStorage.setItem("exercises", JSON.stringify(newExercises));
}

function addAllExercisesOnLoad() {
    const exercises = JSON.parse(localStorage.getItem("exercises"));

    for (const key in exercises) {
        const obj = exercises[key];
        addExercise(key, obj.goal, obj.amount);
    }
}

addAllExercisesOnLoad();

// Check if add exercise button is clicked and call addExercise function
document.querySelector(".add_exercise_button").addEventListener("click", () => addExercise());

// Check for keyboard input and add exercise if enter button is pressed
document.querySelector(".add_exercise").addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    addExercise();
});

(function () {
    let resizeTimeout;
    let isCheckingOverflow = false;

    function checkOverflow() {
        const exercisesList = document.querySelector('.table_container');

        if (!isCheckingOverflow) {
            isCheckingOverflow = true;

            setTimeout(function () {
                const check = exercisesList.scrollWidth > exercisesList.clientWidth || exercisesList.scrollHeight > exercisesList.clientHeight;
                exercisesList.classList[check ? 'add' : 'remove']('overflowing');
                isCheckingOverflow = false;
            }, 50);
        }
    }

    function debounceResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(checkOverflow, 50);
    }

    checkOverflow();

    window.addEventListener('resize', debounceResize);
})();
