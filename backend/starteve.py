from eve import Eve

annotation_schema= {
  '@context' : { 'type' : 'string' },
  'id' : { 'anyof':[
    {'type' : 'string'},
    {'type':'list', 'schema': { 'type': 'string'}}
    ]},
  'body': { 'anyof' : [
    {'type':'string'},
    {'type':'list', 'schema': { 'type': 'string'}}
   ]},
  'bodyValue': {'type':'string'},
  'target':{'required':True,'anyof':[
    {'type':'string'},
    {'type':'list', 'schema': { 'type': 'string'}}
  ]}
}

my_settings = {
    'MONGO_HOST': 'localhost',
    'MONGO_PORT': 27017,
    'MONGO_DBNAME': 'b2notedb',
    'MONGO_USERNAME': 'b2note',
    'MONGO_PASSWORD': 'b2note',
    'DOMAIN': {'annotations': {'allow_unknown':True, 'schema':annotation_schema}},
    'RESOURCE_METHODS': ['GET', 'POST', 'DELETE'],
    'ITEM_METHODS': ['GET', 'PATCH', 'PUT', 'DELETE'],
    'XML' : False
}
#'allow_unknown':True, 'schema': {
#  'context': {'type': 'string'},
#  'id': {'type': 'string'},
#  'type': {'type': 'string'},
#  'body': {'type': 'string'},
#  'target': {'type': 'string'}
#}},
app = Eve(settings=my_settings)
app.run()
