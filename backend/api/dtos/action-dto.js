module.exports = class ActionDTO {
  id_action;
  name_action;
  time;
  result;
  condition;
  day_team;
  date;
  id_train;
  id_action_type;
  score;
  fio;

  constructor(model) {
    this.fio = model.surname + ' ' + model.name + ' ' + model.patronimyc;
    this.id_action = model.id_action;
    this.name_action = model.name_action;
    this.time = model.time;
    this.result = model.result;
    this.condition = model.condition;
    this.day_team = model.day_team;
    this.date = model.date;
    this.id_action_type = model.id_action_type;
    this.score = model.score;
    this.id_train = model.id_train;
  }
};
