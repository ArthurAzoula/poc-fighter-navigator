FROM ubuntu:22.04

RUN apt-get update && apt-get -y install sudo

RUN useradd -m ubuntu && echo "ubuntu:ubuntu" | chpasswd && adduser ubuntu sudo

RUN sudo apt install curl -yq && sudo apt install cmake -yq

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && \
    sudo apt-get install -y nodejs && \
    sudo npm install -g npm@latest && \
    sudo npm install -g gitget@latest

USER ubuntu

RUN cd /home/ubuntu && \
    gitget ArthurAzoula/poc-fighter-navigator && \
    cd poc-fighter-navigator && \
    npm install

WORKDIR /home/ubuntu/poc-fighter-navigator

ENV NODE_ENV=production

RUN npm run build

CMD ["node", "index.js"]