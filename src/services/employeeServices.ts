export async function generateCardName(employeeName:string){
  const employeeNameUpperCase:string = employeeName.toUpperCase();
  const employeeNameToArray:string[] = employeeNameUpperCase.split(" ").filter((name)=> name.length >= 3);

  const firstName = employeeNameToArray[0]
  const lastName = employeeNameToArray[employeeNameToArray.length - 1]
  let midNames = ""

  employeeNameToArray.filter((name, index)=> index).slice(0,-1).map(name => midNames += ` ${name.charAt(0)}. `)

  return `${firstName}${midNames.toUpperCase()}${lastName}`.toUpperCase()


}

