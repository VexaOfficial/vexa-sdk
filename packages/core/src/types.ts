export interface PoolSnapshot {
  poolAddress: string;
  tokenAAmount: number;
  tokenBAmount: number;
  timestamp: number;
}

export interface LiquidityEvent {
  type: 'add' | 'remove';
  poolAddress: string;
  amount: number; // in lamports or token units
  usdValue?: number;
  timestamp: number;
}

export interface AutomationAction {
  type: 'autoSwap' | 'autoSend' | 'autoWithdrawLP';
  params: Record<string, any>;
}