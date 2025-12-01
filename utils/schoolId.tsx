export function generateSchoolId(level: string, registrationYear: number, existingIds: string[]): string {
  const levelPrefix = level.charAt(0).toUpperCase();
  let isUnique = false;
  let schoolId = '';
  
  while (!isUnique) {
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit number
    schoolId = `SCH-${levelPrefix}-${registrationYear}-${randomNumber}`;
    isUnique = !existingIds.includes(schoolId);
  }
  
  return schoolId;
}
