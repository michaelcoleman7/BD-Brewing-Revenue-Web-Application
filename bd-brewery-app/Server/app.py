from flask import Flask

# Routes
from flask_cors import CORS
from routes import indexBrewRoute, createBrewRoute, updateBrewRoute, deleteBrewRoute, brewRoute, indexInventoryRoute, createInventoryRoute, updateInventoryRoute, deleteInventoryRoute, inventoryRoute,indexStockReturnRoute,createStockReturnRoute,stockReturnRoute

app = Flask(__name__)
CORS(app)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register Blueprints
app.register_blueprint(indexBrewRoute)
app.register_blueprint(createBrewRoute)
app.register_blueprint(updateBrewRoute)
app.register_blueprint(deleteBrewRoute)
app.register_blueprint(brewRoute)

app.register_blueprint(createInventoryRoute)
app.register_blueprint(indexInventoryRoute)
app.register_blueprint(updateInventoryRoute)
app.register_blueprint(deleteInventoryRoute)
app.register_blueprint(inventoryRoute)

app.register_blueprint(indexStockReturnRoute)
app.register_blueprint(createStockReturnRoute)
app.register_blueprint(stockReturnRoute)

if __name__ == "__main__":
    app.run(debug=True)
