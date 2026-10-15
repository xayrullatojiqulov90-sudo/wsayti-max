const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const pricingButtons = document.querySelectorAll("[data-period]");
const priceNodes = document.querySelectorAll("[data-price]");
const form = document.querySelector("#lead-form");
const formMessage = document.querySelector(".form-message");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const prices = {
  monthly: {
    299000: "299 000",
    499000: "499 000"
  },
  yearly: {
    299000: "239 200",
    499000: "399 200"
  }
};

pricingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const period = button.dataset.period;

    pricingButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    priceNodes.forEach((node) => {
      const current = prices[period]?.[node.dataset.price];
      node.textContent = current ?? node.dataset.price;
    });
  });
});

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const business = String(formData.get("business") || "").trim();

    if (!name || !phone || !business) {
      formMessage.textContent = "Пожалуйста, заполните обязательные поля.";
      formMessage.style.color = "#fbbf24";
      return;
    }

    formMessage.textContent = `Спасибо, ${name}! Ваша заявка успешно отправлена.`;
    formMessage.style.color = "#a7f3d0";
    form.reset();
  });
}
