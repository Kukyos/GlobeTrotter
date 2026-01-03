export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
  role: "admin" | "user" | "guide";
  bio?: string;
  phone?: string;
  city?: string;
  country?: string;
}
