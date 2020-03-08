from flask import Flask
from flask_cors import CORS
# Import blueprints from routes.py file
from routes import indexBrewRoute, createBrewRoute, updateBrewRoute, deleteBrewRoute, brewRoute, indexInventoryRoute, createInventoryRoute, updateInventoryRoute, deleteInventoryRoute, inventoryRoute,indexStockReturnRoute,createStockReturnRoute,stockReturnRoute,deleteStockReturnRoute,indexBreweryInfoRoute,createBreweryInfoRoute,deleteBreweryinfoRoute

# Set up app
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
app.register_blueprint(deleteStockReturnRoute)

app.register_blueprint(createBreweryInfoRoute)
app.register_blueprint(indexBreweryInfoRoute)
app.register_blueprint(deleteBreweryinfoRoute)

if __name__ == "__main__":
    # Run app
    app.run(debug=True)
