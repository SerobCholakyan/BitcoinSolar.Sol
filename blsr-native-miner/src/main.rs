mod mining;
mod utils;

#[tokio::main]
async fn main() {
    println!("Starting BitcoinSolar native miner...");
    mining::start_mining().await;
}
