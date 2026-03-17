set -eu

echo "Waiting for database (${DB_HOST:-db}:${DB_PORT:-3306})..."

php -r '
$host = getenv("DB_HOST") ?: "db";
$port = getenv("DB_PORT") ?: "3306";
$db   = getenv("DB_DATABASE") ?: "";
$user = getenv("DB_USERNAME") ?: "";
$pass = getenv("DB_PASSWORD") ?: "";

$dsn = "mysql:host={$host};port={$port};dbname={$db}";
$deadline = time() + 60;

while (true) {
  try {
    new PDO($dsn, $user, $pass, [PDO::ATTR_TIMEOUT => 2]);
    fwrite(STDOUT, "Database is ready.\n");
    exit(0);
  } catch (Throwable $e) {
    if (time() >= $deadline) {
      fwrite(STDERR, "Database not ready after 60s: " . $e->getMessage() . "\n");
      exit(1);
    }
    usleep(500000);
  }
}
'

echo "Running migrations..."
php artisan migrate --force

echo "Starting Apache..."
exec apache2-foreground
