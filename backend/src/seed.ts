import {db} from "./db";
import {users} from "./db/schema";

async function createTestUser() {
    const password = "123456";
    const hashedPassword = await Bun.password.hash(password);

    await db.insert(users).values({
        name: "test",
        email: "test@cola.com",
        password: hashedPassword,
        role: "admin"
    });

    console.log("SUCCESS: create test user");
    process.exit(0);
}

createTestUser();