export interface Roles {
  editor?: boolean;
  admin?: boolean;
}

export interface UserInterface {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  photoUrl?: string;
  gastosAprobados?: string;
  gastosAControlar?: string;
  gastosRechazados?: string;
  roles: Roles;
}