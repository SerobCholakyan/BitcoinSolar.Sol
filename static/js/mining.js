async function startMining() {
    const addr = document.getElementById('wallet').value;
    const status = document.getElementById('status');
    const loader = document.getElementById('loader');

    if (!addr.startsWith('0x')) return alert("Enter a Polygon Address");

    loader.style.display = "block";
    status.innerText = "SYNCHRONIZING WITH GLOBAL NODE...";

    // Fetch dynamic difficulty
    const stats = await fetch('/get_difficulty').then(r => r.json());
    
    // Simulate mining "work" delay
    setTimeout(async () => {
        const res = await fetch('/mine', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({address: addr})
        });

        loader.style.display = "none";
        const result = await res.json();

        if (result.status === "success") {
            new Audio('/static/audio/success.mp3').play();
            status.innerText = "BLOCK FOUND! TOKENS INBOUND.";
            status.style.color = "#00ff00";
        }
    }, stats.difficulty * 1000);
}
