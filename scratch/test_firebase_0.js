import { saveTransaction } from './src/firebase';

const testCie = async () => {
    const data = {
        items: [{ name: 'Test', price: 10, quantity: 1 }],
        subtotal: 0,
        tax: 0,
        total: 0,
        status: "CIE",
        createdBy: "tester"
    };
    try {
        const id = await saveTransaction(data);
        console.log("Success! ID:", id);
    } catch (e) {
        console.error("Failed:", e);
    }
};

testCie();
