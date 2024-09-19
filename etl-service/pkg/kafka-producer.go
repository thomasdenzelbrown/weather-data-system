package pkg

import (
	"encoding/json"
	"log"
	"os"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

func PublishTransformedData(data map[string]interface{}) error {
	kafkaBroker := os.Getenv("KAFKA_BROKER")
	transformedTopic := os.Getenv("TRANSFORMED_TOPIC")

	producer, err := kafka.NewProducer(&kafka.ConfigMap{
		"bootstrap.servers": kafkaBroker,
	})

	if err != nil {
		return err
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	topic := transformedTopic
	producer.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
		Value:          jsonData,
	}, nil)

	producer.Flush(15 * 1000)
	log.Println("Published transformed data to Kafka.")

	return nil
}
