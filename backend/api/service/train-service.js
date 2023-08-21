const db = require('../db');
const ActionDTO = require('../dtos/action-dto');
const ActionTypeDto = require('../dtos/actionType-dto');
const TrainDTO = require('../dtos/train-dto');
const ApiError = require('../exceptions/api-error');

class TrainService {
  // Добавление тренировки пользователю
  async addTrain(account_id, date, day_team) {
    if (!account_id) {
      throw ApiError.UnauthorisedError();
    }
    if (!day_team) {
      throw ApiError.BadRequest('Не введено название команды!');
    }
    if (!date) {
      throw ApiError.BadRequest('Не введена дата!');
    }
    const newTrain = await db.query(
      `INSERT INTO trainings(account_id, day_team, date) VALUES ($1, $2, $3) RETURNING *`,
      [account_id, day_team, date],
    );
    const user = await db.query(
      `SELECT * FROM accounts LEFT JOIN users ON accounts.id_user=users.id_user WHERE id_account=$1`,
      [account_id],
    );
    return new TrainDTO({ ...newTrain.rows[0], ...user.rows[0] });
  }
  // Добавление тренировок пользователям введенной команды
  async addTeamTrain(account_id, day_team, players) {
    if (!account_id) {
      throw ApiError.UnauthorisedError();
    }
    if (!day_team) {
      throw ApiError.BadRequest('Не введено название команды!');
    }
    if (!players) {
      throw ApiError.BadRequest('В команде нет ни одного игрока!');
    }
    if (!Array.isArray(players)) {
      throw ApiError.BadRequest('players не является массивом!');
    }

    const errors = players.map(async (item) => {
      if (typeof item != 'number') {
        throw ApiError.BadRequest('id_account не является числом!');
      }
      const checkPlayer = await db.query(`SELECT * FROM accounts WHERE id_account = $1`, [item]);
      if (!checkPlayer.rows[0]) {
        throw ApiError.BadRequest('Введен несуществующий пользователь!');
      }
      var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '-');

      const checkTeamToday = await db.query(
        `SELECT * FROM trainings WHERE date = $1 AND day_team = $2`,
        [utc, day_team],
      );
      if (checkTeamToday.rows[0]) {
        throw ApiError.BadRequest('У этой команды уже есть тренировка на сегодня!');
      }
    });
    await Promise.all(errors);

    const newTrain = [];

    const promises = players.map(async (account_id) => {
      const newUserTrain = await db.query(
        `INSERT INTO trainings(account_id, day_team) VALUES ($1, $2) RETURNING *`,
        [account_id, day_team],
      );
      const user = await db.query(
        `SELECT * FROM users LEFT JOIN accounts ON users.id_user=accounts.id_user WHERE id_account = $1`,
        [account_id],
      );
      const newUserTrainDto = new TrainDTO({ ...newUserTrain.rows[0], ...user.rows[0] });
      newTrain.push(newUserTrainDto);
    });
    await Promise.all(promises);

