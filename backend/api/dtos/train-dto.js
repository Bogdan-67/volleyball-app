module.exports = class TrainDTO {
  fio;
  inning_stat;
  blocks_stat;
  attacks_stat;
  catch_stat;
  defence_stat;
  support_stat;
  id_train;
  id_account;

  constructor(model) {
    this.fio = model.surname + ' ' + model.name + ' ' + model.patronimyc;
    this.inning_stat = String(model.inning_stat);
    this.blocks_stat = String(model.blocks_stat);
    this.attacks_stat = String(model.attacks_stat);
    this.catch_stat = String(model.catch_stat);
    this.defence_stat = String(model.defence_stat);
    this.support_stat = String(model.support_stat);
    this.id_train = model.id_train;
    this.id_account = model.account_id;
  }
};
