import { useState } from 'react';
import { jobs, Job } from './data/jobs';

function App() {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);

  const filterByLocation = (location: string) => {
    setFilteredJobs(jobs.filter(job => job.location === location));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Danh sách công việc</h1>
      </header>
      <main className="p-4">
        <div className="mb-4">
          <button
            onClick={() => filterByLocation("Hà Nội")}
            className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Hà Nội
          </button>
          <button
            onClick={() => setFilteredJobs(jobs)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Tất cả
          </button>
        </div>
        <ul className="space-y-4 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job: Job) => (
            <li key={job.id} className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-50">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.company} - {job.location}</p>
              <p className="text-green-600 font-bold">{job.salary}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;