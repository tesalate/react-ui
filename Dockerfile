## help from https://testdriven.io/blog/testing-angular-with-cypress-and-docker/ ##
#########################
### build environment ###
#########################

# base image
FROM node:16-alpine as builder

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json yarn.lock /app/

RUN yarn

COPY . /app

# generate .env file
ARG BUILD_ENVIRONMENT 
ENV BUILD_ENVIRONMENT=$BUILD_ENVIRONMENT

RUN ["chmod", "+x", "/app/generate_ui_env_vars.js" ]
RUN ["node", "/app/generate_ui_env_vars.js"]

# # generate build
RUN  yarn build

##################
### production ###
##################

# base image
FROM nginx:1.21.0-alpine

COPY nginx.conf /etc/nginx/nginx.conf

# copy artifact build from the 'build environment'
COPY --from=builder /app/build /var/www

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
