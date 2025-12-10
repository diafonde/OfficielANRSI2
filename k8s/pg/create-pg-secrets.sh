# Choose strong, unique values
POSTGRES_PASSWORD='postgres'
APP_USER='postgres'
APP_PASSWORD='postgres'
APP_DB='postgres'

kubectl -n anrsi create secret generic pg-auth \
  --from-literal=postgres-password="${POSTGRES_PASSWORD}" \
  --from-literal=postgresql-username="${APP_USER}" \
  --from-literal=password="${APP_PASSWORD}" \
  --from-literal=postgresql-database="${APP_DB}"


helm -n anrsi install db bitnami/postgresql \
  -f pg-values.yaml
