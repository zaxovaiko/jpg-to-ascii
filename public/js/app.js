let form = document.getElementById("form");
form.onsubmit = function (e) {
	e.preventDefault();

	const output = document.getElementById("output");
	const img = document.getElementById("image").files[0];
	const fd = new FormData();
	fd.append("image", img);

	output.innerText = "Wait a minute...";
	fetch("/convert", {
		method: "POST",
		body: fd
	})
		.then(res => res.json().then(e => (output.innerText = e)))
		.catch(() => (output.innerText = "Something went wrong."));
};
