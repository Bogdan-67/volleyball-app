module.exports = class ActionTypeDto {
  id_action_type;
  name_type;
  result;
  win_condition;
  loss_condition;
  description;

  constructor(model) {
    this.id_action_type = model.id_action_type;
    this.name_type = model.name_type;
    this.result = model.result.split('; ');
    this.win_condition = model.win_condition.split('; ');
    this.loss_condition = model.loss_condition.split('; ');
    this.description = model.description;
  }
};
