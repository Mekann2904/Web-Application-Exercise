from app import create_app
from flask import Flask, jsonify
import config

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)