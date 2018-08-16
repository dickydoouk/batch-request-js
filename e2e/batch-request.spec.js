const fetch = require('node-fetch')
const server = require('./server')
const { batchRequest, batch } = require('../batch-request')

const TIMEOUT = 1000 * 30
const BATCH_SIZE = 1000
const ENDPOINT = "http://localhost:5000/query"

beforeEach(async () => {
    await server.start()
})

afterEach(async () => {
    await server.stop()
})

describe('E2E Server', () => {
    it('should start server', async () => {
        // assign, act
        const response = await fetch(ENDPOINT)
        // assert
        expect(response.status).toBe(200)
    })
})

describe('batch-request', () => {
    it('should process large payloads in batches', async () => {
        // assign
        jest.setTimeout(TIMEOUT)
        try {
            const data = Array(BATCH_SIZE).fill(0).map((items, i) => i)
            const request = () => fetch(ENDPOINT)
            // act
            const result = await batchRequest(data, request)
            // assert
            expect(result.error).toHaveLength(0)
            expect(result.data).toHaveLength(BATCH_SIZE)
        } catch (error) {
            expect(error).toBeFalsy()
        }
    })
})

describe('Non batch request', () => {
    it('should fail on large payloads', async () => {
        jest.setTimeout(TIMEOUT)
        try {
            const requests = Array(BATCH_SIZE).fill(0).map(() => fetch(ENDPOINT))
            const result = await Promise.all(requests)
            expect(result).toBeFalsy()
        } catch (error) {
            expect(error).toBeTruthy()
        }
    })
})