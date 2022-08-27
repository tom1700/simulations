type Task = (worker: Worker) => Promise<void>;

export class WorkersScheduler {
  private workers: Worker[];
  private taskQueue: Task[] = [];

  constructor(workers: Worker[]) {
    this.workers = workers;
  }

  public scheduleTask(task: Task) {
    this.taskQueue.push(task);
  }

  public async run() {
    await Promise.all(
      this.workers.map(
        (worker) =>
          new Promise<void>(async (res) => {
            while (true) {
              const hasMore = await this.takeTaskIfPresent(worker);
              if (!hasMore) {
                res();
                break;
              }
            }
          })
      )
    );
  }

  private async takeTaskIfPresent(worker: Worker) {
    const task = this.taskQueue.pop();
    if (!task) return false;
    await task(worker);
    return true;
  }
}
