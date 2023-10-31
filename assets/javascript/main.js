function getTheme() {
    let theme = localStorage.getItem("theme");
    if (!theme) theme = "dark";
    return theme;
}

function setTheme(theme = getTheme()) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
}

document.querySelectorAll(".theme_select").forEach(btn => btn.addEventListener("click", (e) => setTheme(e.target.dataset.value)));
setTheme();