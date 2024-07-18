from flask import render_template

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
    
    

    @app.route('/disaster_prevention_links')
    def disaster_prevention_links():
        return render_template('disaster_prevention_links.html')