from flask import render_template
from flask import Flask, jsonify
import config
import sqlite3


def init_routes(app):
    @app.route('/')
    def home():
        return render_template('index.html')
    
    @app.route('/weather_info')
    def weather_info():
        return render_template('weather_info.html')
    
    @app.route('/route_info')
    def route_info():
        return render_template('route_info.html')
    
    @app.route('/geo_info')
    def geo_info():
        return render_template('geo_info.html')

    @app.route('/disaster_prevention_links')
    def disaster_prevention_links():
        return render_template('disaster_prevention_links.html')
    
    @app.route('/get_api_key')
    def get_api_key():
        return jsonify({"apiKey": config.api_key})
    
    @app.route('/get_names')
    def get_names():
        # SQLiteデータベースに接続して`名称`列のデータを取得
        conn = sqlite3.connect('shelters.db')
        cursor = conn.cursor()
        cursor.execute("SELECT 名称 FROM shelters")
        names = [row[0] for row in cursor.fetchall()]
        conn.close()
        return jsonify(names)