import fs from 'fs';
import path from 'path';

export interface Options {
  /** the storage path for snapshots */
  filePath?: string;
  /** name of the snapshot */
  name?: string;
  /** interval */
  interval?: number;
}

class HeapSnapshot {
  options: Required<Options>;
  scheduleId: NodeJS.Timeout | null = null;
  constructor(opt: Options) {
    this.options = {
      filePath: process.env.HOME || '.',
      name: process.type === 'renderer' ? 'renderer' : 'main',
      interval: 10 * 60 * 1000,
      ...opt,
    };
  }

  startSchedule() {
    this.stopSchedule();
    this.scheduleId = setInterval(() => {
      this.exec();
    }, this.options.interval);
  }

  stopSchedule() {
    if (this.scheduleId) {
      clearInterval(this.scheduleId);
    }
    this.scheduleId = null;
  }

  exec() {
    const { filePath, name } = this.options;
    const uptime = Math.floor(process.uptime());
    const dir = path.join(filePath, `./${name}/`);
    fs.mkdirSync(dir, { recursive: true });
    const fileName = path.join(dir, `./${name}-${uptime}.heapsnapshot`);
    console.log('heap snapshot save as:', fileName);
    const result = process.takeHeapSnapshot(fileName);
    console.log(`heap snapshot save ${result ? 'ok' : 'failed'}`);
    return fileName;
  }
}

export default HeapSnapshot;
