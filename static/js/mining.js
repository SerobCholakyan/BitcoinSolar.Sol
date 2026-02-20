async function startMining() {
    const addr = document.getElementById('wallet').value;
    const status = document.getElementById('status');
    
    if (!addr.startsWith('0x')) return alert("Invalid Address");

    status.innerText = "CONNECTING TO INFURA NODE...";
    
    const stats = await fetch('/get_difficulty').then(r => r.json());
    
    setTimeout(async () => {
        const res = await fetch('/mine', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({address: addr})
        });
        
        const data = await res.json();
        if (data.status === "success") {
            status.innerText = "HASH ACCEPTED. REWARD PENDING.";
            status.style.color = "#00ff00";
            new Audio('/static/audio/success.mp3').play();
        }
    }, stats.difficulty * 1000);
}
