CREATE DATABASE motus;
GO

USE motus;
GO

CREATE TABLE Users (
                       id INT IDENTITY(1,1) PRIMARY KEY,
                       pseudo VARCHAR(50) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       numero_secu VARCHAR(15)
);

CREATE TABLE Scores (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        login_id INT NOT NULL,
                        score INT NOT NULL,
                        date_partie DATETIME DEFAULT GETDATE(),
                        FOREIGN KEY (login_id) REFERENCES Users(id)
);

CREATE TABLE Mots (
                      id INT IDENTITY(1,1) PRIMARY KEY,
                      word VARCHAR(50) NOT NULL,
                      longueur INT NOT NULL,
                      difficulte INT NOT NULL
);
GO