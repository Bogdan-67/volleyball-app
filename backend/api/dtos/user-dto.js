module.exports = class UserDTO {
  id_account;
  id_user;
  name;
  surname;
  patronimyc;
  email;
  phone;
  team;
  login;
  role;
  img;

  constructor(model) {
    this.id_account = model.id_account;
    this.id_user = model.id_user;
    this.name = model.name;
    this.surname = model.surname;
    this.patronimyc = model.patronimyc;
    this.email = model.email;
    this.phone = model.phone;
    this.team = model.team;
    this.login = model.login;
    this.role = model.role_name;
    this.img = model.img;
  }
};
