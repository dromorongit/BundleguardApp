import { NativeModule, requireNativeModule } from 'expo';

export interface AppUsageItem {
  packageName: string;
  appLabel: string;
  bytesUsed: number;
}

interface UsageStatsEvents extends Record<string, never> { }

declare class UsageStats extends NativeModule<UsageStatsEvents> {
  hasUsageAccessPermission(): boolean;
  openUsageAccessSettings(): void;
  getTotalMobileDataUsage(startTime: number, endTime: number): Promise<number>;
  getPerAppMobileDataUsage(startTime: number, endTime: number): Promise<AppUsageItem[]>;
}

const UsageStatsModule = requireNativeModule<UsageStats>('UsageStats');

export default UsageStatsModule;