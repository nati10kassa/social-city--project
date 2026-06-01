const list = document.getElementById("postsList");
const form = document.getElementById("postForm");

let currentUser = null;

// מי המשתמש המחובר?
async function loadUser() {
  const res = await fetch("/me");
  const data = await res.json();
  if (data.loggedIn) {
    currentUser = data.user;
  }
}

// טעינת פוסטים
async function loadPosts() {
  const res = await fetch("/posts");
  const posts = await res.json();

  list.innerHTML = "";

  posts.forEach(post => {
    const li = document.createElement("li");

    let deleteBtn = "";
    if (currentUser && currentUser.role === "admin") {
      deleteBtn = `
        <button class="delete-btn" onclick="deletePost(${post.id})">❌</button>
      `;
    }

    li.innerHTML = `
      <div class="post-card">
        <h4>${post.title}</h4>
        <p>${post.content}</p>
        <div class="post-actions">
          <span>👍 ${post.likes}</span>
          <button onclick="likePost(${post.id})">Like</button>
          ${deleteBtn}
        </div>
      </div>
    `;

    list.appendChild(li);
  });
}

// Like
function likePost(id) {
  fetch(`/posts/${id}/like`, { method: "POST" })
    .then(res => {
      if (!res.ok) throw new Error();
      loadPosts();
    })
    .catch(() => alert("כבר עשית לייק"));
}

// הוספת פוסט
form.addEventListener("submit", e => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  fetch("/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  }).then(() => {
    form.reset();
    loadPosts();
  });
});

// מחיקה (אדמין בלבד)
function deletePost(id) {
  if (!confirm("למחוק את הפוסט?")) return;

  fetch(`/posts/${id}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) {
        alert("אין הרשאה למחיקה");
        return;
      }
      loadPosts();
    });
}

// אתחול
(async function init() {
  await loadUser();
  loadPosts();
})();
