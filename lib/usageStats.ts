import { getActiveBundle, insertUsageSnapshot, insertAppUsage } from './db';
import UsageStats, { AppUsageItem } from '../modules/usage-stats/package/src/index';

export async function syncUsageData(): Promise<void> {
  const bundle = await getActiveBundle();
  if (!bundle) {
    throw new Error('No active bundle found');
  }

  const startTime = new Date(bundle.purchased_at).getTime();
  const endTime = Date.now();

  try {
    const totalBytes = await UsageStats.getTotalMobileDataUsage(startTime, endTime);
    const appUsageList = await UsageStats.getPerAppMobileDataUsage(startTime, endTime);

    const totalMb = totalBytes / (1024 * 1024);
    const recordedAt = new Date().toISOString();

    const snapshotId = await insertUsageSnapshot({
      bundle_id: bundle.id,
      total_used_mb: totalMb,
      recorded_at: recordedAt,
    });

    for (const item of appUsageList) {
      await insertAppUsage({
        snapshot_id: snapshotId,
        app_name: item.appLabel,
        package_name: item.packageName,
        used_mb: item.bytesUsed / (1024 * 1024),
      });
    }
  } catch (error: any) {
    if (error?.code === 'PERMISSION_DENIED') {
      throw new Error('Usage access permission not granted');
    }
    throw error;
  }
}