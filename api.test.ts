import { test, expect } from '@playwright/test';

const BASE_URL = `https://easecommerce.in/api/v2`;

test.describe.serial('EASE Commerce API Automation', () => {
    let token: any;

    test(`1. Login API ${BASE_URL} - should return token`, async ({ request }) => {
        const loginResponse = await request.post(`${BASE_URL}/login`, {
            data: {
                username: "demouser@easecommerce.in",
                password: "cE7iQPP^"
            }
        });
        console.log(`${JSON.stringify(loginResponse)}`)
        expect(loginResponse.ok()).toBeTruthy();
        const responseBody = await loginResponse.json();
        expect(responseBody.token).toBeDefined();
        token = responseBody.token;
    });

    test('2. Warehouse API - should return warehouse list with valid token', async ({ request }) => {
        const warehouseResponse = await request.get(`${BASE_URL}/manage/warehouse/master/list?page=1&limit=10&offset=0`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        expect(warehouseResponse.status()).toBe(200);
        const responseBody = await warehouseResponse.json();

        expect(Array.isArray(responseBody.docs || responseBody)).toBeTruthy();
    });

    const inValidWarehouseId = "test123";
    test('3.1 Negative - Invalid token should return 401', async ({ request }) => {

        const invalidTokenResponse = await request.get(`${BASE_URL}/manage/warehouse/master/${inValidWarehouseId}`, {
            headers: {
                Authorization: `Bearer invalid_token_123`
            }
        });

        expect(invalidTokenResponse.status()).toBe(401);
    });

    const group = "";
    test('3.2 Negative - Missing group query parameter', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/manage/warehouse/master/all/${group}?super-excluded=true`, {
            headers: {
                Authorization: `Bearer ${token} ${inValidWarehouseId} `
            }
        });
        expect(response.status()).toBe(200);
    });

    test('3.3 Negative - No warehouses exist for group "nonexistent"', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/manage/warehouse/master/all/nonexistent--2?super-excluded=true`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
    
        expect(Array.isArray(responseBody.data || responseBody)).toBeTruthy();
        console.log(`Received ${responseBody.data?.length || responseBody.length} warehouses`);
        for (const warehouse of responseBody.data || responseBody) {
            expect(warehouse.group).not.toBe('nonexistent');
        }
    });
    
});
 