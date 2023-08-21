const trainService = require('../service/train-service');
const ApiError = require('../exceptions/api-error');

class TrainController {
  async addTrain(req, res, next) {
    try {
      const { account_id, date, day_team } = req.body;
      const newTrain = await trainService.addTrain(account_id, date, day_team);
      res.status(200).json(newTrain);
    } catch (e) {
      next(e);
    }
  }
  async addTeamTrain(req, res, next) {
    try {
      const { account_id, day_team, players } = req.body;

      const newTeamTrain = await trainService.addTeamTrain(account_id, day_team, players);
      res.status(200).json(newTeamTrain);
    } catch (e) {
      next(e);
    }
  }
  async getTeamTrain(req, res, next) {
    try {
      const { date, account_id, day_team } = req.query;
      const teamTrain = await trainService.getTeamTrain(account_id, day_team, date);
      res.status(200).json(teamTrain);
    } catch (e) {
      next(e);
    }
  }
  async getTeamDates(req, res, next) {
    try {
      const { day_team } = req.query;
      const dates = await trainService.getTeamDates(day_team);
      res.status(200).json(dates);
    } catch (e) {
      next(e);
    }
  }
  async checkTeam(req, res, next) {
    try {
      const { team } = req.params;
      const teamTrain = await trainService.checkTeam(team);
      res.status(200).json(teamTrain);
    } catch (e) {
      next(e);
    }
  }
  async getTeams(req, res, next) {
    try {
      const teams = await trainService.getTeams();
      res.status(200).json(teams);
    } catch (e) {
      next(e);
    }
  }
  async getOneTrain(req, res, next) {
    try {
      const account_id = req.params.account_id;
      const { id_train } = req.query;
      const train = await trainService.getOneTrain(account_id, id_train);
      res.status(200).json(train);
    } catch (e) {
      next(e);
    }
  }
  async getTrains(req, res, next) {
    try {
      const account_id = req.params.account_id;
      let { date_start, date_end, limit, page } = req.query;
      page = +page || 1;
      limit = +limit || 8;
      let offset = page * limit - limit;

      const trains = await trainService.getTrains(account_id, date_start, date_end, offset, limit);
      res.status(200).json(trains);
    } catch (e) {
      next(e);
    }
  }
  async getTeamRangeStat(req, res, next) {
    try {
      const { date_start, date_end, account_id, day_team } = req.query;

      const stat = await trainService.getTeamRangeStat(account_id, day_team, date_start, date_end);

      res.status(200).json(stat);
    } catch (e) {
      next(e);
    }
  }
  async getUserStat(req, res, next) {
    try {
      const { id } = req.params;
      const { id_train, date_start, date_end } = req.query;
      const stat = await trainService.getUserStat(id, id_train, date_start, date_end);

      res.status(200).json(stat);
    } catch (e) {
      next(e);
    }
  }
  async deletePlayerTrain(req, res, next) {
    try {
      const { account_id } = req.params;
      const { id_train } = req.query;
      const deletedTrain = await trainService.deletePlayerTrain(account_id, id_train);
      res.status(200).json(deletedTrain);
    } catch (e) {
      next(e);
    }
  }
  async deleteTrain(req, res, next) {
    try {
      const { account_id } = req.params;
      const { date, day_team } = req.query;
      const deletedTrain = await trainService.deleteTrain(account_id, date, day_team);
      res.status(200).json(deletedTrain);
    } catch (e) {
      next(e);
    }
  }
  async addAction(req, res, next) {
    try {
      const { id_train, name_action, result, condition, score, id_action_type, date, day_team } =
        req.body;
      const newAction = await trainService.addAction(
        id_train,
        name_action,
        result,
        condition,
        score,
        id_action_type,
        date,
        day_team,
      );

      res.status(200).json(newAction);
    } catch (e) {
      next(e);
    }
  }
  async getUserTrainActions(req, res, next) {
    try {
      let { id_train, limit, page } = req.query;
      page = +page || 1;
      limit = +limit || 8;
      let offset = page * limit - limit;
      const actions = await trainService.getUserTrainActions(id_train, limit, offset);
      res.status(200).json(actions);
    } catch (e) {
      next(e);
    }
  }
  async getTrainActions(req, res, next) {
    try {
      let { date, day_team, limit, page } = req.query;
      page = +page || 1;
      limit = +limit || 8;
      let offset = page * limit - limit;
      const trainActions = await trainService.getTrainActions(date, day_team, limit, offset);
      res.status(200).json(trainActions);
    } catch (e) {
      next(e);
    }
  }
  async deleteTrainAction(req, res, next) {
    try {
      const { id_action } = req.query;
      const updTrain = await trainService.deleteTrainAction(id_action);
      res.status(200).json(updTrain);
    } catch (e) {
      next(e);
    }
  }
  async addActionType(req, res, next) {
    try {
      const { name_type, result, win_condition, loss_condition, description } = req.body;
      const actionType = await trainService.addActionType(
        name_type,
        result,
        win_condition,
        loss_condition,
        description,
      );
      res.status(200).json(actionType);
    } catch (e) {
      next(e);
    }
  }
  async getActionsTypes(req, res, next) {
    try {
      const actionsTypes = await trainService.getActionsTypes();
      res.status(200).json(actionsTypes);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new TrainController();
