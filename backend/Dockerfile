FROM python:3.11-slim

# Installation des dépendances système
RUN apt-get update && apt-get install -y curl apt-transport-https gnupg2 unixodbc-dev

# Ajout de la clé GPG Microsoft (méthode moderne)
RUN curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg

# Ajout du dépôt Microsoft (Ciblage Debian 12)
RUN curl https://packages.microsoft.com/config/debian/12/prod.list > /etc/apt/sources.list.d/mssql-release.list

# Installation du pilote ODBC MSSQL
RUN apt-get update && ACCEPT_EULA=Y apt-get install -y msodbcsql18

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3000"]