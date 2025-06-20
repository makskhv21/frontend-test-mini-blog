let currentPage = 1;
const postsPerPage = 10;
let allPosts = [];

const postForm = document.getElementById("postForm");
const titleInput = document.getElementById("postForm-title");
const bodyInput = document.getElementById("postForm-body");
const submitBtn = document.getElementById("postForm-submitBtn");
const postsList = document.getElementById("postsList");

// ==== Creating message and loader elements ====
const notification = document.createElement("div");
notification.className = "notification";
document.body.appendChild(notification);

const loader = document.createElement("div");
loader.className = "loader hidden";
document.body.appendChild(loader);

// ==== Form validation ====
function checkFormFields() {
  submitBtn.disabled = !titleInput.value.trim() || !bodyInput.value.trim();
}

[titleInput, bodyInput].forEach(input =>
  input.addEventListener("input", checkFormFields)
);

// ==== Notification ====
function showNotification(message) {
  notification.textContent = message;
  notification.classList.add("show");
  setTimeout(() => notification.classList.remove("show"), 3000);
}

// ==== Loader ====
function toggleLoader(show) {
  loader.classList.toggle("hidden", !show);
}

// ==== Render post ====
function renderPost(post, index) {
  const postDiv = document.createElement("div");
  postDiv.classList.add("post", index % 2 === 0 ? "even" : "odd", "clickable");

  postDiv.innerHTML = `
    <h3>${post.title}</h3>
    <p>${post.body}</p>
    <div class="post-actions">
      <button class="delete-btn">Видалити</button>
    </div>
  `;

  postDiv.addEventListener("click", (e) => {
    if (!e.target.classList.contains("delete-btn")) {
      showModal(post);
    }
  });

  postDiv.querySelector(".delete-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    postDiv.remove();
  });

  postsList.prepend(postDiv);
}

// ==== Modal window ====
function showModal(post) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <h2>${post.title}</h2>
      <p>${post.body}</p>
    </div>
  `;

  modal.querySelector(".close-btn").addEventListener("click", () => modal.remove());
  document.body.appendChild(modal);
}

// ==== Load more ====
async function loadMorePosts() {
  toggleLoader(true);
  try {
    const res = await axios.get(
      `https://jsonplaceholder.typicode.com/posts?_start=${(currentPage - 1) * postsPerPage}&_limit=${postsPerPage}`
    );
    const posts = res.data;
    posts.forEach((post, index) => renderPost(post, (currentPage - 1) * postsPerPage + index));
    currentPage++;
  } catch (err) {
    console.error("Помилка завантаження постів:", err);
  } finally {
    toggleLoader(false);
  }
}

// ==== Create post ====
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newPost = {
    title: titleInput.value,
    body: bodyInput.value,
    userId: 1,
  };

  toggleLoader(true);
  try {
    const res = await axios.post("https://jsonplaceholder.typicode.com/posts", newPost);
    
    renderPost(res.data, postsList.children.length);
    
    showNotification("Публікацію створено успішно!");
    postForm.reset();
    checkFormFields();
  } catch (err) {
    console.error("Не вдалося створити пост:", err);
  } finally {
    toggleLoader(false);
  }
});


// Button "Завантажити ще"
const loadMoreBtn = document.createElement("button");
loadMoreBtn.textContent = "Завантажити ще";
loadMoreBtn.className = "load-more-btn";
loadMoreBtn.addEventListener("click", loadMorePosts);
document.querySelector("main").appendChild(loadMoreBtn);


loadMorePosts();