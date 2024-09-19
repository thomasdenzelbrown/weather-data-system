package pkg

import (
	"encoding/json"
	"log"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

func PublishTransformedData(data map[string]interface{}) error {
	producer, err := kafka.NewProducer(&kafka.ConfigMap{
		"bootstrap.servers": "kafka:9092",
	})

	if err != nil {
		return err
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	topic := "transformed-weather-data"
	producer.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
		Value:          jsonData,
	}, nil)

	producer.Flush(15 * 1000)
	log.Println("Published transformed data to Kafka.")

	return nil
}
