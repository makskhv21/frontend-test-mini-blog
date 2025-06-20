const postForm = document.getElementById("postForm");
const titleInput = document.getElementById("postForm-title");
const bodyInput = document.getElementById("postForm-body");
const submitBtn = document.getElementById("postForm-submitBtn");
const postsList = document.getElementById("postsList");

// Enable/disable submit button 
function checkFormFields() {
    submitBtn.disabled = !titleInput.value.trim() || !bodyInput.value.trim();
}

titleInput.addEventListener("input", checkFormFields);
bodyInput.addEventListener("input", checkFormFields);

// Creating the HTML of a single post
function renderPost(post, index) {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");
    postDiv.classList.add(index % 2 === 0 ? "even" : "odd")

    postDiv.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.body}</p>
        <button class="delete-btn">Видалити</button>
    ` ;

    // Delete button handler
    postDiv.querySelector(".delete-btn").addEventListener("click", () => {
        postDiv.remove();
    });

    postsList.prepend(postDiv);
}

// Loading posts
async function loadPosts() {
  try {
    const res = await axios.get("https://jsonplaceholder.typicode.com/posts?_limit=10");
    postsList.innerHTML = "";
    res.data.forEach((post, index) => renderPost(post, index));
  } catch (err) {
    console.error("Помилка завантаження постів:", err);
  }
}

// Submitting a new post
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newPost = {
    title: titleInput.value,
    body: bodyInput.value,
    userId: 1
  };

  try {
    const res = await axios.post("https://jsonplaceholder.typicode.com/posts", newPost);
    renderPost(res.data, 0);
    postForm.reset();
    submitBtn.disabled = true;
  } catch (err) {
    console.error("Не вдалося створити пост:", err);
  }
});

loadPosts();