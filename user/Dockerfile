FROM python:3.8

WORKDIR /usr/src/app

COPY ./requirements.txt ./

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python", "main.py" ]