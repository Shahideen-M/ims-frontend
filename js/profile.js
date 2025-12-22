document.addEventListener("DOMContentLoaded", async () => {
    showLoader();
    try {
        const token = localStorage.getItem("token");
        if (!token) return location.href = "index.html";

        const res = await fetch(`${BASE_URL}/user/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const user = await res.json();
        document.getElementById("username").textContent = user.username;
        document.getElementById("email").textContent = user.email;
        document.getElementById("categories").textContent = user.category.length || 0;

        window.profileData = user; // store globally for modal usage

    } catch (err) {
        showToast(err.message, "danger", 3000);
    } finally {
        hideLoader();
    }
});

function openProfileModal(action) {
    const modal = new bootstrap.Modal(document.getElementById("profileModal"));
    const title = document.getElementById("profileModalTitle");
    const body = document.getElementById("profileModalBody");
    const saveBtn = document.getElementById("profileModalSaveBtn");

    body.innerHTML = "";
    saveBtn.onclick = null;

    if(action === "edit") {
        title.textContent = "Edit Profile";
        body.innerHTML = `
            <form id="editProfileForm">
                <div class="mb-3">
                    <label class="form-label">Username</label>
                    <input type="text" id="modalUsername" class="form-control" value="${profileData.username}" required>
                </div>
            </form>`;
        saveBtn.textContent = "Save Changes";
        saveBtn.onclick = async () => {
            const newUsername = document.getElementById("modalUsername").value.trim();
            if(!newUsername) return;

            showLoader();
            try {
                const res = await fetch(`${BASE_URL}/user/me`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ username: newUsername })
                });
                if(!res.ok) throw new Error("Update failed");

                document.getElementById("username").textContent = newUsername;
                profileData.username = newUsername;
                showToast("Profile updated successfully", "success", 1500);
                modal.hide();
            } catch(err) {
                showToast(err.message, "danger", 3000);
            } finally { hideLoader(); }
        };
    } 
    else if(action === "delete") {
        title.textContent = "Delete Account";
        body.innerHTML = "<p>Are you sure you want to delete your account? This cannot be undone.</p>";
        saveBtn.textContent = "Delete";
        saveBtn.onclick = async () => {
            showLoader();
            try {
                const res = await fetch(`${BASE_URL}/user/me`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                if(!res.ok) throw new Error("Delete failed");
                showToast("Account deleted successfully", "success", 1500);
                setTimeout(() => {
                    localStorage.removeItem("token");
                    location.href = "index.html";
                }, 1500);
            } catch(err) {
                showToast(err.message, "danger", 3000);
            } finally { hideLoader(); }
        };
    } 
    else if(action === "logout") {
        title.textContent = "Logout";
        body.innerHTML = "<p>Are you sure you want to logout?</p>";
        saveBtn.textContent = "Logout";
        saveBtn.onclick = () => {
            showToast("Logging out successfully", "success", 1500);
            setTimeout(() => {
                localStorage.removeItem("token");
                location.href = "index.html";
            }, 1500);
        };
    }
    modal.show();
}
