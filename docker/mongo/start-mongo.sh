#!/bin/sh
set -eu

CERT_DIR="/tls"
CA_KEY="$CERT_DIR/ca.key"
CA_CERT="$CERT_DIR/ca.crt"
SERVER_KEY="$CERT_DIR/server.key"
SERVER_CSR="$CERT_DIR/server.csr"
SERVER_CERT="$CERT_DIR/server.crt"
SERVER_PEM="$CERT_DIR/server.pem"
CLIENT_KEY="$CERT_DIR/client.key"
CLIENT_CSR="$CERT_DIR/client.csr"
CLIENT_CERT="$CERT_DIR/client.crt"
CLIENT_PEM="$CERT_DIR/client.pem"

mkdir -p "$CERT_DIR"

if [ ! -f "$SERVER_PEM" ] || [ ! -f "$CA_CERT" ] || [ ! -f "$CLIENT_PEM" ]; then
  openssl genrsa -out "$CA_KEY" 2048
  openssl req -x509 -new -nodes -key "$CA_KEY" -sha256 -days 3650 \
    -out "$CA_CERT" -subj "/CN=my_cool_app-mongo-ca"

  openssl genrsa -out "$SERVER_KEY" 2048
  openssl req -new -key "$SERVER_KEY" -out "$SERVER_CSR" \
    -subj "/CN=mongo"

  cat > "$CERT_DIR/server.ext" <<EOF
subjectAltName=DNS:mongo,DNS:localhost,IP:127.0.0.1
extendedKeyUsage=serverAuth
EOF

  openssl x509 -req -in "$SERVER_CSR" -CA "$CA_CERT" -CAkey "$CA_KEY" \
    -CAcreateserial -out "$SERVER_CERT" -days 3650 -sha256 \
    -extfile "$CERT_DIR/server.ext"

  openssl genrsa -out "$CLIENT_KEY" 2048
  openssl req -new -key "$CLIENT_KEY" -out "$CLIENT_CSR" \
    -subj "/CN=my_cool_app-mongo-client"

  cat > "$CERT_DIR/client.ext" <<EOF
extendedKeyUsage=clientAuth
EOF

  openssl x509 -req -in "$CLIENT_CSR" -CA "$CA_CERT" -CAkey "$CA_KEY" \
    -CAcreateserial -out "$CLIENT_CERT" -days 3650 -sha256 \
    -extfile "$CERT_DIR/client.ext"

  cat "$SERVER_KEY" "$SERVER_CERT" > "$SERVER_PEM"
  cat "$CLIENT_KEY" "$CLIENT_CERT" > "$CLIENT_PEM"
  chmod 600 "$SERVER_PEM" "$CLIENT_PEM" "$CA_KEY" "$SERVER_KEY" "$CLIENT_KEY"
fi

exec mongod \
  --bind_ip_all \
  --quiet \
  --tlsMode preferTLS \
  --tlsAllowConnectionsWithoutCertificates \
  --tlsCertificateKeyFile "$SERVER_PEM" \
  --tlsCAFile "$CA_CERT"
