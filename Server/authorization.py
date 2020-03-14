from functools import wraps
from flask import request, g, abort
import jwt
import json

# function to ensure user is logged in via checking the autorization headers sent with a request - adapted from https://developer.okta.com/blog/2018/12/20/crud-app-with-python-flask-react
def login_required(f):
   @wraps(f)
   def wrap(*args, **kwargs):
       authorization = request.headers.get("authorization", None)
       if not authorization:
           return json.dumps({'error': 'no authorization token provied'}), 403, {'Content-type': 'application/json'}
      
       try:
           token = authorization.split(' ')[1]
           resp = jwt.decode(token, None, verify=False, algorithms=['HS256'])
           g.user = resp['sub']
       except jwt.exceptions.DecodeError as identifier:
           return json.dumps({'error': 'invalid authorization token'}), 403, {'Content-type': 'application/json'}
      
       return f(*args, **kwargs)
 
   return wrap