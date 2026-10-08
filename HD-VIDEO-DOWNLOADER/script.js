/* =========================================================
   HD VIDEO DOWNLOADER
   Frontend-only JavaScript
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const videoUrl = document.getElementById("videoUrl");

const analyzeBtn =
    document.getElementById("analyzeBtn");

const analyzeText =
    document.getElementById("analyzeText");

const analyzeLoader =
    document.getElementById("analyzeLoader");

const errorMessage =
    document.getElementById("errorMessage");

const resultCard =
    document.getElementById("resultCard");

const videoPreview =
    document.getElementById("videoPreview");

const previewPlaceholder =
    document.getElementById("previewPlaceholder");

const videoTitle =
    document.getElementById("videoTitle");

const videoSource =
    document.getElementById("videoSource");

const formatBadge =
    document.getElementById("formatBadge");

const sizeBadge =
    document.getElementById("sizeBadge");

const qualitySelect =
    document.getElementById("qualitySelect");

const formatSelect =
    document.getElementById("formatSelect");

const downloadBtn =
    document.getElementById("downloadBtn");

const progressArea =
    document.getElementById("progressArea");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

const historyList =
    document.getElementById("historyList");

const clearHistory =
    document.getElementById("clearHistory");

const themeToggle =
    document.getElementById("themeToggle");

const toastElement =
    document.getElementById("toast");


/* =========================================================
   STATE
========================================================= */

let currentUrl = "";

let currentMedia = null;


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    toastElement.querySelector(
        ".toast-body"
    ).textContent = message;

    const toast =
        bootstrap.Toast.getOrCreateInstance(
            toastElement,
            {
                delay: 3000
            }
        );

    toast.show();
}


/* =========================================================
   ERROR
========================================================= */

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.classList.remove(
        "d-none"
    );
}


function clearError() {

    errorMessage.textContent = "";

    errorMessage.classList.add(
        "d-none"
    );
}


/* =========================================================
   URL VALIDATION
========================================================= */

function validateUrl(url) {

    if (!url) {

        return {
            valid: false,
            message: "Please paste a video URL."
        };
    }


    let parsedUrl;


    try {

        parsedUrl = new URL(url);

    } catch {

        return {
            valid: false,
            message: "Please enter a valid URL."
        };
    }


    if (
        parsedUrl.protocol !== "http:" &&
        parsedUrl.protocol !== "https:"
    ) {

        return {
            valid: false,
            message:
                "Only HTTP and HTTPS URLs are supported."
        };
    }


    return {
        valid: true,
        url: parsedUrl.href
    };
}


/* =========================================================
   FILE EXTENSION
========================================================= */

function getExtension(url) {

    try {

        const pathname =
            new URL(url).pathname;

        const filename =
            pathname.split("/").pop();

        if (!filename) {

            return "unknown";
        }

        const parts =
            filename.split(".");

        if (parts.length < 2) {

            return "unknown";
        }

        return parts
            .pop()
            .toLowerCase();

    } catch {

        return "unknown";
    }
}


/* =========================================================
   FORMAT
========================================================= */

function getFormatFromExtension(extension) {

    const formats = {

        mp4: "MP4",

        webm: "WebM",

        ogv: "OGG Video",

        mov: "MOV",

        m4v: "M4V",

        mp3: "MP3",

        m4a: "M4A",

        wav: "WAV",

        ogg: "OGG Audio"

    };


    return formats[extension]
        || extension.toUpperCase();
}


/* =========================================================
   BYTES
========================================================= */

function formatBytes(bytes) {

    if (
        !bytes ||
        Number.isNaN(bytes)
    ) {

        return "Unknown size";
    }


    const units = [
        "B",
        "KB",
        "MB",
        "GB"
    ];


    let size = bytes;

    let index = 0;


    while (
        size >= 1024 &&
        index < units.length - 1
    ) {

        size /= 1024;

        index++;
    }


    return `${size.toFixed(
        index === 0 ? 0 : 1
    )} ${units[index]}`;
}


/* =========================================================
   LOADING
========================================================= */

function setAnalyzeLoading(loading) {

    analyzeBtn.disabled = loading;


    if (loading) {

        analyzeText.classList.add(
            "d-none"
        );

        analyzeLoader.classList.remove(
            "d-none"
        );

    } else {

        analyzeText.classList.remove(
            "d-none"
        );

        analyzeLoader.classList.add(
            "d-none"
        );
    }
}


/* =========================================================
   ANALYZE MEDIA
========================================================= */

