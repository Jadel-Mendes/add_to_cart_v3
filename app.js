let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let checkOutBtn = document.querySelector('.checkOut');
let products = [];
let cart = [];

// ✅ category containers
const categorySections = {
  furniture: document.querySelector('.listProduct.furniture'),
  tech: document.querySelector('.listProduct.tech'),
  clothing: document.querySelector('.listProduct.clothing'),
  accessories: document.querySelector('.listProduct.accessories')
};

// toggle cart
iconCart.addEventListener('click', () => {
  body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
  body.classList.toggle('showCart');
});

// ✅ render products by category
const addDataToHTML = () => {
  Object.values(categorySections).forEach(section => section.innerHTML = '');

  if (products.length > 0) {
    products.forEach(product => {
      let newProduct = document.createElement('div');
      newProduct.dataset.id = product.id;
      newProduct.classList.add('item');
      newProduct.innerHTML =
        `<img src="${product.image}" alt="">
         <h2>${product.name}</h2>
         <div class="price">£${product.price}</div>
         <button class="addCart">Add To Cart</button>`;

      let category = product.category ? product.category.toLowerCase() : 'furniture';
      if (categorySections[category]) {
        categorySections[category].appendChild(newProduct);
      }
    });
  }
};

// add to cart (clicks on any section)
document.querySelectorAll('.listProduct').forEach(section => {
  section.addEventListener('click', (event) => {
    if (event.target.classList.contains('addCart')) {
      let id_product = event.target.parentElement.dataset.id;
      addToCart(id_product);
    }
  });
});

const addToCart = (product_id) => {
  let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
  if (cart.length <= 0) {
    cart = [{ product_id: product_id, quantity: 1 }];
  } else if (positionThisProductInCart < 0) {
    cart.push({ product_id: product_id, quantity: 1 });
  } else {
    cart[positionThisProductInCart].quantity += 1;
  }
  addCartToHTML();
  addCartToMemory();
};

const addCartToMemory = () => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// ✅ improved cart display
const addCartToHTML = () => {
  listCartHTML.innerHTML = '';
  let totalQuantity = 0;
  let totalCost = 0;

  if (cart.length > 0) {
    cart.forEach(item => {
      totalQuantity += item.quantity;
      let product = products.find(p => p.id == item.product_id);

      let newItem = document.createElement('div');
      newItem.classList.add('item');
      newItem.dataset.id = item.product_id;

      let itemTotal = product.price * item.quantity;
      totalCost += itemTotal;

      newItem.innerHTML = `
        <div class="image"><img src="${product.image}" alt="${product.name}"></div>
        <div class="name">${product.name}</div>
        <div class="totalPrice">£${itemTotal}</div>
        <div class="quantity">
          <button class="minus">-</button>
          <span>${item.quantity}</span>
          <button class="plus">+</button>
        </div>
      `;
      listCartHTML.appendChild(newItem);
    });

    // ✅ Add cart total at the bottom
    const totalDiv = document.createElement('div');
    totalDiv.classList.add('cart-total');
    totalDiv.innerHTML = `<strong>Total:</strong> £${totalCost.toFixed(2)}`;
    listCartHTML.appendChild(totalDiv);
  }

  iconCartSpan.innerText = totalQuantity;
};

// change quantity
listCartHTML.addEventListener('click', (event) => {
  if (event.target.classList.contains('minus') || event.target.classList.contains('plus')) {
    let product_id = event.target.closest('.item').dataset.id;
    let type = event.target.classList.contains('plus') ? 'plus' : 'minus';
    changeQuantityCart(product_id, type);
  }
});

const changeQuantityCart = (product_id, type) => {
  let index = cart.findIndex(item => item.product_id == product_id);
  if (index >= 0) {
    if (type === 'plus') {
      cart[index].quantity += 1;
    } else {
      cart[index].quantity -= 1;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
    }
  }
  addCartToHTML();
  addCartToMemory();
};


 // ✅ handle checkout button
checkOutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Save cart to localStorage so checkout.html can access it
  localStorage.setItem("cart", JSON.stringify(cart));

  // Redirect to checkout.html
  window.location.href = "checkout.html";
});


// ✅ mobile menu toggle
function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('active');
}

// ✅ smooth scroll
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
      document.querySelector('.nav-links').classList.remove('active');
    }
  });
});

// ✅ dark mode toggle
const darkToggle = document.getElementById("darkToggle");
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark");
  darkToggle.textContent = "☀️";
}

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("darkMode", "enabled");
    darkToggle.textContent = "☀️";
  } else {
    localStorage.setItem("darkMode", "disabled");
    darkToggle.textContent = "🌙";
  }
});

// init
const initApp = () => {
  fetch('products.json')
    .then(response => response.json())
    .then(data => {
      products = data;
      addDataToHTML();
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        addCartToHTML();
      }
    });
};

const sections = document.querySelectorAll("h2[id]");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href").substring(1) === current) {
      link.classList.add("active");
    }
  });
});

initApp();
