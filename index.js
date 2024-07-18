const year = document.getElementById("year");
year.textContent = new Date().getFullYear();

const form = document.getElementById("buy-here-form");
const checkboxes = form.querySelectorAll(".chosen-product");
const totalpriceform = document.getElementById("total-price-form");
const quantityform = document.getElementById("quantity-form");
const price = 250;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Check if at least one checkbox is checked
  let atLeastOneChecked = false;

  checkboxes.forEach(function (checkbox) {
    if (checkbox.checked) {
      atLeastOneChecked = true;
    }
  });

  if (!atLeastOneChecked) {
    // Set custom validity to show error message like HTML required attribute
    checkboxes[0].setCustomValidity("يجب اختيار منتج واحد على الأقل");

    // Trigger validation check to display the error message immediately
    form.reportValidity();
  } else {
    checkboxes[0].setCustomValidity("");

    // Proceed with form submission or further processing
    const formData = new FormData(form);
    const formObject = {};

    formData.forEach((value, key) => {
      if (formObject[key]) {
        if (!Array.isArray(formObject[key])) {
          formObject[key] = [formObject[key]];
        }
        formObject[key].push(value);
      } else {
        formObject[key] = value;
      }
    });

    // Optionally, you can reset custom validity after successful validation
    // checkboxes[0].setCustomValidity('');

    // Submit the form programmatically
    // form.submit();
  }
});

function calculatePrice() {
  const quantity =
    Number(quantityform.value) === NaN ? 0 : Number(quantityform.value);

  let checkedBoxes = 0;
  checkboxes.forEach((ch) => {
    if (ch.checked) {
      checkedBoxes++;
    }
  });

  const total = price * quantity * checkedBoxes;
  totalpriceform.textContent = total + " درهم";
}
// Reset custom validity message when any checkbox is checked
checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener("change", function () {
    calculatePrice();
    const atLeastOneChecked = [...checkboxes].some(
      (checkbox) => checkbox.checked
    );

    if (atLeastOneChecked) {
      checkboxes[0].setCustomValidity("");
    }
  });
});

quantityform.addEventListener("change", function () {
  calculatePrice();
});
