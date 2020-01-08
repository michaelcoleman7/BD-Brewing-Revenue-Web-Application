from flask import Flask

# Routes
from flask_cors import CORS
from routes import indexBrewRoute, createBrewRoute, updateBrewRoute, deleteBrewRoute, indexInventoryRoute, createInventoryRoute
app = Flask(__name__)
CORS(app)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register Blueprints
app.register_blueprint(indexBrewRoute)
app.register_blueprint(createBrewRoute)
app.register_blueprint(updateBrewRoute)
app.register_blueprint(deleteBrewRoute)
app.register_blueprint(createInventoryRoute)
app.register_blueprint(indexInventoryRoute)


if __name__ == "__main__":
    app.run(debug=True)
