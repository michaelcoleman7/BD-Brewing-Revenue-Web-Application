from flask import Flask

# Routes
from flask_cors import CORS
from routes import indexRoute, createBrewRoute, brewRoute, updateBrewRoute, deleteBrewRoute
app = Flask(__name__)
CORS(app)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register Blueprints
app.register_blueprint(indexRoute)
app.register_blueprint(createBrewRoute)
app.register_blueprint(brewRoute)
app.register_blueprint(deleteBrewRoute)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


if __name__ == "__main__":
    app.run(debug=True)
