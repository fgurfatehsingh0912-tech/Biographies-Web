// Check for active login memory immediately on document layout mount
        window.addEventListener('DOMContentLoaded', () => {
            const savedUserPicture = localStorage.getItem('userProfilePicture');
            const savedUserName = localStorage.getItem('userProfileName');

            if (savedUserPicture && savedUserName) {
                // Instantly swap greeting banner text strings using stored state names
                document.getElementById("greet").textContent = savedUserName;
                
                // Render avatar layout elements securely
                document.getElementById("buttonContainer").innerHTML = `
                    <button onclick="clickPictureButton()" title="Switch Account / Sign In" style="background: none; border: none; padding: 0; cursor: pointer; border-radius: 50%;">
                        <img src="${savedUserPicture}" alt="${savedUserName}" style="border-radius: 50%; width: 40px; height: 40px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); border: 2px solid #4285F4;">
                    </button>
                `;
            }
        });

        // Initialize Google Sign-in on window load if profile memory is currently clean
        window.onload = function () {
            if (!localStorage.getItem('userProfilePicture') && window.google && google.accounts && google.accounts.id) {
                google.accounts.id.initialize({
                    client_id: "268079272303-047maeq2tiguvhfibcqa30b18caulj08.apps.googleusercontent.com",
                    callback: handleCredentialResponse,
                    ux_mode: "popup"
                });

                google.accounts.id.renderButton(
                    document.getElementById("buttonContainer"),
                    { 
                        type: "standard",
                        size: "large",
                        theme: "filled_black",
                        text: "signin_with",
                        shape: "pill",
                        logo_alignment: "left"
                    }
                );
            } else if (!window.google) {
                setTimeout(window.onload, 100);
            }
        };

        function clickPictureButton() {
            if (window.google && google.accounts && google.accounts.id) {
                google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        console.log("Prompt skipped. Forcing reset clear lifecycle...");
                        localStorage.clear();
                        window.location.reload();
                    }
                });
            }
        }
        // FIXED DATA EXTRACTOR: Resolves string array token splits safely for GitHub Pages environments
        function handleCredentialResponse(response) {
            try {
                // FIXED array isolation targeting index 1 explicitly
                const base64Url = response.credential.split('.')[1]; 
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const userData = JSON.parse(jsonPayload);
                
                if (userData && userData.picture) {
                    const displayName = userData.given_name || userData.name;

                    localStorage.setItem('userProfilePicture', userData.picture);
                    localStorage.setItem('userProfileName', displayName);

                    // Modify banner display greeting element strings instantly
                    document.getElementById("greet").textContent = displayName;

                    document.getElementById("buttonContainer").innerHTML = `
                        <button onclick="clickPictureButton()" title="Switch Account / Sign In" style="background: none; border: none; padding: 0; cursor: pointer; border-radius: 50%;">
                            <img src="${userData.picture}" alt="${userData.name}" style="border-radius: 50%; width: 40px; height: 40px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); border: 2px solid #4285F4;">
                        </button>
                    `;
                }
            } catch (error) {
                console.error("Profile credentials processing failed:", error);
            }
        }
