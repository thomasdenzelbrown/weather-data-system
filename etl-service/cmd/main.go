package main

import (
	"etl-service/pkg"
	"log"
)

func main() {
	log.Println("Starting ETL service...")

	err := pkg.StartKafkaConsumer()
	if err != nil {
		log.Fatalf("Failed to start Kafka consumer: %v", err)
	}
}
