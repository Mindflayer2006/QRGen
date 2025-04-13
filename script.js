// Tab buttons
const urlBtn = document.querySelector("#url");
const textBtn = document.querySelector("#text");
const emailBtn = document.querySelector("#email");

// Forms
const urlForm = document.querySelector(".url-form");
const textForm = document.querySelector(".text-form");
const emailForm = document.querySelector(".email-form");

// Inputs
const urlInput = document.getElementById("urlinp");
const textInput = document.getElementById("textinp");
const emailInput = document.getElementById("emailinp");

// QR Image
const qrImage = document.querySelector(".qrcode");
const downloadBtn = document.getElementById("downloadBtn");
let currentBlobURL = ""; // to keep track of the latest QR image blob


// Generate QR function
function generateQR(data) {
    const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=200x200`;

    qrImage.style.opacity = 0.5;

    // Add blinking animation class
    qrImage.classList.add("blinking");

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("QR Generation failed");
            return response.blob();
        })
        .then(blob => {
            const imgURL = URL.createObjectURL(blob);
            qrImage.src = imgURL;
            currentBlobURL = imgURL;

            qrImage.onload = () => {
                qrImage.style.opacity = 1;

                // Remove blinking class after it's loaded
                setTimeout(() => {
                    qrImage.classList.remove("blinking");
                }, 2400); // 0.8s * 3 = 2.4s
            };
        })
        .catch(error => {
            console.error("QR Error:", error);
            alert("Oops! Couldn't generate QR. Try again.");

            // Remove animation class if error occurs
            qrImage.classList.remove("blinking");
        });
}


// Form switch logic
function switchForm(formToShow, clickedBtn) {
    [urlForm, textForm, emailForm].forEach(form => form.classList.remove("active"));
    formToShow.classList.add("active");

    [urlBtn, textBtn, emailBtn].forEach(btn => btn.classList.remove("selected"));
    clickedBtn.classList.add("selected");
}

downloadBtn.addEventListener("click", () => {
    if (!currentBlobURL) return alert("Generate a QR code first!");

    const link = document.createElement("a");
    link.href = currentBlobURL;
    link.download = "qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Tab button click handlers
urlBtn.addEventListener("click", () => switchForm(urlForm, urlBtn));
textBtn.addEventListener("click", () => switchForm(textForm, textBtn));
emailBtn.addEventListener("click", () => switchForm(emailForm, emailBtn));

// Form submissions
urlForm.addEventListener("submit", e => {
    e.preventDefault();
    const data = urlInput.value.trim();
    if (!data) return alert("Please enter a URL.");
    generateQR(data);
});

textForm.addEventListener("submit", e => {
    e.preventDefault();
    const data = textInput.value.trim();
    if (!data) return alert("Please enter some text.");
    generateQR(data);
});

// Form submissions for email
emailForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email || !email.includes("@")) return alert("Please enter a valid email.");

    // Ensure the link uses the 'mailto:' protocol
    const mailtoLink = `mailto:${email}`;

    // Generate QR code with the correct mailto link
    generateQR(mailtoLink);
});

