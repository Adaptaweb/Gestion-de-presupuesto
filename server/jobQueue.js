let jobIdCounter = 0;
const jobs = new Map();

const TTL = 1000 * 60 * 5;

const CLEANUP_INTERVAL = setInterval(() => {
  const now = Date.now();
  for (const [id, job] of jobs) {
    if (now - job.doneAt > TTL) jobs.delete(id);
  }
}, 60000);

export function createJob(type, asyncFn) {
  const id = `job-${Date.now()}-${++jobIdCounter}`;
  const job = { id, type, status: 'pending', result: null, error: null, doneAt: null };
  jobs.set(id, job);

  job.status = 'running';
  asyncFn()
    .then(result => {
      job.status = 'done';
      job.result = result;
      job.doneAt = Date.now();
    })
    .catch(err => {
      job.status = 'error';
      job.error = err.message || String(err);
      job.doneAt = Date.now();
    });

  return job;
}

export function getJob(jobId) {
  return jobs.get(jobId) || null;
}

export default { createJob, getJob };
