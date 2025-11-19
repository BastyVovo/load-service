const input = document.getElementById('customCode');
const link = document.getElementById('submitBtn');

function main() {  
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const url = `sms:+8724?body=${input.value}`;
    window.location.href = url;
  });

  update();
}

function update() {
  const urlParams = new URLSearchParams(window.location.search);
  const data = urlParams.get('data');
  input.value = data;
}

main();