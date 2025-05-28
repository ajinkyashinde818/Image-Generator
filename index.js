async function fetchImages(category) {
    try {
        const accessKey = 'Y_5iB2Dx-tVd3c4cpogyE83kA__h_dq6Jrrs2RTa6O8'; // Your Unsplash API key
        const randomPage = Math.floor(Math.random() * 10) + 1;
        const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(category)}&per_page=10&page=${randomPage}&client_id=${accessKey}`;
        let response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Unable to fetch the data');
        }
        let data = await response.json();
        if (!data.results || data.results.length === 0) {
            imageContainerText.innerText = "No image found for this prompt!";
            imageGenerated.style.display = "none";
            downloadBtn.style.display = "none";
            return;
        }
        // Pick a random image from the returned results
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const imageUrl = data.results[randomIndex].urls.regular;

        imageContainerText.innerText = "Below is your generated Image:";
        imageContainer.style.display = "block";
        imageGenerated.src = imageUrl;
        imageGenerated.style.display = "block";

        imageGenerated.onload = async () => {
            try {
                const imgResponse = await fetch(imageUrl, {mode: 'cors'});
                const blob = await imgResponse.blob();
                if (downloadBtn.dataset.url) {
                    URL.revokeObjectURL(downloadBtn.dataset.url);
                }
                const objectUrl = URL.createObjectURL(blob);
                downloadBtn.href = objectUrl;
                downloadBtn.dataset.url = objectUrl;
                downloadBtn.style.display = "inline-block";
            } catch (err) {
                downloadBtn.href = imageUrl;
                downloadBtn.removeAttribute('data-url');
                downloadBtn.style.display = "inline-block";
            }
        };
        downloadBtn.style.display = "none";
    }
    catch (error) {
        console.log(error);
        imageContainerText.innerText = "Failed to generate image!";
        imageGenerated.style.display = "none";
        downloadBtn.style.display = "none";
    }
}

// Get DOM elements
const generateImageForm = document.querySelector('.my-form');
const formInput = document.getElementById('input-value');
const imageContainerText = document.getElementById('imageContainerText');
const imageGenerated = document.getElementById('generated-image');
const imageContainer = document.getElementById('images-visible');
const downloadBtn = document.getElementById('download-btn');

// Listen for form submission
generateImageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredText = formInput.value.trim();
    if (enteredText !== "") {
        fetchImages(enteredText);
    } else {
        imageContainerText.innerText = "Input field can not be empty!";
        imageGenerated.style.display = "none";
        downloadBtn.style.display = "none";
    }
});