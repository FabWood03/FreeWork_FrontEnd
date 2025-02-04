export class UserResponseDTO {
  id: number;
  name: string;
  surname: string;
  nickname: string;
  email: string;
  birthDate: string;
  fiscalCode: string;
  role: string;
  active: boolean;
  cartId: number;
  imageFolderUrl?: string;
  rating: number;
  portfolio: string[];
  skills: string[];
  education: string;
  bio: string;
  basedIn: string;
  languages: string[];

  constructor(
    id: number = 0,
    name: string = '',
    surname: string = '',
    nickname: string = '',
    email: string = '',
    birthDate: string = '',
    fiscalCode: string = '',
    role: string = '',
    active: boolean = false,
    cartId: number = 0,
    imageFolderUrl?: string,
    rating: number = 0.0,
    portfolio: string[] = [],
    skills: string[] = [],
    education: string = '',
    bio: string = '',
    basedIn: string = '',
    languages: string[] = []
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.nickname = nickname;
    this.email = email;
    this.birthDate = birthDate;
    this.fiscalCode = fiscalCode;
    this.role = role;
    this.active = active;
    this.cartId = cartId;
    this.imageFolderUrl = imageFolderUrl;
    this.rating = rating;
    this.portfolio = portfolio;
    this.skills = skills;
    this.education = education;
    this.bio = bio;
    this.basedIn = basedIn;
    this.languages = languages;
  }

  static fromUserData(seller: UserResponseDTO) {
    return new UserResponseDTO(
      seller.id,
      seller.name,
      seller.surname,
      seller.nickname,
      seller.email,
      seller.birthDate,
      seller.fiscalCode,
      seller.role,
      seller.active,
      seller.cartId,
      seller.imageFolderUrl,
      seller.rating,
      seller.portfolio,
      seller.skills,
      seller.education,
      seller.bio,
      seller.basedIn,
      seller.languages
    );
  }
}
