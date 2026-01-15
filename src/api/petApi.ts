export async function fetchPetsByClient(clientId: number) {
  const res = await fetch(
    `http://localhost:4000/pets?clientId=${clientId}&_embed=vaccinations&_embed=grooming&_embed=bookings`
  )
  return res.json()
}

// update api
export async function updatePet(pet: any) {
  const res = await fetch(`http://localhost:4000/pets/${pet.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pet)
  })

  if (!res.ok) {
    throw new Error('Failed to update pet')
  }

  return res.json()
}

// in deactivate Pet
export async function deactivatePet(id: number, reason: string) {
  const res = await fetch(`http://localhost:4000/pets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "Inactive",
      deactivationReason: reason,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to deactivate pet");
  }

  return res.json();
}
