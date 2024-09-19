package pkg

import (
	"encoding/json"
	"log"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

func PublishTransformedData(data map[string]interface{}) error {
	// Create a new Kafka producer
	producer, err := kafka.NewProducer(&kafka.ConfigMap{
		"bootstrap.servers": "kafka:9092",
	})

	if err != nil {
		return err
	}

	// Serialize the transformed data to JSON
	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	// Produce the message to the transformed-weather-data topic
	topic := "transformed-weather-data"
	producer.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
		Value:          jsonData,
	}, nil)

	// Wait for all messages to be delivered
	producer.Flush(15 * 1000)
	log.Println("Published transformed data to Kafka.")

	return nil
}
