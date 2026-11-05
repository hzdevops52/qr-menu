const menuGrid = document.getElementById("menu-grid");
const categoryList = document.getElementById("category-list");
const searchInput = document.getElementById("menu-search");
const menuStatus = document.getElementById("menu-status");

let menuItems = [];
let activeCategory = "all";

const restaurantName = document.getElementById("restaurant-name");
const heroTitle = document.getElementById("hero-title");

function formatPrice(price, currency) {
  return new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0
  }).format(price) + " " + currency;
}


function createCategories(categories) {
  const buttons = [
    { name: "All Items", value: "all" },
    ...categories.map(name => ({ name, value: name }))
  ];

  categoryList.innerHTML = "";

  const mobileSelect = document.getElementById("mobile-category-select");
  mobileSelect.innerHTML = "";

  buttons.forEach(category => {
    // Desktop category button
    const button = document.createElement("button");
    button.className = "category-btn";
    button.textContent = category.name;
    button.dataset.category = category.value;

    if (category.value === activeCategory) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      setActiveCategory(category.value);
    });

    categoryList.appendChild(button);

    // Mobile dropdown option
    const option = document.createElement("option");
    option.value = category.value;
    option.textContent = category.name;
    mobileSelect.appendChild(option);
  });

  mobileSelect.value = activeCategory;
}

function setActiveCategory(category) {
  activeCategory = category;

  categoryList.querySelectorAll(".category-btn").forEach(btn => {
    btn.classList.toggle(
      "active",
      btn.dataset.category === activeCategory
    );
  });

  document.getElementById("mobile-category-select").value = activeCategory;

  renderMenu();
}

function createMenuCard(item, currency) {
  const card = document.createElement("article");
  card.className = "menu-card";

  if (!item.available) {
    card.classList.add("unavailable");
  }

  const imageWrap = document.createElement("div");
  imageWrap.className = "card-image-wrap";

  const image = document.createElement("img");
  image.className = "card-image";
  image.src = item.image;
  image.alt = item.name;
  image.loading = "lazy";

  image.addEventListener("error", () => {
    imageWrap.style.background = "#303030";
    image.style.display = "none";
  });

  const category = document.createElement("span");
  category.className = "card-category";
  category.textContent = item.category;

  imageWrap.append(image, category);

  const content = document.createElement("div");
  content.className = "card-content";

  const titleRow = document.createElement("div");
  titleRow.className = "card-title-row";

  const title = document.createElement("h3");
  title.textContent = item.name;

  const price = document.createElement("span");
  price.className = "card-price";
  price.textContent = formatPrice(item.price, currency);

  titleRow.append(title, price);

  const description = document.createElement("p");
  description.className = "card-description";
  description.textContent = item.description || "";

  content.append(titleRow, description);
  card.append(imageWrap, content);

  return card;
}

function renderMenu() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredItems = menuItems.filter(item => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;

    const matchesSearch = [
      item.name,
      item.description,
      item.category
    ].join(" ").toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  menuGrid.innerHTML = "";

  if (filteredItems.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No menu items found. Try another search.";
    menuGrid.appendChild(empty);
    menuStatus.textContent = "";
    return;
  }

  filteredItems.forEach(item => {
    menuGrid.appendChild(createMenuCard(item, window.menuCurrency));
  });

  menuStatus.textContent =
    `Showing ${filteredItems.length} menu item${filteredItems.length === 1 ? "" : "s"}`;
}

async function initializeMenu() {
  try {
    menuStatus.textContent = "Loading menu...";

    const response = await fetch("data/menu.json");

    if (!response.ok) {
      throw new Error("Could not load menu data.");
    }

    const data = await response.json();

    menuItems = data.items || [];
    window.menuCurrency = data.restaurant.currency || "PKR";

    restaurantName.textContent =
      (data.restaurant.name || "The Grand Table").toUpperCase();

    const title = data.restaurant.heroTitle || "Good Food. Great Moments.";
    const titleParts = title.split(".");

    heroTitle.innerHTML = "";

    const firstLine = document.createTextNode(
      (titleParts[0] || "Good Food").trim() + "."
    );

    const secondLine = document.createElement("span");
    secondLine.textContent = (titleParts[1] || "Great Moments").trim() + ".";

    heroTitle.append(firstLine, document.createElement("br"), secondLine);

    document.getElementById("restaurant-tagline").textContent =
      data.restaurant.tagline || "";

    document.getElementById("hero-description").textContent =
      data.restaurant.description || "";

    document.getElementById("hero-image").style.backgroundImage =
      `url("${data.restaurant.coverImage}")`;

    document.getElementById("restaurant-address").textContent =
      data.restaurant.address || "";

    document.getElementById("restaurant-hours").textContent =
      data.restaurant.hours || "";

    document.title = `Menu | ${data.restaurant.name}`;

    createCategories(data.categories || []);
    renderMenu();

  } catch (error) {
    console.error(error);
    menuGrid.innerHTML =
      '<div class="empty-state">Unable to load the menu. Please try again later.</div>';
    menuStatus.textContent = "";
  }
}

searchInput.addEventListener("input", renderMenu);

document.getElementById("mobile-category-select")
  .addEventListener("change", event => {
    setActiveCategory(event.target.value);
  });

document.getElementById("current-year").textContent =
  new Date().getFullYear();

initializeMenu();
