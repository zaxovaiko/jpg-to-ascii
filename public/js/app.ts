import './../sass/main.scss';

const form = document.getElementById('form') as HTMLFormElement;
const output = document.getElementById('output') as HTMLElement;
const compressionSelect = document.getElementById('compression') as HTMLSelectElement;
const imageInput = document.getElementById('image') as HTMLInputElement;
const imageInputLabel = document.getElementById('image-label') as HTMLElement;
const retryBtn = document.getElementById('retry') as HTMLButtonElement;

imageInput.onchange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  imageInputLabel.innerText = target.files![0].name;
};

form.onsubmit = (e: SubmitEvent) => {
  e.preventDefault();

  const fd = new FormData();
  fd.append('image', imageInput.files![0]);
  fd.append('compression', compressionSelect.value);

  output.innerText = 'Wait a minute...';
  fetch('/convert', { method: 'POST', body: fd })
    .then(res => {
      form.style.display = 'none';
      retryBtn.style.display = 'block';
      res.json().then((data: { data?: string; error?: string }) => {
        output.innerText = data.data ?? data.error ?? '';
      });
    })
    .catch(() => (output.innerText = 'Something went wrong.'));
};

retryBtn.onclick = () => {
  output.innerHTML = '';
  form.style.display = 'block';
  imageInputLabel.innerText = 'Choose a file...';
  imageInput.value = '';
  retryBtn.style.display = 'none';
};
