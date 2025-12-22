const BASE_URL = "https://ims-backend-2sru.onrender.com";
// const BASE_URL = "http://localhost:8080";

const loader = document.getElementById("loader");

function showLoader() {
    if (loader) loader.classList.remove("d-none");
}

function hideLoader() {
    if (loader) loader.classList.add("d-none");
}


function showToast(message, type='success', delayTime) {
    const toastElement = document.getElementById("toast");
    const toastBody = toastElement.querySelector(".toast-body");

    toastBody.textContent = message;

    toastElement.classList.remove("text-bg-success", "text-bg-danger", "text-bg-warning", "text-bg-info");

    if(type === 'success') toastElement.classList.add("text-bg-success");
    else if(type === 'danger') toastElement.classList.add("text-bg-danger");
    else if(type === 'warning') toastElement.classList.add("text-bg-warning");
    else toastElement.classList.add("text-bg-info");

    const toast = new bootstrap.Toast(toastElement, { delay: delayTime});
    toast.show();
}