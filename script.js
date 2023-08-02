// API endpoints
    const apiUrl = 'https://api.example.com/login';
    const customerApiUrl = 'https://api.example.com/customers';

// Login Form Submission
    document.getElementById('LoginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const login_id = document.getElementById('login_id').value;
    const password = document.getElementById('password').value;
    
    document.querySelector('.login').style.display = 'none';
    document.querySelector('.customerList').style.display ='block'
    try {
        const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login_id,
            password
        })
        });

        if (response.status === 200) {
        const data = await response.json();
        const bearerToken = data.token;

        localStorage.setItem('bearerToken', bearerToken);

        // Redirect to the customer list screen
        window.location.href = 'customer_list.html';
        } else {
        alert('Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again later.');
    }
    });

    // Logout Functionality
    document.getElementById('logoutBtn').addEventListener('click', function () {
    // Clear the stored bearer token from localStorage
    localStorage.removeItem('bearerToken');
    // Redirect to the login screen
    window.location.href = 'index.html';
    });

    // Fetch and Display Customer List
    const bearerToken = localStorage.getItem('bearerToken');

    async function getCustomerList() {
    try {
        const response = await fetch(`${customerApiUrl}?cmd=get_customer_list`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${bearerToken}`
        }
        });

        if (response.status === 200) {
        const data = await response.json();
        displayCustomerList(data);
        } else if (response.status === 401) {
        alert('Authorization failed. Please log in again.');
        // Redirect back to the login screen
        window.location.href = 'index.html';
        } else {
        alert('Failed to fetch customer list. Please try again later.');
        }
    } catch (error) {
        console.error('Error fetching customer list:', error);
        alert('An error occurred while fetching the customer list. Please try again later.');
    }
    }

    function displayCustomerList(customers) {
    const tableBody = document.createElement('tbody');
    for (const customer of customers) {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${customer.first_name}</td>
        <td>${customer.last_name}</td>
        <td>${customer.street}</td>
        <td>${customer.address}</td>
        <td>${customer.city}</td>
        <td>${customer.state}</td>
        <td>${customer.email}</td>
        <td>${customer.phone}</td>
        <td>
            <button class="editBtn" data-uuid="${customer.uuid}">Edit</button>
            <button class="deleteBtn" data-uuid="${customer.uuid}">Delete</button>
        </td>
        `;
        tableBody.appendChild(row);
    }
    document.getElementById('customerTable').appendChild(tableBody);

    // Add event listeners for edit and delete buttons
    const editBtns = document.querySelectorAll('.editBtn');
    const deleteBtns = document.querySelectorAll('.deleteBtn');

    editBtns.forEach(btn => {
        btn.addEventListener('click', function () {
        const uuid = btn.getAttribute('data-uuid');
        editCustomer(uuid);
        });
    });

    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function () {
        const uuid = btn.getAttribute('data-uuid');
        if (confirm('Are you sure you want to delete this customer?')) {
            deleteCustomer(uuid);
        }
        });
    });
    }

// Fetch and display the customer list on page load
getCustomerList();

document.getElementById('addCustomerBtn').addEventListener('click',function(){
    document.querySelector('.customerList').style.display = 'none'
    document.querySelector('.addCustomer').style.display = 'block';
})

// Add New Customer Form Submission
    document.getElementById('addCustomerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const street = document.getElementById('street').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    document.querySelector('.customerList').style.display = 'none';
    document.querySelector('.addCustomer').style.display = 'block';

    try {
        const response = await fetch(`${customerApiUrl}?cmd=create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            first_name,
            last_name,
            street,
            address,
            city,
            state,
            email,
            phone
        })
    });

        // ... (continued from previous response)

        if (response.status === 201) {
            alert('Customer created successfully.');
                window.location.href = 'customer_list.html';
            } else if (response.status === 400) {
                alert('First Name or Last Name is missing. Please fill in the required fields');
            } else if (response.status === 401) {
                alert('Authorization failed. Please log in again.');
                    window.location.href = 'index.html';
            } else {
                alert('Failed to add customer. Please try again later.');
            }
            } catch (error) {
            console.log('Error adding customer:', error);
            alert('An error occurred while adding the customer. Please try again later.')
            }
        })
        
        // Update Customer Functionality
        async function editCustomer(uuid) {
            // Fetch the customer details using the provided UUID
            try {
            const response = await fetch(`${customerApiUrl}?cmd=get_customer&uuid=${uuid}`, {
                method: 'GET',
                headers: {
                'Authorization': `Bearer ${bearerToken}`
                }
            });
        
            if (response.status === 200) {
                const customer = await response.json();
                // Assuming you have a separate page for updating a customer, you can redirect there and pass the customer details
                window.location.href = `edit_customer.html?uuid=${uuid}&first_name=${customer.first_name}&last_name=${customer.last_name}&street=${customer.street}&address=${customer.address}&city=${customer.city}&state=${customer.state}&email=${customer.email}&phone=${customer.phone}`;
            } else if (response.status === 401) {
            alert('Authorization failed. Please log in again.');
                window.location.href = 'index.html';
            } else {
                alert('Failed to fetch customer details. Please try again later.');
            }
            } catch (error) {
            console.error('Error fetching customer details:', error);
            alert('An error occurred while fetching the customer details. Please try again later.');
            }
        }
        
      // Delete Customer Functionality
    async function deleteCustomer(uuid) {
        try {
            const response = await fetch(`${customerApiUrl}?cmd=delete&uuid=${uuid}`, {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${bearerToken}`
            }
        });
    
        if (response.status === 200) {
            alert('Customer deleted successfully.');
            // Refresh the customer list after deletion
            window.location.reload();
        } else if (response.status === 401) {
            alert('Authorization failed. Please log in again.');
            window.location.href = 'index.html';
        } else if (response.status === 400) {
            alert('UUID not found.');
        } else {
            alert('Error deleting customer. Please try again later.');
        }
        } catch (error) {
        console.error('Error deleting customer:', error);
        alert('An error occurred while deleting the customer. Please try again later.');
        }
    }
    
