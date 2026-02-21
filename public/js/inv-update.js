const updateForm = document.querySelector("#updateForm");

updateForm.addEventListener("change", () => {
  updateForm.querySelector("#submitBtn").removeAttribute("disabled");
});
