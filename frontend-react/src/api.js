const API_URL = "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  return data;
}

export const api = {
  signup: (payload) =>
    request("/signup", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) =>
    request("/login", { method: "POST", body: JSON.stringify(payload) }),
  getJobs: () => request("/jobs"),
  postJob: (payload) =>
    request("/jobs", { method: "POST", body: JSON.stringify(payload) }),
  apply: (payload) =>
    request("/apply", { method: "POST", body: JSON.stringify(payload) }),
  myApplications: (studentId) => request(`/my-applications/${studentId}`),
  myJobs: (companyId) => request(`/my-jobs/${companyId}`),
  jobApplicants: (jobId) => request(`/job-applicants/${jobId}`),
};
