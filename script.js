const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
    let inpWord = document.getElementById("inp-word").value;
    fetch(`${url}${inpWord}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            if (data.length === 0) {
                throw new Error('No results found');
            }

            console.log(data);
            const phonetic = data[0].phonetic || "No phonetic available";
            const audioUrl = data[0].phonetics[0] ? `https:${data[0].phonetics[0].audio}` : null;

            result.innerHTML = `
            <div class="word">
                    <h3>${inpWord}</h3>
                    <button onclick="playSound()">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
                <div class="details">
                    <p>${data[0].meanings[0].partOfSpeech}</p>
                    <p>/${phonetic}/</p>
                </div>
                <p class="word-meaning">
                   ${data[0].meanings[0].definitions[0].definition}
                </p>
                <p class="word-example">
                    ${data[0].meanings[0].definitions[0].example || ""}
                </p>`;

            if (audioUrl) {
                sound.setAttribute("src", audioUrl);
                sound.style.display = "block";
            } else {
                sound.style.display = "none"; // Hide the sound element if no audio URL
            }
        })
        .catch((error) => {
            console.error('Error fetching word:', error);
            result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
        });
});

function playSound() {
    if (sound.src) {
        sound.play().catch((error) => {
            console.error('Error playing sound:', error);
        });
    } else {
        console.warn('No sound source available');
    }
}
