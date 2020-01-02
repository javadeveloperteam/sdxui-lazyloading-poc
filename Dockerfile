# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM 233431242547.dkr.ecr.ap-south-1.amazonaws.com/sdx-core/node:10.16.2 as build-stage
ARG region=prod
WORKDIR /app
COPY package*.json /app/
# To handle 'not get uid/gid'
RUN npm config set unsafe-perm true
RUN npm install 

RUN npm audit fix

COPY . .

RUN npm run build:$region

#RUN npm run build:uat

# Stage 1, based on Nginx, to have only the compiled node app, ready for production with Nginx
FROM 233431242547.dkr.ecr.ap-south-1.amazonaws.com/sdx-core/nginx:1.16.0

COPY default.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist/ /usr/share/nginx/html
ENV JAVA_OPTS="-Xmx256m"
# run nginx
CMD ["nginx", "-g", "daemon off;"]