    return newTrain;
  }

  // Получение тренировок пользователей введенной команды
  async getTeamTrain(account_id, day_team, date) {
    if (!account_id) {
      throw ApiError.UnauthorisedError();
    }
    if (!day_team) {
      throw ApiError.BadRequest('Не введено название команды!');
    }
    if (!date) {
      throw ApiError.BadRequest('Не введена дата!');
    }

    const train = await db.query(
      `SELECT * FROM trainings LEFT JOIN accounts ON trainings.account_id=accounts.id_account LEFT JOIN users ON users.id_user=accounts.id_user WHERE day_team = $1 AND date = $2`,
      [day_team, date],
    );

    if (!train.rows[0]) {
      throw ApiError.BadRequest('Тренировка не найдена.');
    }

    const trainDto = train.rows.map((obj) => new TrainDTO(obj));

    return trainDto;
  }

  // Получение дат тренировок команды
  async getTeamDates(day_team) {
    if (!day_team) {
      throw ApiError.BadRequest('Не введено название команды!');
    }

    const data = await db.query(`SELECT DISTINCT date FROM trainings WHERE day_team = $1`, [
      day_team,
    ]);

    const dates = data.rows.map((obj) => {
      return obj.date;
    });

    return dates;
  }

  // Проверка на наличие у команды тренировки на сегодня
  async checkTeam(team) {
    const utc = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    const teamData = await db.query(`SELECT * FROM trainings WHERE day_team = $1 AND date = $2`, [
      team,
      utc,
    ]);
    if (teamData.rows[0]) return false;
    else return true;
  }

  // Получение списка всех команд
  async getTeams() {
    const teams = await db.query(`SELECT DISTINCT day_team FROM trainings`);
    const res = teams.rows.map((obj) => {
      const team = obj.day_team;
      return team;
    });
    return res;
  }

  // Получение тренировки пользователя по команде и дате
  async getOneTrain(account_id, id_train) {
    const train = await db.query(
      `SELECT * FROM trainings WHERE account_id = $1 AND id_train = $2`,
      [account_id, id_train],
    );
    return train.rows[0];
  }

  // Получение тренировок пользователя за заданный период
  async getTrains(account_id, date_start, date_end, offset, limit) {
    if (!account_id) {
      throw ApiError.UnauthorisedError();
    }
    if (!date_end) {
      let new_date = new Date().toISOString();
      date_end = new_date;
    }
    if (!date_start) {
      const date = await db.query(`SELECT MIN(date) FROM trainings WHERE account_id = $1`, [
        account_id,
      ]);
      date_start = date.rows[0].min;
    }
    const trains = await db.query(
      `SELECT * FROM trainings WHERE account_id = $1 AND date BETWEEN $2 AND $3 ORDER BY date DESC`,
      [account_id, date_start, date_end],
    );

    const count = trains.rows.length;
    const trainsPage = trains.rows.slice(offset, offset + limit);

    return { count: count, rows: [...trainsPage] };
  }

  // Получение данных команды за период времени
  async getTeamRangeStat(account_id, day_team, date_start, date_end) {
    if (!account_id) {
      throw ApiError.UnauthorisedError();
    }
    if (!day_team) {
      throw ApiError.BadRequest('Не введено название команды!');
    }
    if (!date_end) {
      let new_date = new Date().toISOString();
      date_end = new_date;
    }
    if (!date_start) {
      const date = await db.query(`SELECT MIN(date) FROM trainings WHERE account_id = $1`, [
        account_id,
      ]);
      date_start = date.rows[0].min;
    }
    const trains = await db.query(`SELECT DISTINCT account_id FROM trainings WHERE day_team = $1`, [
      day_team,
    ]);

    const players = trains.rows.map((obj) => {
      return obj.account_id;
    });

    let actionsTypes = await db.query(`SELECT * FROM action_types`);
    actionsTypes = actionsTypes.rows.map((obj) => {
      const newObj = {
        id_action_type: obj.id_action_type,
        name_type: obj.name_type,
      };
      return newObj;
    });

    const stat = players.map(async (player) => {
      let playerStat = {
        fio: '',
        inning_stat: 0,
        attacks_stat: 0,
        blocks_stat: 0,
        catch_stat: 0,
        defence_stat: 0,
        support_stat: 0,
      };
      const fioQuery = await db.query(
        `SELECT name, surname, patronimyc FROM users LEFT JOIN accounts ON accounts.id_user = users.id_user WHERE id_account = $1`,
        [player],
      );
      const fio =
        fioQuery.rows[0].surname + ' ' + fioQuery.rows[0].name + ' ' + fioQuery.rows[0].patronimyc;

      playerStat['fio'] = fio;
      for (let i = 1; i <= actionsTypes.length; i++) {
        const actions = await db.query(
          `SELECT * FROM actions WHERE id_action_type = $1 AND account_id = $2 AND day_team = $3 AND date BETWEEN $4 AND $5`,
          [i, player, day_team, date_start, date_end],
        );

        const winCount = actions.rows.filter((obj) => obj.score === 1).length;
        const lossCount = actions.rows.filter((obj) => obj.score === -1).length;
        const count = actions.rows.length;

        const actionStat = (winCount - lossCount) / count > 0 ? (winCount - lossCount) / count : 0;

        const actionStatFixed = +actionStat.toFixed(2);

        switch (i) {
          // Подача
          case 1:
            playerStat.inning_stat = actionStatFixed;
            break;
          // Атака
          case 2:
            playerStat.attacks_stat = actionStatFixed;
            break;
          // Блокирование
          case 3:
            playerStat.blocks_stat = actionStatFixed;
            break;
          // Прием подачи
          case 4:
            playerStat.catch_stat = actionStatFixed;
            break;
          // Защита
          case 5:
            playerStat.defence_stat = actionStatFixed;
            break;
          // Передача на удар
          case 6:
            playerStat.support_stat = actionStatFixed;
            break;
        }
      }
      return playerStat;
    });

    let result = [];

    await Promise.all(stat).then((results) => {
      result = results.map((result) => result);
    });

    return result;
  }

  // Получение статистики пользователя
  async getUserStat(id, id_train, date_start, date_end) {
    if (!id) {
      throw ApiError.BadRequest('ID пользователя null');
    }
    if (!date_end || date_end === 'undefined') {
      let new_date = new Date().toISOString();
      date_end = new_date;
    }
    if (!date_start || date_start === 'undefined') {
      const date = await db.query(`SELECT MIN(date) FROM actions WHERE account_id = $1`, [id]);
      date_start = date.rows[0].min;
    }

    let playerStat = {
      inning: {},
      attacks: {},
      blocks: {},
      catch: {},
      defence: {},
      support: {},
    };
    for (let i = 1; i <= 6; i++) {
      let actions = {};
      if (!id_train || id_train === 'undefined') {
        actions = await db.query(
          `SELECT * FROM actions WHERE id_action_type = $1 AND account_id = $2 AND date BETWEEN $3 AND $4`,
          [i, id, date_start, date_end],
        );
      } else {
        actions = await db.query(
          `SELECT * FROM actions WHERE id_action_type = $1 AND account_id = $2 AND id_train = $3`,
          [i, id, id_train],
        );
      }
      const winCount = actions.rows.filter((obj) => obj.score === 1).length;
      const lossCount = actions.rows.filter((obj) => obj.score === -1).length;
      const count = actions.rows.length;

      const actionStat = (winCount - lossCount) / count > 0 ? (winCount - lossCount) / count : 0;
      const actionStatFixed = +actionStat.toFixed(2);

      const statHolder = (name) => {
        playerStat[name][name + '_stat'] = actionStatFixed;
        playerStat[name][name + '_winCount'] = winCount;
        playerStat[name][name + '_lossCount'] = lossCount;
      };

      switch (i) {
        // Подача
        case 1:
          statHolder('inning');
          break;
        // Атака
        case 2:
          statHolder('attacks');
          break;
        // Блокирование
        case 3:
          statHolder('blocks');
          break;
        // Прием подачи
        case 4:
          statHolder('catch');
          break;
        // Защита
        case 5:
          statHolder('defence');
          break;
        // Передача на удар
        case 6:
          statHolder('support');
          break;
      }
    }
    return playerStat;
  }

  // Удаление тренировки пользователя
  async deletePlayerTrain(account_id, id_train) {
    if (!account_id) {
      throw ApiError.UnauthorisedError();
    }

    const deletedTrain = await db.query(`DELETE FROM trainings WHERE id_train = $1 RETURNING *`, [
      id_train,
    ]);

    return deletedTrain.rows[0];
  }

  // Удаление тренировки
  async deleteTrain(account_id, date, day_team) {
    if (!account_id) {
      throw ApiError.UnauthorisedError();
    }
    const deletedTrain = await db.query(
      `DELETE FROM trainings WHERE date = $1 AND day_team = $2 RETURNING *`,
      [date, day_team],
    );

    return deletedTrain.rows;
  }

  // Перерасчет столбца статистики
  async calculateTrain(id_action_type, id_train, name_action) {
    const updTrain = async (column) => {
      const win_count = await db.query(
        `SELECT COUNT(*) FROM actions WHERE score=1 AND name_action=$1 AND id_train = $2`,
        [name_action, id_train],
      );
      const winCNum = Number(win_count.rows[0].count);

      const loss_count = await db.query(
        `SELECT COUNT(*) FROM actions WHERE score=-1 AND name_action=$1 AND id_train = $2`,
        [name_action, id_train],
      );
      const lossCNum = Number(loss_count.rows[0].count);

      const count = await db.query(
        `SELECT COUNT(*) FROM actions WHERE name_action=$1 AND id_train=$2`,
        [name_action, id_train],
      );
      const cNum = Number(count.rows[0].count);

      const stat = (winCNum - lossCNum) / cNum > 0 ? (winCNum - lossCNum) / cNum : 0;

      const statFixed = +stat.toFixed(2);

      const upd = await db.query(
        `UPDATE trainings SET ${column} = $1 WHERE id_train = $2 RETURNING *`,
        [statFixed, id_train],
      );

      return upd.rows[0];
    };

    let upd = { initial: 'initial' };

    switch (id_action_type) {
      // Подача
      case 1:
        await updTrain('inning_stat')
          .then((data) => {
            upd = data;
          })
          .catch((err) => {
            throw ApiError.BadRequest('Ошибка базы данных');
          });
        break;
      // Атака
      case 2:
        await updTrain('attacks_stat')
          .then((data) => {
            upd = data;
          })
          .catch((err) => {
            throw ApiError.BadRequest('Ошибка базы данных');
          });
        break;
      // Блокирование
      case 3:
        await updTrain('blocks_stat')
          .then((data) => {
            upd = data;
          })
          .catch((err) => {
            throw ApiError.BadRequest('Ошибка базы данных');
          });
        break;
      // Прием подачи
      case 4:
        await updTrain('catch_stat')
          .then((data) => {
            upd = data;
          })
          .catch((err) => {
            throw ApiError.BadRequest('Ошибка базы данных');
          });
        break;
      // Защита
      case 5:
        await updTrain('defence_stat')
          .then((data) => {
            upd = data;
          })
          .catch((err) => {
            throw ApiError.BadRequest('Ошибка базы данных');
          });
        break;
      // Передача на удар
      case 6:
        await updTrain('support_stat')
          .then((data) => {
            upd = data;
          })
          .catch((err) => {
            throw ApiError.BadRequest('Ошибка базы данных');
          });
        break;
    }

    const user = await db.query(
      `SELECT * FROM accounts LEFT JOIN users ON accounts.id_user = users.id_user WHERE id_account = $1`,
      [upd.account_id],
    );

    return new TrainDTO({ ...user.rows[0], ...upd });
  }

  // Добавление действия
  async addAction(id_train, name_action, result, condition, score, id_action_type, date, day_team) {
    const train = await db.query(`SELECT account_id FROM trainings WHERE id_train = $1`, [
      id_train,
    ]);
    const action = await db.query(
      `INSERT INTO actions(name_action, result, condition, score, id_train, id_action_type, date, day_team, account_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        name_action,
        result,
        condition,
        score,
        id_train,
        id_action_type,
        date,
        day_team,
        train.rows[0].account_id,
      ],
    );

    return this.calculateTrain(id_action_type, id_train, name_action);
  }

  // Удаление действия
  async deleteTrainAction(id_action) {
    const deletedAction = await db.query(`SELECT * FROM actions WHERE id_action = $1`, [id_action]);

    await db.query(`DELETE FROM actions WHERE id_action = $1`, [id_action]);

    return this.calculateTrain(
      deletedAction.rows[0].id_action_type,
      deletedAction.rows[0].id_train,
      deletedAction.rows[0].name_action,
    );
  }

  // Получение действий за тренировку
  async getTrainActions(date, day_team, limit, offset) {
    if (!date) {
      throw ApiError.BadRequest('Не введена дата');
    }
    if (!day_team) {
      throw ApiError.BadRequest('Не введена команда');
    }
    const data = await db.query(
      `SELECT * FROM actions LEFT JOIN trainings ON trainings.id_train = actions.id_train LEFT JOIN accounts ON accounts.id_account = trainings.account_id LEFT JOIN users ON accounts.id_user = users.id_user WHERE actions.date = $1 AND actions.day_team = $2 ORDER BY (actions.date + actions.time) DESC`,
      [date, day_team],
    );

    const actions = data.rows.map((action) => {
      return new ActionDTO({ ...action });
    });

    const count = actions.length;
    const actionsPage = actions.slice(offset, offset + limit);
    return { count: count, actions: [...actionsPage] };
  }

  // Получение действий пользователя
  async getUserTrainActions(id_train, limit, offset) {
    if (!id_train) {
      throw ApiError.BadRequest('Не введен id тренировки');
    }
    const actions = await db.query(`SELECT * FROM actions WHERE id_train = $1 ORDER BY time DESC`, [
      id_train,
    ]);

    const actionsDto = actions.rows.map((action) => {
      return new ActionDTO({ ...action });
    });

    const count = actions.rows.length;
    const actionsPage = actionsDto.slice(offset, offset + limit);
    return { count: count, actions: [...actionsPage] };
  }

  // Редактирование действия
  async editAction() {}

  // Удаление действия
  async deleteAction() {}

  // Добавление типа действия
  async addActionType(name_type, result, win_condition, loss_condition, description) {
    const actionType = await db.query(
      `INSERT INTO action_types(name_type, result, win_condition, loss_condition, description) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name_type, result, win_condition, loss_condition, description],
    );

    return actionType.rows[0];
  }

  // Получение типов действий
  async getActionsTypes() {
    const actionsTypes = await db.query(`SELECT * FROM action_types`);
    const actionsTypesDto = actionsTypes.rows.map((item) => {
      const actionType = new ActionTypeDto(item);
      return { ...actionType };
    });
    return actionsTypesDto;
  }
}

module.exports = new TrainService();
