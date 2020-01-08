from flask import Flask

# Routes
from flask_cors import CORS
from routes import indexRoute, createBrewRoute, brewRoute, updateBrewRoute, deleteBrewRoute, createInventoryRoute
app = Flask(__name__)
CORS(app)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register Blueprints
app.register_blueprint(indexRoute)
app.register_blueprint(createBrewRoute)
app.register_blueprint(brewRoute)
app.register_blueprint(deleteBrewRoute)
app.register_blueprint(createInventoryRoute)


if __name__ == "__main__":
    app.run(debug=True)
