FROM 572891318033.dkr.ecr.us-east-1.amazonaws.com/cruddur-python:3.10-slim-buster

# Inside Container
# This make a new folder inside the container
WORKDIR /backend-flask

# Outside Container -> Inside Container
# Ths contain the python libraries required to install and run the app
COPY requirements.txt requirements.txt

# Inside Container
# This installs the required python libraries used for this app
RUN pip3 install -r requirements.txt

# Outside Container -> Inside Container
# . means everything the parent (curent) directory
# The first period . = ./backend-flask (The Outside Container)
# The Second period . = ./backend-flask (The Inside Container)
COPY . .

# COPY flask.sh /usr/local/bin
# RUN chmod +x /usr/local/bin/flask.sh

# This sets the enviromental variales (Env Vars)
# Inside container and will remain set when the container is running
ENV FLASK_DEBUG=1

EXPOSE ${PORT}

# CMD (Commands)
# Commands required to run Flask which is;
# python3 -m flask run --host=0.0.0.0 --port=4567
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=4567"]

# CMD ["/usr/local/bin/flask.sh"]