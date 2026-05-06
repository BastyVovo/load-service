const API_URL = "https://load-server.onrender.com/api/load/v1/send";

let selectedAmount = 0;
const SERVICE_FEE_RATE = 0.02; // 5% service fee

document.getElementById("toggle").addEventListener("change", function () {
  updateSummary();
});
// Amount button selection
document.querySelectorAll(".amount-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document
      .querySelectorAll(".amount-btn")
      .forEach((b) => b.classList.remove("selected"));
    this.classList.add("selected");
    selectedAmount = parseInt(this.dataset.amount);
    document.getElementById("customAmount").value = "";
    updateSummary();
  });
});

// Custom amount input
document.getElementById("customAmount").addEventListener("input", function () {
  document
    .querySelectorAll(".amount-btn")
    .forEach((b) => b.classList.remove("selected"));
  selectedAmount = parseInt(this.value) || 0;
  updateSummary();
});

// Update summary
function updateSummary() {
  const isChecked = document.getElementById("toggle").checked;
  const serviceFee = isChecked
    ? 0
    : Math.round(selectedAmount * SERVICE_FEE_RATE);
  const total = selectedAmount + serviceFee;

  document.getElementById("loadAmount").textContent = `₱${selectedAmount}`;
  document.getElementById("serviceFee").textContent = `₱${serviceFee}`;
  document.getElementById("totalAmount").textContent = `₱${total}`;
}

// Form submission
document
  .getElementById("loadForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const mobileNumber = document.getElementById("mobileNumber").value;
    const submitBtn = document.getElementById("submitBtn");

    const number = mobileNumber?.replace(/\D/g, "");
    // Validation
    if (!number || number.length !== 11) {
      showStatus("error", "Please enter a valid 11-digit mobile number");
      return;
    }

    if (selectedAmount < 100 || selectedAmount > 1000) {
      showStatus(
        "error",
        "Please select or enter an amount (minimum ₱100 and maximum ₱1000)",
      );
      return;
    }

    const isChecked = document.getElementById("toggle").checked;
    // Show processing status
    showStatus("processing", "Processing your request...");
    submitBtn.disabled = true;
    showLoading(true);

    try {
      // Send request to backend
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber: number,
          amount: selectedAmount,
          isReseller: isChecked,
        }),
      }).then((res) => res.json());

      if (response.success) {
        showStatus(
          "success",
          `Load request submitted successfully! Reference: ${response.data.referenceId || "N/A"}`,
        );
        // Reset form
        setTimeout(() => {
          document.getElementById("loadForm").reset();
          document
            .querySelectorAll(".amount-btn")
            .forEach((b) => b.classList.remove("selected"));
          selectedAmount = 0;
          updateSummary();
          submitBtn.disabled = false;
          showLoading(false);
        }, 500);
      } else {
        showStatus(
          "error",
          response.message || "Failed to process request. Please try again.",
        );
        submitBtn.disabled = false;
        showLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      showStatus(
        "error",
        "Network error. Please check your connection and try again.",
      );
      submitBtn.disabled = false;
      showLoading(false);
    }
  });

function showLoading(show) {
  if(show) {
    document.querySelector("#submitBtn .text").style.display = "none";
    document.querySelector("#submitBtn .loader").style.display = "inline";
  } else {
    document.querySelector("#submitBtn .text").style.display = "inline";
    document.querySelector("#submitBtn .loader").style.display = "none";
  }
}

function showStatus(type, message) {
  const statusDiv = document.getElementById("status");
  statusDiv.style.display = "block";
  statusDiv.className = `status ${type}`;
  statusDiv.textContent = message;

  if (type === "success" || type === "error") {
    setTimeout(() => {
      statusDiv.style.display = "none";
    }, 5000);
  }
}

// Initialize
updateSummary();
