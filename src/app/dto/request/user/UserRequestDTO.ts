export class UserRequestDTO {
  name: string;
  surname: string;
  nickname: string;
  email: string;
  password: string;
  birthDate?: string;
  bio?: string;
  role?: string;
  active?: boolean;
  ranking?: number;
  cartId?: number;
  fiscalCode?: string;

  constructor(
    name: string,
    surname: string,
    nickname: string,
    email: string,
    password: string,
    birthDate?: string,
    bio?: string,
    role?: string,
    active?: boolean,
    ranking?: number,
    cartId?: number,
    fiscalCode?: string
  ) {
    this.name = name;
    this.surname = surname;
    this.nickname = nickname;
    this.email = email;
    this.password = password;
    this.birthDate = birthDate;
    this.bio = bio;
    this.role = role;
    this.active = active;
    this.ranking = ranking;
    this.cartId = cartId;
    this.fiscalCode = fiscalCode;
  }
}
