FROM node:slim

COPY . /app

WORKDIR /app

# Install pm2
RUN npm install
RUN npm install -g pm2

# Bind to all network interfaces so that it can be mapped to the host OS
#ENV HOST=0.0.0.0 PORT=3000

#EXPOSE ${PORT}

# Start the app with pm2
CMD npm start
#pm2 start ecosystem.config.js --env production --no-daemon -i 4