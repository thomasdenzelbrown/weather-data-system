const { publishToKafka } = require('../kafka-producer');
jest.mock('kafka-node');

describe('Kafka Producer', () => {
  it('should publish data to Kafka successfully', async () => {
    const mockData = { key: 'value' };

    // Mock Kafka producer behavior
    const mockSend = jest.fn((payloads, callback) => callback(null, 'Data published successfully'));
    const kafka = require('kafka-node');
    kafka.Producer.mockImplementation(() => ({ send: mockSend }));

    await publishToKafka(mockData);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith([{ topic: 'raw-weather-reports', messages: JSON.stringify(mockData) }], expect.any(Function));
  });

  it('should handle errors during Kafka publishing', async () => {
    const mockData = { key: 'value' };

    // Simulate Kafka error
    const mockSend = jest.fn((payloads, callback) => callback(new Error('Kafka publish failed')));
    const kafka = require('kafka-node');
    kafka.Producer.mockImplementation(() => ({ send: mockSend }));

    await expect(publishToKafka(mockData)).rejects.toThrow('Kafka publish failed');
  });
});
