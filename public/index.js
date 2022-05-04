const socket = io.connect();

function render(data) {
  const html = data
    .map((elem, index) => {
      return `<div><strong>${elem.user}</strong>:
			<em>${elem.message}</em></div>`;
    })
    .join(" ");
  document.getElementById("messages").innerHTML = html;
}

socket.on("messages", (data) => {
  console.log(data);
  render(data);
});
