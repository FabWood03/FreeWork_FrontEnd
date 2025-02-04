export class TicketResponseDTO {
  id: number;
  title: string;
  description: string;
  state: string;
  type: string;
  creationDate: Date;
  priorityFlag: string;
  userName: string;
  userSurname: string;
  userPhoto: string;
  userId: number;

  constructor(
    id: number,
    title: string,
    description: string,
    state: string,
    type: string,
    creationDate: Date,
    priorityFlag: string,
    userName: string,
    userSurname: string,
    userPhoto: string,
    userId: number
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.state = state;
    this.type = type;
    this.creationDate = creationDate;
    this.priorityFlag = priorityFlag;
    this.userName = userName;
    this.userSurname = userSurname;
    this.userPhoto = userPhoto;
    this.userId = userId;
  }

  static fromTicketDTO(data: TicketResponseDTO) {
    return new TicketResponseDTO(
      data.id,
      data.title,
      data.description,
      data.state,
      data.type,
      data.creationDate,
      data.priorityFlag,
      data.userName,
      data.userSurname,
      data.userPhoto,
      data.userId
    );
  }
}
