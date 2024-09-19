const axios = require('axios');
const { fetchStormData } = require('../fetcher');
jest.mock('axios');

describe('fetchStormData', () => {
  it('should fetch and return storm data', async () => {
    const mockData = 'Some CSV Data';
    axios.get.mockResolvedValue({ data: mockData });

    const data = await fetchStormData();
    expect(data).toBe(mockData);
  });

  it('should handle errors properly', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));
    await expect(fetchStormData()).rejects.toThrow('Network error');
  });
});
