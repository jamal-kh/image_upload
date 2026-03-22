const fileInput = document.getElementById('file-input');
const imageArea = document.getElementById('image_area');
const form = document.getElementById("upload-form");
const imageResult = document.getElementById("result-image");
const placeholderText = document.getElementById("result-placeholder");
const submitBTN = document.querySelector(".btn");

const createImage = (src, container) => {
    container.innerHTML = "";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "Preview";
    img.style.width = "200px";
    img.style.margin = "10px";

    container.append(img);
};

function setButtonLoading(button, isLoading) {
    button.disabled = isLoading;
    button.style.opacity = isLoading ? "0.5" : "1";
    button.style.cursor = isLoading ? "not-allowed" : "pointer";
}

fileInput.addEventListener('change', function () {
    if (this.files.length > 0) {
        const file = this.files[0];

        const previewUrl = URL.createObjectURL(file);
        createImage(previewUrl, imageArea);
        setButtonLoading(submitBTN, false);
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop normal form reload

    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file");
        return;
    }

    setButtonLoading(submitBTN, true);
    const formData = new FormData();
    formData.append("image", file);

    try {
        const res = await fetch("/upload", {
            method: "POST",
            body: formData
        });

        const data = await res.json();


        // example: show image
        if (data.imageUrl) {
            imageResult.src = data.imageUrl;
            imageResult.style.display = "block";
            imageResult.style.width = "100%";
            imageResult.style.height = "auto"
            placeholderText.style.display = "none"
        }


    } catch (err) {
        console.error("Upload failed:", err);
    }
});
