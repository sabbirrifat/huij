const fs = require('fs');

// Read the contents of the file
const readFile = fs.readFileSync('test_chunk1.json', 'utf8');
const data = JSON.parse(readFile);

const updatedData = [
    {
        "name": "sikka Khes",
        "email": "john.doe@example.com",
        "phone": "1234567890"
    },
    {
        "name": "mckmvckf JJj",
        "email": "jane.doe@example.com",
        "phone": "0987654321"
    },
    {
        "name": "vkfmnvkf JJj",
        "email": "jim.doe@example.com",
        "phone": "1122334455"
    }
]


// Append new data to existing data
data.push(...updatedData);

// Write combined data back to file
fs.writeFileSync('test_chunk1.json', JSON.stringify(data, null, 2));





