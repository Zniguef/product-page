const r = document.querySelector(":root");

const primaryColor = localStorage.getItem("primary-color");
r.style.setProperty("--primary", primaryColor ?? "#533EB2");

document
  .getElementById("back")
  .setAttribute("href", "./index.html" + window.location.search);
