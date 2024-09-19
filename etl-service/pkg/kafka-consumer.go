package pkg

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

func StartKafkaConsumer() error {
	// Create a new Kafka consumer
	consumer, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": "kafka:9092",
		"group.id":          "etl-group",
		"auto.offset.reset": "earliest",
	})

	if err != nil {
		return err
	}

	// Subscribe to the raw-weather-reports topic
	consumer.Subscribe("raw-weather-reports", nil)

	// Start consuming messages
	for {
		msg, err := consumer.ReadMessage(-1)
		if err == nil {
			var rawData map[string]interface{}
			json.Unmarshal(msg.Value, &rawData)

			// Process the raw data using the transformation logic
			transformedData := ProcessRawData(rawData)

			// Publish the transformed data to the Kafka topic
			err := PublishTransformedData(transformedData)
			if err != nil {
				log.Println("Failed to publish transformed data:", err)
			}
		} else {
			fmt.Printf("Error consuming message: %v (%v)\n", err, msg)
		}
	}
}
