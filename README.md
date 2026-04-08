# BabelShark Test App

Meteor 3 + TypeScript приложение, которое:

- реактивно показывает клиентов и их должности из MySQL
- отслеживает изменения в DOM через `MutationObserver`
- запрашивает перевод должностей с сервера через `Meteor.call()`

## Локальный запуск в Docker

### Что нужно

- Docker
- Docker Compose

### Быстрый старт

Из корня проекта выполните:

```bash
docker compose up --build -d
```

После запуска приложение будет доступно по адресу:

```text
http://localhost:3000
```

### Что поднимется

`docker compose` запускает 3 сервиса:

- `app` — Meteor-приложение
- `mysql` — основная БД проекта
- `mongo` — служебная БД Meteor runtime

### Тестовые данные

При первом запуске MySQL инициализируется автоматически из `docker/mysql/init`.

Создаются таблицы:

- `customers`
- `positions`
- `translations`

И стартовые данные:

- `Dino Fabrello / officer`
- `Walter Marangoni / manager`
- `Angelo Ottogialli / operator`

### Как проверить, что всё работает

Проверить контейнеры:

```bash
docker compose ps
```

Посмотреть логи приложения:

```bash
docker compose logs -f app
```

Ожидаемый результат:

- сервисы `app`, `mysql`, `mongo` имеют статус `Up`
- страница на `http://localhost:3000` открывается
- в браузере отображается таблица клиентов

### Как показать реактивность

В локальном Docker-режиме включён автогенератор изменений:

- раз в несколько секунд добавляется клиент
- затем на следующем тике клиент удаляется
- список меняется без перезагрузки страницы

Это позволяет увидеть:

- реактивное обновление данных из MySQL
- срабатывание `MutationObserver` на ячейках `td.__t`
- замену исходной должности на перевод

Если просто открыть страницу и подождать 10-20 секунд, изменения будут видны автоматически.

### Полезные команды

Остановить проект:

```bash
docker compose down
```

Остановить проект и удалить volumes:

```bash
docker compose down -v
```

Полная пересборка с чистой инициализацией БД:

```bash
docker compose down -v
docker compose up --build -d
```

### Порты

Локально используются:

- `3000` — приложение
- `3306` — MySQL
- `27017` — MongoDB

### Переменные окружения локального Docker-стенда

Они уже описаны в `docker-compose.yml`.

Основные:

```text
ROOT_URL=http://localhost:3000
PORT=3000
MONGO_URL=mongodb://mongo:27017/meteor
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_DATABASE=babelshark_test
MYSQL_USER=meteor
MYSQL_PASSWORD=meteor
MYSQL_SERVER_ID=1
DEMO_AUTO_CHANGES_ENABLED=true
DEMO_AUTO_CHANGES_INTERVAL_MS=4000
```

### Если что-то пошло не так

Если приложение не видит данные или MySQL был поднят со старыми настройками, выполните:

```bash
docker compose down -v
docker compose up --build -d
```

Это важно, потому что MySQL инициализируется только на пустом volume.
