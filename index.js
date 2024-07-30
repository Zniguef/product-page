var r = document.querySelector(":root");

function csvJSON(csv) {
  const lines = csv.split("\n");

  let result = [];
  const headers = lines[0].split(",");

  for (let i = 1; i < lines.length; i++) {
    let obj = {};
    const currentline = lines[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      currentline[j] = currentline[j]?.replace("\r", "")?.trim();
      obj[headers[j].trim()] = currentline[j]?.trim();
    }

    result.push(obj);
  }

  return result;
}

async function getProductInfo() {
  const products = await fetch(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvdPYGymrRD4h1QFDE7XszscyA6CBkjOAVZTYA80eY_8ff-YX-RklioBEFeZ2fzxj5KdbXtHeoCvCL/pub?gid=0&single=true&output=csv"
  )
    .then((response) => response.text())
    .then((data) => csvJSON(data));

  const productId = window.location.search.replace("?id=", "");

  const product = products.find((pr) => pr?.id === productId);
  console.log(product);
  console.log(product?.primaryTextColor);
  if (product !== null) {
    r.style.setProperty("--primary", product?.primaryColor ?? "lightcoral");
    r.style.setProperty("--primary-text", product?.primaryTextColor ?? "red");
    document.getElementById("product-name").textContent +=
      product?.name ?? "مرحباً";
    document.querySelectorAll("#product_img").forEach((el) => {
      el.setAttribute("src", product?.img);
    });
    document.getElementById("desc").textContent = product?.description;
    document.getElementById("header_title").textContent = product?.title;
    document.getElementById("sec-sec-prod-name").textContent = product?.name;
    document.getElementById("sec-sec-desc").textContent = product?.secSecDesc;

    document.querySelectorAll("#buyNow").forEach((el) => {
      el.textContent += product?.price;
    });
  }

  document.getElementById("loading").style.display = "none";
  document.getElementById("container").style.display = "inline-block";
}

getProductInfo();