async function analyzeVideo() {

    clearError();


    const url =
        videoUrl.value.trim();


    const validation =
        validateUrl(url);


    if (!validation.valid) {

        showError(
            validation.message
        );

        return;
    }


    currentUrl =
        validation.url;


    setAnalyzeLoading(true);


    resultCard.classList.add(
        "d-none"
    );


    try {

        const extension =
            getExtension(currentUrl);


        currentMedia = {

            url: currentUrl,

            extension:

                extension,

            format:

                getFormatFromExtension(
                    extension
                )

        };


        /*
            Use HEAD to get basic information
            where the server permits it.
        */

        let response;


        try {

            response =
                await fetch(
                    currentUrl,
                    {
                        method: "HEAD",
                        mode: "cors"
                    }
                );

        } catch {

            response = null;
        }


        let fileSize =
            null;


        if (
            response &&
            response.ok
        ) {

            const contentLength =
                response.headers.get(
                    "content-length"
                );


            if (contentLength) {

                fileSize =
                    Number(contentLength);
            }
        }


        currentMedia.size =
            fileSize;


        displayResult();


        showToast(
            "Media URL analyzed successfully."
        );


    } catch (error) {

        console.error(error);


        showError(
            "Unable to analyze this media URL. The source may block browser requests (CORS) or the URL may not be a direct media file."
        );

    } finally {

        setAnalyzeLoading(false);
    }
}


/* =========================================================
   DISPLAY RESULT
========================================================= */

function displayResult() {

    if (!currentMedia) {

        return;
    }


    const {

        url,
        extension,
        format,
        size

    } = currentMedia;


    videoTitle.textContent =
        getFileName(url);


    try {

        videoSource.textContent =
            new URL(url).hostname;

    } catch {

        videoSource.textContent =
            "Unknown source";
    }


    formatBadge.textContent =
        format;


    sizeBadge.textContent =
        formatBytes(size);


    qualitySelect.innerHTML = `

        <option value="original">
            Original / Best Available
        </option>

    `;


    formatSelect.innerHTML = `

        <option value="${escapeHtml(extension)}">
            ${escapeHtml(format)}
        </option>

    `;


    /*
        Set video preview.
    */

    videoPreview.src = url;


    videoPreview.load();


    videoPreview.style.display =
        "block";


    previewPlaceholder.style.display =
        "none";


    videoPreview.addEventListener(
        "error",
        () => {

            videoPreview.style.display =
                "none";

            previewPlaceholder.style.display =
                "flex";

        },
        {
            once: true
        }
    );


    resultCard.classList.remove(
        "d-none"
    );
}


/* =========================================================
   GET FILE NAME
========================================================= */

