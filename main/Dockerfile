FROM node:19.4.0

#Working Dir
WORKDIR /usr/src/app

#Copy Package Json Files
COPY package*.json ./

#Install Files
RUN npm install

#Copy Source Files
COPY . .

#Build
RUN npm run build

#Expose the API Port
EXPOSE 8000

CMD ["npm", "start"]