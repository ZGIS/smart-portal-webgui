FROM nginx:stable

RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/
COPY include.cors-support /etc/nginx/

COPY html-source/ /usr/share/nginx/html/

EXPOSE 80

# no volume needs to be mounted over /usr/share/nginx/html/ for now
