const btn = document.querySelector('.btn'); // Generate button
const code = document.querySelector('.code'); // QR Code image
const input = document.querySelector('.input'); // Input field
const toast = document.querySelector('#toast'); // Toast notification

// Set a default QR code when the application loads
const defaultData = "https://example.com"; // Default QR code text
const defaultURL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(defaultData)}`;
code.src = defaultURL; // Set default QR code on load

btn.addEventListener('click', generate);

function generate() {
    const data = input.value.trim();
    if (!data) {
        alert('Please enter some text to generate a QR code.');
        return;
    }

    const URL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
    code.src = URL; // Update the src of the QR code image
    toastDiv();
    input.value = ''; // Clear input after generating

    // Update the download button to use the latest QR code image
    downloadBtn.setAttribute('data-qrcode', URL);
}

function toastDiv() {
    toast.className = "show";
    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 2000);
}

// Download QR Code Functionality using Blob
const downloadQRCode = () => {
    const qrCodeImage = downloadBtn.getAttribute('data-qrcode'); // Get the latest QR code image source

    fetch(qrCodeImage)
        .then(response => response.blob()) // Convert image to Blob
        .then(blob => {
            const url = URL.createObjectURL(blob); // Create an object URL
            const link = document.createElement('a'); // Create a temporary link element
            link.href = url; // Set href to Blob URL
            link.download = 'qrcode.png'; // Set the file name
            document.body.appendChild(link); // Append link to the body
            link.click(); // Trigger download
            document.body.removeChild(link); // Remove the link from the document
            URL.revokeObjectURL(url); // Clean up the object URL
        })
        .catch(error => console.error('Download failed:', error));
}

// Create and append download button
const downloadBtn = document.createElement('button');
downloadBtn.textContent = 'Download QR Code';
downloadBtn.className = 'btn'; // Use same styling as generate button
downloadBtn.setAttribute('data-qrcode', defaultURL); // Set initial data attribute
downloadBtn.onclick = downloadQRCode; // Attach the download function
document.querySelector('.main').appendChild(downloadBtn);
