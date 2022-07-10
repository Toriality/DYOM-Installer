export default function buttonSound() {
  const buttons = document.querySelectorAll("button");
  const audio = new Audio("../sounds/click.wav");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      audio.play();
    });
  });
}
