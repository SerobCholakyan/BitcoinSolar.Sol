use clap::Parser;
use reqwest::blocking::Client;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::thread;
use std::time::Duration;

/// BLSR Native Miner — Singularity Engine
#[derive(Parser, Debug)]
#[command(author, version, about)]
struct Args {
    /// Your BLSR / Polygon address
    #[arg(long)]
    address: String,

    /// Backend URL (e.g. http://localhost:8080)
    #[arg(long, default_value = "http://localhost:8080")]
    backend: String,

    /// Number of worker threads
    #[arg(long, default_value_t = 4)]
    threads: u8,

    /// Optional Lynnic black-hole wallpaper path/URL
    #[arg(long)]
    wallpaper: Option<String>,
}

#[derive(Debug, Deserialize)]
struct WorkResponse {
    job_id: String,
    seed: String,
    target: String,
}

#[derive(Debug, Serialize)]
struct ShareRequest<'a> {
    job_id: &'a str,
    address: &'a str,
    nonce: String,
    hash: String,
}

fn main() {
    let args = Args::parse();
    print_banner(&args);

    let client = Client::new();

    loop {
        match fetch_work(&client, &args.backend) {
            Ok(work) => {
                println!(
                    "→ New job: {}  seed={}  target={}",
                    work.job_id, work.seed, work.target
                );
                run_job(&client, &args, work);
            }
            Err(e) => {
                eprintln!("⚠ Failed to fetch work: {e}");
                thread::sleep(Duration::from_secs(5));
            }
        }
    }
}

/// Lynnic‑style Black Hole ASCII Banner
fn print_banner(args: &Args) {
    println!();
    println!("                .         ");
    println!("           .         .    ");
    println!("        .     *   .       ");
    println!("           .       *      ");
    println!("     .    ███████████    .");
    println!("         █████████████     ");
    println!("       ███████████████     ");
    println!("         █████████████     ");
    println!("     .    ███████████    .");
    println!("           .       *      ");
    println!("        .     *   .       ");
    println!("           .         .    ");
    println!("                .         ");
    println!();
    println!("   🌑  BLSR NATIVE MINER — SINGULARITY ENGINE");
    println!("   -------------------------------------------");
    println!("   Address  : {}", args.address);
    println!("   Backend  : {}", args.backend);
    println!("   Threads  : {}", args.threads);
    if let Some(wp) = &args.wallpaper {
        println!("   Wallpaper: {}", wp);
    }
    println!("   -------------------------------------------");
    println!();
}

fn fetch_work(client: &Client, backend: &str) -> Result<WorkResponse, reqwest::Error> {
    let url = format!("{backend}/work");
    let res = client.get(url).send()?.error_for_status()?;
    res.json()
}

fn run_job(client: &Client, args: &Args, work: WorkResponse) {
    let target_bytes = match hex::decode(&work.target) {
        Ok(b) => b,
        Err(e) => {
            eprintln!("⚠ Invalid target from server: {e}");
            return;
        }
    };

    let seed_bytes = match hex::decode(&work.seed) {
        Ok(b) => b,
        Err(e) => {
            eprintln!("⚠ Invalid seed from server: {e}");
            return;
        }
    };

    let mut handles = Vec::new();

    for thread_id in 0..args.threads {
        let client = client.clone();
        let address = args.address.clone();
        let job_id = work.job_id.clone();
        let target_bytes = target_bytes.clone();
        let seed_bytes = seed_bytes.clone();
        let backend = args.backend.clone();

        let handle = thread::spawn(move || {
            let mut nonce: u64 = thread_id as u64 * 1_000_000_000;

            loop {
                let mut hasher = Sha256::new();
                hasher.update(&seed_bytes);
                hasher.update(&nonce.to_le_bytes());
                let hash = hasher.finalize();
                let hash_vec = hash.to_vec();

                if hash_vec <= target_bytes {
                    let hash_hex = hex::encode(&hash_vec);
                    let nonce_hex = hex::encode(nonce.to_le_bytes());

                    println!(
                        "✔ [Thread {thread_id}] Share found! nonce={nonce} hash={hash_hex}"
                    );

                    let share = ShareRequest {
                        job_id: &job_id,
                        address: &address,
                        nonce: nonce_hex,
                        hash: hash_hex,
                    };

                    if let Err(e) = submit_share(&client, &backend, &share) {
                        eprintln!("⚠ [Thread {thread_id}] Failed to submit share: {e}");
                    }

                    break;
                }

                nonce = nonce.wrapping_add(1);
            }
        });

        handles.push(handle);
    }

    for h in handles {
        let _ = h.join();
    }
}

fn submit_share(
    client: &Client,
    backend: &str,
    share: &ShareRequest,
) -> Result<(), reqwest::Error> {
    let url = format!("{backend}/share");
    let res = client.post(url).json(share).send()?.error_for_status()?;
    println!("✓ Share accepted: {}", res.text().unwrap_or_default());
    Ok(())
}
