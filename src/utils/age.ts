export function getAgeFromDob(dob: string): string {
  const birth = new Date(dob)
  const now = new Date()

  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()

  if (months < 0) {
    years--
    months += 12
  }

  return `${years}y ${months}m`
}