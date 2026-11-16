const products = [
  {
    id: "urban-runner",
    name: "Urban Runner",
    price: 8900,
    image: "images/urban-runner.jpg",
    sizes: [40, 41, 42, 43, 44]
  },
  {
    id: "street-flex",
    name: "Street Flex",
    price: 10500,
    image: "images/street-flex.jpg",
    sizes: [39, 40, 41, 42, 43]
  },
  {
    id: "cloud-motion",
    name: "Cloud Motion",
    price: 12000,
    image: "images/cloud-motion.jpg",
    sizes: [40, 41, 42, 43, 44, 45]
  },
  {
    id: "classic-edge",
    name: "Classic Edge",
    price: 9500,
    image: "images/classic-edge.jpg",
    sizes: [39, 40, 41, 42, 43, 44]
  }
];

const productGrid = document.querySelector("#product-grid");
const toast = document.querySelector("#toast");
let toastTimeout;

function formatPrice(price) {
  return new Intl.NumberFormat("ar-DZ").format(price);
}

function createProductCard(product, index) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.productId = product.id;

  const image = document.createElement("div");
  image.className = "product-image";
  image.innerHTML = `
    <span class="product-number">0${index + 1}</span>
    <span class="product-placeholder" aria-hidden="true">👟</span>
    <img src="${product.image}" alt="${product.name}" loading="lazy">
    <span class="product-label">TN_UK / SPORT</span>
  `;
  const img = image.querySelector("img");
  img.addEventListener("error", () => image.classList.add("image-unavailable"), { once: true });

  const info = document.createElement("div");
  info.className = "product-info";
  const titleRow = document.createElement("div");
  titleRow.className = "product-title-row";
  const title = document.createElement("h3");
  title.className = "product-title";
  title.textContent = product.name;
  const price = document.createElement("span");
  price.className = "product-price";
  price.innerHTML = `${formatPrice(product.price)} <span class="price-currency">دج</span>`;
  titleRow.append(title, price);

  const sizeLabel = document.createElement("p");
  sizeLabel.className = "size-label";
  sizeLabel.textContent = "اختر المقاس";
  const sizes = document.createElement("div");
  sizes.className = "sizes";
  sizes.setAttribute("role", "group");
  sizes.setAttribute("aria-label", `مقاسات ${product.name}`);

  product.sizes.forEach((size) => {
    const button = document.createElement("button");
    button.className = "size-button";
    button.type = "button";
    button.textContent = size;
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `مقاس ${size}`);
    button.addEventListener("click", () => {
      sizes.querySelectorAll(".size-button").forEach((sizeButton) => {
        sizeButton.setAttribute("aria-pressed", String(sizeButton === button));
      });
      card.dataset.selectedSize = size;
    });
    sizes.append(button);
  });

  const orderButton = document.createElement("button");
  orderButton.className = "order-button";
  orderButton.type = "button";
  orderButton.textContent = "اطلب الآن عبر إنستغرام";
  orderButton.addEventListener("click", () => placeOrder(product, card));

  info.append(titleRow, sizeLabel, sizes, orderButton);
  card.append(image, info);
  return card;
}

function showToast(message, isError = false) {
  window.clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.toggle("is-error", isError);
  toast.classList.add("is-visible");
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 4500);
}

async function copyMessage(message) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(message);
      return true;
    } catch (error) {
      console.warn("Clipboard API rejected the copy request; trying the fallback.", error);
    }
  }

  const textArea = document.createElement("textarea");
  textArea.value = message;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.append(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();
  return copied;
}

async function placeOrder(product, card) {
  const selectedSize = card.dataset.selectedSize;
  if (!selectedSize) {
    showToast("من فضلك اختر المقاس أولاً.", true);
    card.querySelector(".sizes").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const message = `السلام عليكم، أريد طلب الحذاء: ${product.name}\nالمقاس: ${selectedSize}\nالسعر: ${formatPrice(product.price)} دج`;
  const copyResult = copyMessage(message);
  window.open("https://ig.me/m/tn_uk", "_blank", "noopener,noreferrer");

  try {
    const copied = await copyResult;
    if (copied) {
      showToast("تم نسخ رسالة الطلب! الصقها في محادثة إنستغرام لإتمام طلبك.");
    } else {
      showToast(`تعذّر النسخ تلقائياً. انسخ رسالتك والصقها في إنستغرام: ${message}`, true);
    }
  } catch (error) {
    console.error("Could not copy the Instagram order message.", error);
    showToast(`تعذّر النسخ تلقائياً. انسخ رسالتك والصقها في إنستغرام: ${message}`, true);
  }
}

products.forEach((product, index) => {
  productGrid.append(createProductCard(product, index));
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
