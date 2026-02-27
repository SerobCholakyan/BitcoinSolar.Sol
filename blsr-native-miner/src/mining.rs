use tokio::time::{sleep, Duration};

pub async fn start_mining() {
    loop {
        println!("Mining...");
        sleep(Duration::from_secs(2)).await;
    }
}
