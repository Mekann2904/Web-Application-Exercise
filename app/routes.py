from flask import Flask, render_template, jsonify, request
import sqlite3
import logging
import requests
from bs4 import BeautifulSoup
import config
import json

app = Flask(__name__)

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
        try:
            conn = sqlite3.connect('shelters.db')
            cursor = conn.cursor()
            cursor.execute("SELECT 名称 FROM shelters")
            names = [row[0] for row in cursor.fetchall()]
            conn.close()
            logging.info(f"Retrieved names: {names}")
            return jsonify(names)
        except Exception as e:
            logging.error(f"Error retrieving names: {e}")
            return jsonify({"error": str(e)})

    @app.route('/get_coordinates/<shelter_name>')
    def get_coordinates(shelter_name):
        try:
            conn = sqlite3.connect('shelters.db')
            cursor = conn.cursor()
            cursor.execute("SELECT latitude, longitude FROM shelters WHERE 名称 = ?", (shelter_name,))
            row = cursor.fetchone()
            conn.close()
            if row:
                return jsonify({"latitude": row[0], "longitude": row[1]})
            else:
                return jsonify({"error": "Shelter not found"}), 404
        except Exception as e:
            logging.error(f"Error retrieving coordinates: {e}")
            return jsonify({"error": str(e)})
    


    @app.route('/calculate_distance', methods=['POST'])
    def calculate_distance():
        data = request.json
        lat1 = data['lat1']
        lon1 = data['lon1']
        lat2 = data['lat2']
        lon2 = data['lon2']

        logging.debug(f"Received coordinates for distance calculation: lat1={lat1}, lon1={lon1}, lat2={lat2}, lon2={lon2}")
        
        try:
            response = requests.get(f"http://vldb.gsi.go.jp/sokuchi/surveycalc/surveycalc/bl2st_calc.pl?outputType=json&ellipsoid=GRS80&latitude1={lat1}&longitude1={lon1}&latitude2={lat2}&longitude2={lon2}")
            if response.status_code != 200:
                logging.error("Failed to retrieve distance data")
                return jsonify({"error": "Failed to retrieve distance data"}), 500

            logging.debug(f"Response JSON: {response.text}")
            
            # JSON形式のレスポンスを解析
            data = response.json().get("OutputData", {})

            # 距離と方位角を取得
            distance = data.get('geoLength', 'N/A')
            azimuth1 = data.get('azimuth1', 'N/A')
            azimuth2 = data.get('azimuth2', 'N/A')

            logging.debug(f"Distance: {distance}, Azimuth1: {azimuth1}, Azimuth2: {azimuth2}")
            return jsonify({"distance": distance, "azimuth1": azimuth1, "azimuth2": azimuth2})
        except Exception as e:
            logging.error(f"Error calculating distance: {e}")
            return jsonify({"error": str(e)}), 500

    

    @app.route('/address_search/<city>')
    def address_search(city):
        try:
            response = requests.get(f'https://msearch.gsi.go.jp/address-search/AddressSearch?q={city}')
            if response.status_code != 200:
                return jsonify({"error": "Failed to retrieve address data"}), 500

            data = response.json()
            if len(data) == 0:
                return jsonify({"error": "No results found"}), 404

            lon, lat = data[0]['geometry']['coordinates']
            return jsonify({"lat": lat, "lon": lon})
        except Exception as e:
            logging.error(f"Error retrieving address data: {e}")
            return jsonify({"error": str(e)})

init_routes(app)

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    app.run(debug=True)