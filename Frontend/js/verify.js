function qs(sel, root=document){return root.querySelector(sel)}

//verify user is logged in and set nav bar
async function verifyUser() {
    
    const response = await fetch('http://localhost:3000/auth/verify', {
        method: 'GET',
        credentials: 'include'
    });

    const userEl = qs('[data-user]');
    const loginButton = qs('.loginButton')

    if(userEl){
        if (response.ok) {
            const name = localStorage.getItem('cr_user');
            userEl.textContent = `${name}`;

            if (loginButton) {
                loginButton.innerHTML = `<a href="login.html" onclick="localStorage.removeItem('cr_user');">Sign out</a>`
            }
        } else {
            console.log("User failed to validate. Forcing logout");
            window.location.href = './login.html';
        }
    }
}

window.addEventListener('pageshow', function(event) {
    //skip if running locally
    if (window.location.protocol === 'file:') {
        return;
    }

    //attempt to prevent loading from cache
    if (!localStorage.getItem('cr_user')) {
        window.location.replace('login.html');
    }
    verifyUser();
});