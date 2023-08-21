  
FROM node:16.13.1 AS builder 

ENV NODE_OPTIONS="--max-old-space-size=1096" 

WORKDIR /build 

COPY package.json . 
COPY package-lock.json . 

RUN npm ci 
 
COPY . . 

RUN npm run build 
 
FROM nginx:alpine 
WORKDIR /usr/share/nginx/html 

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY certs/ certs/ 
COPY --from=builder /build/build .

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["nginx", "-g", "daemon off;"]

# FROM nginx:alpine 

# RUN useradd /bin/bash user
# USER user
# # Удалите существующую конфигурацию Nginx
# RUN rm /etc/nginx/conf.d/default.conf

# # Скопируйте кастомный конфигурационный файл Nginx
# COPY nginx/nginx.conf /etc/nginx/conf.d/

# RUN sudo chown -R user:user /usr/share/nginx/html

# # Копируйте собранные файлы frontend приложения внутрь образа Nginx
# COPY --from=production build/ /usr/share/nginx/html/

# # Установите порт, на котором будет работать Nginx
# EXPOSE 80

# # Запустите Nginx
# CMD ["nginx", "-g", "daemon off;"]