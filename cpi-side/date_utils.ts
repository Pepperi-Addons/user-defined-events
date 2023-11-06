// this is a temporary class to handle LastSyncTime. currently to LastSyncTime got from the server is incorrect.
// Remove this after this issue will be resolved on cpapi
export class DateUtils {
    static getLastSyncDataTimeMills(lastSyncMilliTicks: number): number {
        // lastSyncMilliTicks represents DateTime.Ticks / 10000.
        if (lastSyncMilliTicks > 0) {
            const nanoTicks = lastSyncMilliTicks * 10000;
            return DateUtils.fromTicksToMills(nanoTicks);
        } else {
            return 0; // 0 means resync
        }
    }
    static fromTicksToMills(ticks: number): number {
        return Number.isInteger(ticks)
            ? new Date(ticks / 1e4 + new Date('0001-01-01T00:00:00Z').getTime()).getTime()
            : 0;
    }
    static fromTicksToDate(ticks: number): string | null {
        return Number.isInteger(ticks)
            ? new Date(ticks / 1e4 + new Date('0001-01-01T00:00:00Z').getTime()).toDateString()
            : null;
    }
}