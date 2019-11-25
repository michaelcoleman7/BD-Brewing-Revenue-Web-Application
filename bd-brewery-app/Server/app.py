from flask import Flask

# Routes
from flask_cors import CORS
from routes import indexRoute, createBrewRoute, brewRoute, updateBrewRoute, deleteBrewRoute
app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(indexRoute)
app.register_blueprint(createBrewRoute)
app.register_blueprint(brewRoute)
app.register_blueprint(deleteBrewRoute)




if __name__ == "__main__":
    app.run(debug=True)
