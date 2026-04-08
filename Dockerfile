FROM node:lts-alpine3.21

# ARG PORT
# ENV PORT=${PORT}

WORKDIR /usr/src/app

# Copy project dependencies file
COPY package.json ./
COPY package-lock.json ./
# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Generate prisma client
# RUN npx prisma generate

# Expose the port
# EXPOSE ${PORT}

# Command to run the application
#CMD ["npm", "run", "start:dev"]