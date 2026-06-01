// =======================================
// City Social - Register JS
// =======================================

const form = document.getElementById("registerForm");
const messageEl = document.getElementById("message");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!isValidUsername(username)) {
    showMessage("שם משתמש חייב להכיל אותיות בלבד ולפחות 2 תווים");
    return;
  }

  if (!isValidPassword(password)) {
    showMessage("סיסמה חייבת להכיל אות וספרה (3–8 תווים)");
    return;
  }

  // שליחה לשרת
  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        showMessage(data.message, "green");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        showMessage(data.message);
      }
    })
    .catch(() => {
      showMessage("שגיאה בהתחברות לשרת");
    });
});

// ========= ולידציות =========

function isValidUsername(username) {
  return /^[A-Za-zא-ת]{2,}$/.test(username);
}

function isValidPassword(password) {
  return /^(?=.*[A-Za-zא-ת])(?=.*\d)[A-Za-zא-ת\d]{3,8}$/.test(password);
}

function showMessage(text, color = "red") {
  messageEl.style.color = color;
  messageEl.innerText = text;
}
