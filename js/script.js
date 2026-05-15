// =======================
// 🔐 Dynamic Navbar
// =======================
let nav = document.getElementById("navLinks");

if (nav) {
  let user_id = localStorage.getItem("user_id");

  if (user_id) {
    let name = localStorage.getItem("user_name") || "User";

    nav.innerHTML = `
      <span class="me-3 fw-bold text-primary">
        <i class="bi bi-person-circle"></i> ${name}
      </span>

      <a href="my_bookings.html" class="me-3">
        <i class="bi bi-calendar-check"></i> My Bookings
      </a>

      <a href="#" onclick="logoutUser()">
        <i class="bi bi-box-arrow-right"></i> Logout
      </a>
    `;
  } else {
    nav.innerHTML = `
      <a href="login.html">
        <i class="bi bi-person"></i> Login
      </a>
    `;
  }
}
// =======================
// 🚪 Logout
// =======================
function logoutUser() {
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_name"); // 👈 ADD THIS
  alert("Logged out");
  window.location.href = "login.html";
}

// =======================
// 🔒 Protect Pages
// =======================
let protectedPages = ["my_bookings.html", "booking.html"];
let currentPage = window.location.pathname.split("/").pop();

if (protectedPages.includes(currentPage)) {
  let user_id = localStorage.getItem("user_id");

  if (!user_id) {
    alert("Please login first");
    window.location.href = "login.html";
  }
}

// =======================
// Hotels Data
// =======================
let hotels = [
  {
    name: "Luxury Hotel",
    price: 300,
    images: ["images/room1.jpg","images/pool1.jpg","images/lobby1.jpg"],
    desc: "Beautiful luxury hotel with sea view"
  },
  {
    name: "Mountain View Resort",
    price: 500,
    images: ["images/room2.jpg","images/pool2.jpg","images/lobby2.jpg"],
    desc: "Relaxing resort near the beach"
  },
  {
    name: "Royal Palace",
    price: 700,
    images: ["images/room3.jpg","images/pool3.jpg","images/lobby3.jpg"],
    desc: "Premium royal experience"
  }
];

// =======================
// Render Hotels
// =======================
let container = document.getElementById("hotelList");

if (container) {
  container.innerHTML = "";

  hotels.forEach((h, index) => {
    container.innerHTML += `
      <div class="col-md-4">
        <div class="card">
          <img src="${h.images[0]}" class="img-fluid">
          <div class="card-body text-center">
            <h5>${h.name}</h5>
            <p>$${h.price} / night</p>
            <p class="text-warning">
  <i class="bi bi-star-fill"></i>
  <i class="bi bi-star-fill"></i>
  <i class="bi bi-star-fill"></i>
  <i class="bi bi-star-fill"></i>
  <i class="bi bi-star"></i>
</p>

            <button class="btn btn-primary"
              onclick="viewDetails(${index})">
              View Details
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

// =======================
// Search
// =======================
let search = document.getElementById("search");

if (search) {
  search.addEventListener("keyup", function () {
    let value = this.value.toLowerCase();
    let cards = document.querySelectorAll(".col-md-4");

    cards.forEach(card => {
      let text = card.innerText.toLowerCase();
      card.style.display =
        text.includes(value) ? "block" : "none";
    });
  });
}

// =======================
// View Details
// =======================
function viewDetails(index) {
  localStorage.setItem("hotel", JSON.stringify(hotels[index]));
  localStorage.setItem("hotel_id", index + 1);
  window.location.href = "details.html";
}

// =======================
// Load Details
// =======================
let hotel = JSON.parse(localStorage.getItem("hotel"));

if (hotel) {
  if (document.getElementById("hotelName")) {
    document.getElementById("hotelName").innerText = hotel.name;
    document.getElementById("hotelDesc").innerText = hotel.desc;
    document.getElementById("hotelPrice").innerText =
      "$" + hotel.price + " / night";
  }

  let carousel = document.getElementById("carouselImages");

  if (carousel) {
    carousel.innerHTML = "";

    hotel.images.forEach((img, index) => {
      carousel.innerHTML += `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
          <img src="${img}" class="d-block w-100 carousel-img">
        </div>
      `;
    });
  }
}

// =======================
// Booking
// =======================
function bookHotel(e) {
  e.preventDefault();

  let user_id = localStorage.getItem("user_id");
  let hotel_id = localStorage.getItem("hotel_id");

  let checkin = document.getElementById("checkin").value;
  let checkout = document.getElementById("checkout").value;

  if (!user_id) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  if (checkin >= checkout) {
    alert("Check-out must be after check-in!");
    return;
  }

  fetch("backend/book.php", {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: `user_id=${user_id}&hotel_id=${hotel_id}&checkin=${checkin}&checkout=${checkout}`
  })
  .then(res => res.text())
  .then(data => {
    if (data === "success") {
      alert("Booking saved!");
      window.location.href = "my_bookings.html"; // ✅ better UX
    } else {
      alert("Error saving booking");
    }
  });
}

// =======================
// Login
// =======================
function loginUser(e) {
  e.preventDefault();

  let email = document.querySelector("input[type=email]").value;
  let password = document.querySelector("input[type=password]").value;

  fetch("backend/login.php", {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: `email=${email}&password=${password}`
  })
  .then(res => res.json())
  .then(data => {

    if (data.status === "success") {
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("user_name", data.name);
      alert("Login success");
      window.location.href = "my_bookings.html"; // ✅ changed

    } else if (data.status === "wrong_password") {
      alert("Incorrect password");

    } else if (data.status === "no_user") {
      alert("Email not found");

    } else {
      alert("Something went wrong");
    }
  });
}

// =======================
// Register
// =======================
function registerUser(e) {
  e.preventDefault();

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  fetch("backend/register.php", {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: `name=${name}&email=${email}&password=${password}`
  })
  .then(res => res.text())
  .then(data => {
    if (data === "success") {
      alert("Account created!");
      window.location.href = "login.html";
    } else if (data === "exists") {
      alert("Email already exists");
    } else {
      alert("Error");
    }
  });
}

// =======================
// ⭐ Load My Bookings (FIXED)
// =======================
let bookingsContainer = document.getElementById("bookingsList");

if (bookingsContainer) {

  let user_id = localStorage.getItem("user_id");

  if (!user_id) {
    bookingsContainer.innerHTML = "<h5 class='text-center'>Please login</h5>";
  } else {

    fetch(`backend/get_bookings.php?user_id=${user_id}`)
      .then(res => res.json())
      .then(data => {

        bookingsContainer.innerHTML = "";

        if (data.length === 0) {
          bookingsContainer.innerHTML = `
            <div class="text-center">
              <h5>No bookings yet</h5>
              <a href="hotels.html" class="btn btn-primary">Browse Hotels</a>
            </div>
          `;
          return;
        }

        data.forEach(b => {
          bookingsContainer.innerHTML += `
            <div class="col-md-4">
              <div class="card p-3">
                <h5>${b.hotel_name}</h5>
                <p>Price: $${b.price}</p>
                <p>Check-in: ${b.checkin}</p>
                <p>Check-out: ${b.checkout}</p>
              </div>
            </div>
          `;
        });

      });
  }
}