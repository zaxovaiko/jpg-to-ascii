import "./../sass/main.scss";

const form = document.getElementById("form");
const output = document.getElementById("output");
const compression = document.getElementById("rand");
const imageInput = document.getElementById("image");
const imageInputLabel = document.getElementById("image-label");
const retryBtn = document.getElementById("retry");

// On file selection change label
imageInput.onchange = e => {
	document.getElementById("image-label").innerText = e.target.files[0].name;
};

form.onsubmit = e => {
	e.preventDefault();

	const fd = new FormData();
	fd.append("image", imageInput.files[0]);
	fd.append("rand", compression.checked);

	output.innerText = "Wait a minute...";
	fetch("/convert", {
		method: "POST",
		body: fd
	})
		.then(res => {
			form.style.display = "none";
			retryBtn.style.display = "block";
			res.json().then(
				e => (output.innerText = e.data ? e.data : e.error)
			);
		})
		.catch(() => (output.innerText = "Something went wrong."));
};

// Reset to the default view
retryBtn.onclick = e => {
	output.innerHTML = "";
	form.style.display = "block";
	imageInputLabel.innerText = "Choose a file...";
	imageInput.value = null;
	retryBtn.style.display = "none";
};
