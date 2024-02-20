import os
from flask import Flask, render_template, redirect, url_for,request
import json

app = Flask(__name__)

# Function to generate unique identification number
def generate_id():
    # You can implement your own logic to generate unique IDs
    # For simplicity, let's just return a sequential number
    if not os.path.exists("user_id.txt"):
        with open("user_id.txt", "w") as file:
            file.write("0")
    with open("user_id.txt", "r+") as file:
        user_id = int(file.read())
        file.seek(0)
        file.write(str(user_id + 1))
        file.truncate()
    return user_id + 1

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/register', methods=['POST'])
def register_post():
    # Get form data
    username = request.form.get('username')
    password = request.form.get('password')
    name = request.form.get('name')
    dob = request.form.get('dob')
    place = request.form.get('place')
    phone = request.form.get('phone')
    email = request.form.get('email')
    signature_data = json.loads(request.form.get('signatureData'))  # List of base64 encoded image data

    # Check if username already exists
    if os.path.exists(os.path.join("users", username)):
        return "Username already exists. Please choose a different username."

    # Create folder for the user
    user_folder = os.path.join("users", username)
    os.makedirs(user_folder)

    # Save signatures
    for i, sig_data in enumerate(signature_data, start=1):
        signature_path = os.path.join(user_folder, f"signature_{i}.txt")
        with open(signature_path, "w") as file:
            file.write(sig_data)

    # Save other user data (you can store this in a database)
    user_id = generate_id()
    user_data = {
        "id": user_id,
        "username": username,
        "password": password,
        "name": name,
        "dob": dob,
        "place": place,
        "phone": phone,
        "email": email
    }
    # You can store user_data in your database

     # Redirect to login page upon successful registration
    return redirect(url_for('login'))

@app.route('/login', methods=['POST'])
def login_post():
    # Add your login logic here
    # For simplicity, let's just redirect to dashboard after login
    return redirect(url_for('dashboard'))

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

if __name__ == '__main__':
    app.run(debug=True)
