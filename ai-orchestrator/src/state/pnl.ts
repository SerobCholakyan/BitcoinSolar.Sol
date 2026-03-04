let dailyPnl = 0;

export function addPnl(amount: number) {
  dailyPnl += amount;
}

export function getPnl() {
  return dailyPnl;
}

export function resetDailyPnl() {
  dailyPnl = 0;
}
