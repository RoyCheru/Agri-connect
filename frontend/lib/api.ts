
export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const response = await fetch(`/api${path}`, {
    ...options,
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  return response
}
