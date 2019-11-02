from flask import Flask

# Routes
from flask_cors import CORS
from routes import indexRoute
app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(indexRoute)



if __name__ == "__main__":
    app.run(debug=True)
