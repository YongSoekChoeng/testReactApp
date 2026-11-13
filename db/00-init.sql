-- testReact DB와 접속 계정을 만든다 (MySQL root로 한 번만 실행)
--   mysql -h127.0.0.1 -uroot -p < db/00-init.sql
CREATE DATABASE IF NOT EXISTS testReact
    DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_general_ci;

CREATE USER IF NOT EXISTS 'treactapp'@'localhost' IDENTIFIED BY 'Treactapp1234!';
CREATE USER IF NOT EXISTS 'treactapp'@'127.0.0.1' IDENTIFIED BY 'Treactapp1234!';
GRANT ALL PRIVILEGES ON testReact.* TO 'treactapp'@'localhost';
GRANT ALL PRIVILEGES ON testReact.* TO 'treactapp'@'127.0.0.1';
FLUSH PRIVILEGES;
