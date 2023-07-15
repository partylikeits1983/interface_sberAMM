export interface LiquidityPosition {
  PID: number;
  token0: string;
  token1: string;
  poolBalance0: number;
  poolBalance1: number;
  userBalance0: number;
  userBalance1: number;
  userFees0: number;
  userFees1: number;
  poolFeeRate: number;
  isStable: boolean;
}