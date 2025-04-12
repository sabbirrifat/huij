const fs = require('fs');

// Read the contents of the file
const data = [
    {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "1234567890"
    },
    {
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "phone": "0987654321"
    },
    {
        "name": "Jim Doe",
        "email": "jim.doe@example.com",
        "phone": "1122334455"
    }
]


// Wirte json to file
fs.writeFileSync('test_chunk1.json', JSON.stringify(data, null, 2));





