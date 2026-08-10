from pwdlib import PasswordHash
from database import users

password_hash = PasswordHash.recommended()


def register_user(name, email, password):
    email = email.lower().strip()

    existing_user = users.find_one({
        "email": email
    })

    if existing_user:
        return {
            "success": False,
            "message": "Email already registered"
        }

    hashed_password = password_hash.hash(password)

    user = {
        "name": name.strip(),
        "email": email,
        "password": hashed_password,
        "role": "Officer"
    }

    users.insert_one(user)

    return {
        "success": True,
        "message": "Account created successfully"
    }


def login_user(email, password):
    email = email.lower().strip()

    user = users.find_one({
        "email": email
    })

    if not user:
        return {
            "success": False,
            "message": "Invalid email or password"
        }

    if not password_hash.verify(password, user["password"]):
        return {
            "success": False,
            "message": "Invalid email or password"
        }

    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }