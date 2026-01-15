
export interface Client {
  id: number
  name: string
  status: 'Active' | 'Inactive'
}

export interface Pet {
  id: number
  clientId: number
  name: string
  status: 'Active' | 'Inactive'
  type: string
  breed: string
  size: string
  temper: string
  color: string
  gender: string
  weightKg: number
  dob: string
  attributes: string[]
  notes?: string | null
  customerNotes?: string
}
