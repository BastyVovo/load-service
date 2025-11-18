const API_URL = 'https://load.bstyvv.top/api/load/send';

let selectedAmount = 0;
const SERVICE_FEE_RATE = 0.05; // 5% service fee

// Amount button selection
document.querySelectorAll('.amount-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
    this.classList.add('selected');
    selectedAmount = parseInt(this.dataset.amount);
    document.getElementById('customAmount').value = '';
    updateSummary();
  });
});

// Custom amount input
document.getElementById('customAmount').addEventListener('input', function() {
  document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
  selectedAmount = parseInt(this.value) || 0;
  updateSummary();
});

// Update summary
function updateSummary() {
  // const serviceFee = Math.round(selectedAmount * SERVICE_FEE_RATE);
  const serviceFee = 0;
  const total = selectedAmount + serviceFee;

  document.getElementById('loadAmount').textContent = `₱${selectedAmount}`;
  document.getElementById('serviceFee').textContent = `₱${serviceFee}`;
  document.getElementById('totalAmount').textContent = `₱${total}`;
}

// Form submission
document.getElementById('loadForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const mobileNumber = document.getElementById('mobileNumber').value;
  const submitBtn = document.getElementById('submitBtn');

  const number = mobileNumber?.replace(/\D/g, '');
  // Validation
  if (!number || number.length !== 11) {
    showStatus('error', 'Please enter a valid 11-digit mobile number');
    return;
  }

  if (selectedAmount < 100 || selectedAmount > 1000) {
    showStatus('error', 'Please select or enter an amount (minimum ₱100 and maximum ₱1000)');
    return;
  }

  // Show processing status
  showStatus('processing', 'Processing your request...');
  submitBtn.disabled = true;

  try {
    // Send request to backend
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify({
        mobileNumber: number,
        amount: selectedAmount,
      })
    }).then(res => res.json());

    if (response.success) {
      showStatus('success', `Load request submitted successfully! Reference: ${response.data.referenceId || 'N/A'}`);
      // Reset form
      setTimeout(() => {
        document.getElementById('loadForm').reset();
        document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
        selectedAmount = 0;
        updateSummary();
      }, 500);
    } else {
      showStatus('error', response.message || 'Failed to process request. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    showStatus('error', 'Network error. Please check your connection and try again.');
  } finally {
    submitBtn.disabled = false;
  }
});

function showStatus(type, message) {
  const statusDiv = document.getElementById('status');
  statusDiv.style.display = 'block';
  statusDiv.className = `status ${type}`;
  statusDiv.textContent = message;

  if (type === 'success' || type === 'error') {
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 5000);
  }
}

// Initialize
updateSummary();
