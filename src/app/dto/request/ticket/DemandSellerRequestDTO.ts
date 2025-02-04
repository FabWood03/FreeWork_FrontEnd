export class DemandSellerRequestDTO {
  title: string;
  description: string;
  birthDate: string;
  education: string;
  fiscalCode: string;
  basedIn: string;
  skills: string[];
  languages: string[] = [];

  constructor(
    title: string = '',
    description: string = '',
    birthDate: string = '',
    education: string = '',
    fiscalCode: string = '',
    baseIn: string = '',
    skills: string[] = [],
    languages: string[] = []
  ) {
    this.title = title;
    this.description = description;
    this.birthDate = birthDate;
    this.education = education;
    this.fiscalCode = fiscalCode;
    this.basedIn = baseIn;
    this.skills = skills;
    this.languages = languages;
  }
}
