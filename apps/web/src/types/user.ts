/**
 * Tipos para usuário com campos customizados do BetterAuth
 */

export type UserStatus = "online" | "offline" | "away" | "busy";

export type UserRole = "admin" | "manager" | "member" | "guest";

export interface CustomUser {
  // Campos padrão do BetterAuth
  id: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  image: string | null;
  createdAt: number;
  updatedAt: number;

  // Campos customizados adicionados
  role?: string;
  department?: string;
  status?: string;
  bio?: string;
  location?: string;
  website?: string;
  skills?: string[]; // Parseado de JSON
  projectIds?: string[]; // Parseado de JSON
  lastActive?: number;
}

export interface UpdateProfileData {
  role?: string;
  department?: string;
  status?: UserStatus;
  bio?: string;
  location?: string;
  website?: string;
}
