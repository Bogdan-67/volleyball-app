CREATE TABLE users(
    id_user SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    patronimyc VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(100),
    team VARCHAR(100),
    img VARCHAR(255) DEFAULT 'avatar.jpg'
);

CREATE TABLE roles(
    id_role SERIAL PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL
);

CREATE TABLE accounts(
    id_account SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL,   
    password VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (role_id) REFERENCES roles(id_role) ON DELETE CASCADE,
    id_user INTEGER NOT NULL,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
    );

CREATE TABLE tokens(
    account_id SERIAL PRIMARY KEY,
    FOREIGN KEY (account_id) REFERENCES accounts(id_account) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL
);

CREATE TABLE stats(
    id_stat SERIAL PRIMARY KEY,
    inninig_accyr REAL,
    stat_block REAL,
    account_id INTEGER,
    FOREIGN KEY (account_id) REFERENCES accounts(id_account) ON DELETE CASCADE
    );

CREATE TABLE trainings(
    id_train SERIAL PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    inning_stat REAL DEFAULT 0,
    blocks_stat REAL DEFAULT 0,
    attacks_stat REAL DEFAULT 0,
    catch_stat REAL DEFAULT 0,
    defence_stat REAL DEFAULT 0,
    support_stat REAL DEFAULT 0,
    day_team VARCHAR(255) NOT NULL,
    account_id INTEGER,
    FOREIGN KEY (account_id) REFERENCES accounts(id_account) ON DELETE CASCADE
    );

CREATE TABLE action_types(
    id_action_type SERIAL PRIMARY KEY,
    name_type VARCHAR(255) NOT NULL,
    result VARCHAR(255) NOT NULL,
    win_condition VARCHAR(255),
    loss_condition VARCHAR(255),
    description TEXT
    );

CREATE TABLE actions(
    id_action SERIAL PRIMARY KEY,
    name_action VARCHAR(255) NOT NULL,
    time TIME NOT NULL DEFAULT current_time,
    result VARCHAR(255) NOT NULL,
    condition VARCHAR(255),
    score INTEGER,
    day_team VARCHAR(255) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    id_train INTEGER,
    FOREIGN KEY (id_train) REFERENCES trainings(id_train) ON DELETE CASCADE,
    id_action_type INTEGER,
    FOREIGN KEY (id_action_type) REFERENCES action_types(id_action_type) ON DELETE CASCADE,
    account_id INTEGER,
    FOREIGN KEY (account_id) REFERENCES accounts(id_account) ON DELETE CASCADE
    );

INSERT INTO roles(role_name) VALUES ('USER') RETURNING *;
INSERT INTO roles(role_name) VALUES ('ADMIN') RETURNING *;
INSERT INTO roles(role_name) VALUES ('EDITOR') RETURNING *;
    
INSERT INTO action_types (
  id_action_type, name_type, result, win_condition, loss_condition, description)
  VALUES (
    '1', 'Подача', 'Выигрышная подача; Ошибка подачи; Нулевая подача;', 
    'Мяч коснулся площадки соперника; Принимающая команда совершила нарушение; Ошибка в расстановке принимающей команды', 
    'Мяч не перелетел через сетку; Мяч упал за пределами площадки (или задел антенну); Заступ падающего; Ошибка в расстановке подающей команды', 
    'Подача – это действие введения мяча в игру правым игроком задней линии, находящимся в зоне подачи.')
RETURNING *;

INSERT INTO action_types (
  id_action_type, name_type, result, win_condition, loss_condition, description)
  VALUES ( 
    '2',
    'Атака',
    'Выигрыш; Ошибка атаки; Нулевая атака', 
    'Атака привела к очку', 
    'Мяч за пределами площадки; Мяч попал в сетку; Мяч заблокирован соперником; Четыре касания; Переход средней линии;
    двойное касание; Ошибка либеро; Касание антенны; Ошибка игрока задней линии', 
    'Атакой считают все действия, в результате которых мяч направляется на сторону соперника, исключая подачу и блок.')
RETURNING *;

INSERT INTO action_types (
  id_action_type, name_type, result, win_condition, loss_condition, description)
  VALUES ( 
    '3',
    'Блокирование',
    'Выигрыш; Ошибка блокирования; Нулевое блокирование', 
    'Одиночное блокирование; Групповое блокирование', 
    'Блокирующий коснулся сетки; Блокирующий перешел среднюю линию; Блокирование мяча в пространстве соперника за антенной; Игрок задней линии совершил блокирование; Блокирующий бросил/схватил мяч', 
    'Блокирование является действием игроков вблизи сетки для перехвата мяча, идущего от соперника, осуществляемое выносом любой части тела выше верхнего края сетки, независимо от высоты контакта с
мячом.')
RETURNING *;

INSERT INTO action_types (
  id_action_type, name_type, result, win_condition, loss_condition, description)
  VALUES ( 
    '4',
    'Прием подачи',
    'Прием подачи; Ошибка приёма', 
    'Удачный прием', 
    'Мяч коснулся площадки; Игрок совершил нарушение при приёме; Принимающая команда нарушила расстановку', 
    'Прием подачи — первое касание после подачи соперника.')
RETURNING *;

INSERT INTO action_types (
  id_action_type, name_type, result, win_condition, loss_condition, description)
  VALUES ( 
    '5',
    'Защита',
    'Успешное касание мяча; Ошибочное касание', 
    'Успешная защита', 
    'Мяч схвачен и/или брошен; Двойное касание', 
    'Защита – действия игроков, предотвращающие атаку соперника
или позволяющие оставить мяч в игре.')
RETURNING *;

INSERT INTO action_types (
  id_action_type, name_type, result, win_condition, loss_condition, description)
  VALUES ( 
    '6',
    'Передача на удар',
    'Ассистирование; Ошибочное касание; Нулевое ассистирование', 
    'С передачи на удар атакующий игрок выигрывал розыгрыш', 
    'Двойное касание', 
    'Передача на удар — это передача мяча для атакующего удара.')
RETURNING *;