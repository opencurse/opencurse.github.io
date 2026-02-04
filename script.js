const API_URL = "https://opencurse.onrender.com";

function keepAlive() {
    setInterval(() => {
        fetch(`${API_URL}/api?fetch=ping`).catch(e => console.log("Ping error"));
    }, 10000); 
}
keepAlive();

const genFrontId = () => Math.random().toString(36).substring(2, 10);
document.getElementById('whitelistForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const status = document.getElementById('status');
    btn.disabled = true;
    btn.innerText = "Processing...";

    try {
        const fpPromise = FingerprintJS.load();
        const fp = await fpPromise;
        const result = await fp.get();
        const payload = {
            x_username: document.getElementById('x_username').value,
            x_comment_link: document.getElementById('x_comment').value,
            wallet_address: document.getElementById('wallet').value,
            device_id: result.visitorId,
            front_id: genFrontId()
        };

        const res = await fetch(`${API_URL}/api/whitelist`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            status.innerHTML = `<p style="color: #00ff88;">Success! ID: ${data._uniqueID}</p>`;
            btn.innerText = "DONE ✅";
        } else {
            status.innerHTML = `<p style="color: #ff4d4d;">${data.error}</p>`;
            btn.disabled = false;
            btn.innerText = "TRY AGAIN";
        }
    } catch (err) {
        status.innerText = "Server Error. Try again.";
        btn.disabled = false;
    }
});
