module.exports = class SelectUsersDTO {
  id_account;
  name;
  surname;
  patronimyc;

  constructor(model) {
    this.id_account = model.id_account;
    this.name = model.name;
    this.surname = model.surname;
    this.patronimyc = model.patronimyc;
  }
};
