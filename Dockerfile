FROM node:lts-alpine3.21

# ARG PORT
# ENV PORT=${PORT}

WORKDIR /usr/src/app

# Copy project dependencies file
COPY package.json ./
# Install dependencies (skip lockfile so npm resolves from package.json)
RUN npm install --no-package-lock

# Copy the rest of the project
COPY . .

# Generate prisma client
# RUN npx prisma generate # Falla en ultima version porque no existen variables de entorno en tiempo de ejecucion

# Expose the port
# EXPOSE ${PORT}

# Command to run the application
CMD ["sh", "-c", "npx prisma generate && npm run start:dev"]
#CMD ["npm", "run", "start:dev"]