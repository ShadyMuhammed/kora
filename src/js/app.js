document.getElementById("menuCollapse").onclick = ()=>{
  document.querySelector(".header").classList.toggle("active")
}
let _icons =  document.querySelectorAll(".border-icon");
for (let index = 0; index < _icons.length; index++) {
  _icons[index].onclick = ()=>{
    _icons[index].classList.toggle("active")

  }

}
