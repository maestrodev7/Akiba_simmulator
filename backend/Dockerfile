FROM composer:2 AS vendor
WORKDIR /app

COPY composer.json composer.lock* ./
# Avoid running Laravel's composer scripts during image build (artisan isn't present yet).
RUN composer install --no-dev --no-interaction --no-progress --prefer-dist --optimize-autoloader --no-scripts

COPY . .
RUN composer dump-autoload --no-dev --optimize


FROM php:8.3-apache AS runtime
WORKDIR /var/www/html

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    libzip-dev \
    unzip \
  && docker-php-ext-install pdo_mysql zip \
  && a2enmod rewrite headers \
  && rm -rf /var/lib/apt/lists/*

# Point Apache to Laravel public/ directory
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
  && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

COPY --from=vendor /app /var/www/html

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh \
  && chmod +x /usr/local/bin/docker-entrypoint.sh

# Use explicit shell to avoid Windows CRLF shebang issues.
ENTRYPOINT ["sh", "/usr/local/bin/docker-entrypoint.sh"]

EXPOSE 80
