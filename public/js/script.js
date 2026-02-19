function showMenu() {
  const HamburgerBtn = document.querySelector("#hamburger-btn")
  const navigation = document.querySelector("nav")
  HamburgerBtn.addEventListener("click", () => {
    navigation.classList.toggle("active")
    HamburgerBtn.classList.toggle("close")
  })
}

showMenu()