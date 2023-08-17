export const userRole = (type: string) => {
   switch (type) {
      case "guest": return "Candidate";
      case "user": return "Staff";
      case "admin": return "Admin";
   }
}