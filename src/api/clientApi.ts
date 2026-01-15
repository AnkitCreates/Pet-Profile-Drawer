export async function fetchClients() {
  const res = await fetch('http://localhost:4000/clients')
  return res.json()
}