function getFileName(url) {

    try {

        const pathname =
            new URL(url).pathname;

        let filename =
            decodeURIComponent(
                pathname.split("/").pop()
                || "Video"
            );


        filename =
            filename.replace(
                /\.[^/.]+$/,
                ""
            );


        return filename ||
            "Video";

    } catch {

        return "Video";
    }
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(value) {

    return String(value)
        .replace(
            /[&<>"']/g,
            character => {

                const entities = {

                    "&": "&amp;",

                    "<": "&lt;",

                    ">": "&gt;",

                    '"': "&quot;",

                    "'": "&#039;"
                };


                return entities[
                    character
                ];
            }
        );
}


/* =========================================================
   DOWNLOAD
========================================================= */

async function downloadVideo() {

    if (!currentUrl) {

        showError(
            "Please analyze a video first."
        );

        return;
    }


    clearError();


    progressArea.classList.remove(
        "d-none"
    );


    progressBar.style.width =
        "10%";


    progressText.textContent =
        "Preparing...";


    downloadBtn.disabled =
        true;


    try {

        /*
            Fetching as a Blob works only when
            the source permits browser CORS.
        */

        const response =
            await fetch(
                currentUrl,
                {
                    method: "GET",
                    mode: "cors"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Download request failed."
            );
        }


        progressBar.style.width =
            "25%";

        progressText.textContent =
            "Downloading...";


        const contentLength =
            response.headers.get(
                "content-length"
            );


        const total =
            contentLength
                ? Number(contentLength)
                : 0;


        if (!response.body) {

            /*
                Fallback for browsers/sources
                that do not expose a stream.
            */

            const blob =
                await response.blob();

            saveBlob(
                blob,
                getDownloadName()
            );

            completeDownload();

            return;
        }


        const reader =
            response.body.getReader();


        const chunks = [];

        let received = 0;


        while (true) {

            const {
                done,
                value
            } = await reader.read();


            if (done) {

                break;
            }


            chunks.push(value);

            received +=
                value.length;


            if (total > 0) {

                const percent =
                    Math.min(
                        99,
                        Math.round(
                            (received / total) * 100
                        )
                    );


                progressBar.style.width =
                    `${percent}%`;

                progressText.textContent =
                    `${percent}%`;

            } else {

                progressText.textContent =
                    formatBytes(
                        received
                    );
            }
        }


        const blob =
            new Blob(
                chunks,
                {
                    type:
                        response.headers.get(
                            "content-type"
                        )
                        || "application/octet-stream"
                }
            );


        saveBlob(
            blob,
            getDownloadName()
        );


        completeDownload();


    } catch (error) {

        console.error(error);


        /*
            If CORS prevents fetch(), direct
            browser navigation may still work.
        */

        progressBar.style.width =
            "100%";

        progressText.textContent =
            "Starting browser download...";


        const link =
            document.createElement("a");


        link.href =
            currentUrl;


        link.download =
            getDownloadName();


        link.target =
            "_blank";


        link.rel =
            "noopener";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        showToast(
            "The browser was asked to download the file. If it opens instead, the source does not permit direct browser downloading."
        );


        setTimeout(() => {

            resetProgress();

        }, 2500);

    }
}


/* =========================================================
   SAVE BLOB
========================================================= */

function saveBlob(blob, filename) {

    const objectUrl =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href =
        objectUrl;


    link.download =
        filename;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    setTimeout(() => {

        URL.revokeObjectURL(
            objectUrl
        );

    }, 1000);
}


/* =========================================================
   DOWNLOAD NAME
========================================================= */

function getDownloadName() {

    if (!currentMedia) {

        return "video";
    }


    const name =
        getFileName(
            currentMedia.url
        );


    const extension =
        currentMedia.extension;


    return `${name}.${extension}`;
}


/* =========================================================
   COMPLETE DOWNLOAD
========================================================= */

function completeDownload() {

    progressBar.style.width =
        "100%";


    progressText.textContent =
        "100%";


    showToast(
        "Download completed successfully."
    );


    saveHistory({

        title:
            getFileName(
                currentMedia.url
            ),

        format:
            currentMedia.format,

        size:
            formatBytes(
                currentMedia.size
            ),

        time:
            new Date().toISOString()

    });


    downloadBtn.disabled =
        false;


    setTimeout(
        resetProgress,
        1500
    );
}


/* =========================================================
   RESET PROGRESS
========================================================= */

function resetProgress() {

    progressArea.classList.add(
        "d-none"
    );


    progressBar.style.width =
        "0%";


    progressText.textContent =
        "0%";
}


/* =========================================================
   HISTORY
========================================================= */

function saveHistory(item) {

    let history =
        JSON.parse(
            localStorage.getItem(
                "hdDownloaderHistory"
            ) || "[]"
        );


    history.unshift(item);


    /*
        Keep last 10
    */

    history =
        history.slice(0, 10);


    localStorage.setItem(
        "hdDownloaderHistory",
        JSON.stringify(history)
    );


    displayHistory();
}


function displayHistory() {

    const history =
        JSON.parse(
            localStorage.getItem(
                "hdDownloaderHistory"
            ) || "[]"
        );


    if (!history.length) {

        historyList.innerHTML =
            "No downloads yet.";

        return;
    }


    historyList.innerHTML =
        history.map(item => `

            <div class="history-item">

                <div>

                    <strong>
                        ${escapeHtml(
                            item.title
                        )}
                    </strong>

                    <div>
                        ${escapeHtml(
                            item.format
                        )}
                        •
                        ${escapeHtml(
                            item.size
                        )}
                    </div>

                </div>

                <small>

                    ${new Date(
                        item.time
                    ).toLocaleString()}

                </small>

            </div>

        `).join("");
}


/* =========================================================
   CLEAR HISTORY
========================================================= */

clearHistory.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "hdDownloaderHistory"
        );


        displayHistory();


        showToast(
            "Download history cleared."
        );
    }
);


/* =========================================================
   THEME
========================================================= */

function setTheme(theme) {

    document.documentElement
        .setAttribute(
            "data-theme",
            theme
        );


    localStorage.setItem(
        "theme",
        theme
    );


    if (theme === "dark") {

        themeToggle.innerHTML =
            `<i class="bi bi-sun-fill"></i>`;

    } else {

        themeToggle.innerHTML =
            `<i class="bi bi-moon-stars-fill"></i>`;
    }
}


themeToggle.addEventListener(
    "click",
    () => {

        const current =
            document.documentElement
                .getAttribute(
                    "data-theme"
                );


        setTheme(
            current === "dark"
                ? "light"
                : "dark"
        );
    }
);


/* =========================================================
   EVENTS
========================================================= */

analyzeBtn.addEventListener(
    "click",
    analyzeVideo
);


downloadBtn.addEventListener(
    "click",
    downloadVideo
);


videoUrl.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            analyzeVideo();
        }
    }
);


/* =========================================================
   INITIALIZATION
========================================================= */

const savedTheme =
    localStorage.getItem(
        "theme"
    ) || "light";


setTheme(savedTheme);


displayHistory();