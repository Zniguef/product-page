const r = document.querySelector(":root");
const productId = window.location.search.replace("?id=", "");

const form = document.getElementById("buy-here-form");
const totalpriceform = document.getElementById("total-price-form");
const quantityform = document.getElementById("quantity-form");

let price = 1;
let reviewsSize = window.innerWidth > 600 ? 8 : 4;

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
      if (headers[j].trim() === "benifits") {
        obj[headers[j].trim()] = currentline[j]
          ?.split("-")
          ?.map((ben) => ben?.trim());
      }
      if (headers[j].trim() === "date") {
        obj[headers[j].trim()] = new Date(
          Number.parseInt(currentline[j])
        )?.toLocaleDateString("en-US");
      }
    }

    result.push(obj);
  }

  return result;
}

async function getReviews() {
  reviewsSize = window.innerWidth > 600 ? 8 : 4;
  const reviews = await fetch(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvdPYGymrRD4h1QFDE7XszscyA6CBkjOAVZTYA80eY_8ff-YX-RklioBEFeZ2fzxj5KdbXtHeoCvCL/pub?gid=1339441688&single=true&output=csv"
  )
    .then((response) => response.text())
    .then((data) =>
      csvJSON(data)
        ?.sort((el) => el?.date)
        ?.filter((review) => review?.productId === productId)
    );

  let reviewsHtmlContent = "";
  reviews?.slice(0, reviewsSize)?.forEach((review) => {
    reviewsHtmlContent +=
      '<div class="review-card"> ' +
      " <h1> " +
      review?.username +
      "</h1>" +
      '<div class="rate">';
    for (let i = 0; i < review?.rate; i++) {
      reviewsHtmlContent += ' <img src="./images/star.svg" />';
    }
    reviewsHtmlContent +=
      "</div> " +
      "<p> " +
      review?.feedback +
      "</p>" +
      "<span>" +
      review?.date +
      "</span> </div>";
  });

  reviewsHtmlContent += `<div title="${
    reviews?.length > reviewsSize ? reviews?.length - reviewsSize : 0
  } other peoples shared their reviews" class="review-card"> <h1> +${
    reviews?.length > reviewsSize ? reviews?.length - reviewsSize : 0
  } أخرى </h1> </div>`;
  document.getElementById("reviews").innerHTML = reviewsHtmlContent;

  document.getElementById("loading").style.display = "none";
  document.getElementById("container").style.display = "inline-block";
}

async function getProductInfo() {
  const products = await fetch(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvdPYGymrRD4h1QFDE7XszscyA6CBkjOAVZTYA80eY_8ff-YX-RklioBEFeZ2fzxj5KdbXtHeoCvCL/pub?gid=0&single=true&output=csv"
  )
    .then((response) => response.text())
    .then((data) => csvJSON(data));

  const product = products.find((pr) => pr?.id === productId);
  if (product !== null) {
    price = parseInt(product?.price?.replace("درهم", ""));
    totalpriceform.textContent = price + " درهم";
    // css color variables
    r.style.setProperty("--primary", product?.primaryColor ?? "lightcoral");
    r.style.setProperty("--primary-text", product?.primaryTextColor ?? "red");

    document.getElementById("desc").textContent = product?.description;
    document.getElementById("header_title").textContent = product?.title;
    document.getElementById("sec-sec-prod-name").textContent = product?.name;
    document.getElementById("sec-sec-desc").textContent = product?.secSecDesc;

    document.getElementById("product-name").textContent =
      product?.name ?? "مرحباً";

    document.querySelectorAll("#product_img").forEach((el) => {
      el.setAttribute("src", product?.img);
    });

    document.querySelectorAll("#buyNow").forEach((el) => {
      el.textContent += product?.price;
    });
  }

  let formattedHtmlBenifits = "";
  product?.benifits?.forEach((benifit) => {
    if (benifit !== "") {
      formattedHtmlBenifits +=
        '<div class="benifit-elem">' +
        '  <img class="check-icon" src="./images/check.svg" />' +
        "  <span>" +
        benifit?.replace("\n", "") +
        "  </span>" +
        "</div>";
    }
  });

  document.getElementById("benifits-list").innerHTML = formattedHtmlBenifits;

  if (product != null) {
    getReviews();
    window.addEventListener("resize", () => {
      if (
        (reviewsSize === 8 && window.innerWidth < 600) ||
        (reviewsSize === 4 && window.innerWidth > 600)
      ) {
        document.getElementById("reviews").innerHTML = `
        <div>
        </div>
        <h1 style="font-size: 20px; display: flex; flex-direction: column; gap: 10px; margin: 50px 0; justify-content: center; align-items:center;">
        <img src="./images/loading.gif" style="width: 70px;" />
        getting reviews...
        </h1>
        <div>
        </div>`;
        getReviews();
      }
    });
  } else {
    document.getElementById("loading").style.display = "none";

    if (window.innerWidth < 600 && window.innerWidth > window.innerHeight) {
      document.getElementById("error-page").querySelector(".blob").style.width =
        "80%";
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth < 600 && window.innerWidth > window.innerHeight) {
        document
          .getElementById("error-page")
          .querySelector(".blob").style.width = "80%";
      } else {
        document.getElementById("error-page").querySelector(".blob").style = "";
      }
    });
    document.getElementById("error-page").style.display = "flex";
  }
}

function calculatePrice() {
  const quantity = isNaN(Number(quantityform.value))
    ? 0
    : Number(quantityform.value);

  const total = price * quantity;
  totalpriceform.textContent = total + " درهم";
}

quantityform.addEventListener("change", function () {
  calculatePrice();
});

getProductInfo();
