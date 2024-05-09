const text = document.querySelector("textarea")

text.addEventListener("keyup", e =>{
  text.style.height = "auto";
  let scHeight = e.target.scrollHeight;
  text.style.height = `${scHeight}px`;
  console.log(text)
});