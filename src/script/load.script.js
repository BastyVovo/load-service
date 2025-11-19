const input = document.getElementById('customCode');
const link = document.getElementById('submit-link');

function main() {  
  link.addEventListener('click', (e) => {
    e.preventDefault();
    link.href = `sms:+8724?body=${input.value}`;
    link.click();
  });

  update();
}

function update() {
  const urlParams = new URLSearchParams(window.location.search);
  const data = urlParams.get('data');
  input.value = data;
}

main();