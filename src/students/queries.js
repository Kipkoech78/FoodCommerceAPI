const getAllCustomers ="SELECT * FROM customers";
const mexicoCustomers =  "SELECT * FROM customers where country = 'Mexico' ";
const getCustId = "select * from customers where customer_id = $1 ";
const checkContactExist = "select * from customers where contact_name = $1";
const addCustomer = "INSERT INTO customers (customer_name, contact_name, address, city, postal_code, country) VALUES ($1, $2, $3, $4, $5, $6)"


const addUser = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)";
const CheckEmailExist = "select * from users WHERE email = $1";
const getFood = "select * from food_items";

module.exports ={
    getAllCustomers,mexicoCustomers,getCustId,checkContactExist,addCustomer,addUser,CheckEmailExist,getFood
}