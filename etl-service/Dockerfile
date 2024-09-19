FROM golang:1.23.1

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o etl-service ./cmd/main.go

EXPOSE 8080

CMD ["./etl-service"]
