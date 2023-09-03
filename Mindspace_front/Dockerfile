#frontend
FROM node:16

USER root 

WORKDIR /frontend
COPY . /frontend

# Make variable API_URL to put uri into url
ENV REACT_APP_HOST_IP_ADDRESS $API_URL
ENV REACT_APP_BACKEND_URL $REACT_APP_BACKEND_URL

# Build the project
RUN yarn build