from flask import jsonify
from flask import Flask
from flask import request
from flask import abort
# from flask_restful import Api, Resource, reqparse
from make_requests import *


app = Flask(__name__)
# parser = reqparse.RequestParser()

@app.route("/")
def hello():
    return jsonify("<h1>Hello Worldnnnnn!</h1>")


@app.route('/train_list', methods=['POST'])
def flask_train_list():
    imp_tags = ["origin", "dest", "day", "month", "year"]

    if not request.json:
        abort(400)
    for key in imp_tags:
        if key not in request.json.keys():
            abort(400)
    trains_list = get_trains(request.json["origin"], request.json["dest"], request.json["day"], request.json["month"], request.json["year"])

    return jsonify({'trains_list': trains_list}), 201

@app.route('/station_list', methods=['GET'])
def flask_station_list():
    stations_list = get_station_names()

    return jsonify({'stations_list': stations_list}), 201

@app.route('/station_location', methods=['POST'])
def flask_station_location():
    imp_tags = ["station"]

    if not request.json:
        abort(400)
    for key in imp_tags:
        if key not in request.json.keys():
            abort(400)
    station_location = get_station_location(request.json["station"])

    return jsonify({'station_location': station_location}), 201

@app.route('/train_density', methods=['POST'])
def flask_train_density():
    imp_tags = ["DateAsString","Destination","Origin","OriginTime","TrainName","TrainNameConn1","TrainNameConn2"]

    if not request.json:
        abort(400)
    for key in imp_tags:
        if key not in request.json.keys():
            abort(400)
    train_density = get_train_density(request.json)

    return jsonify({'train_density': train_density}), 201

@app.route('/train_station_density', methods=['POST'])
def flask_train_station_density():
    imp_tags = ["DateAsString","Destination","Origin","OriginTime","TrainName","TrainNameConn1","TrainNameConn2"]

    if not request.json:
        abort(400)
    for key in imp_tags:
        if key not in request.json.keys():
            abort(400)
    train_density = get_train_station_density(request.json)

    return jsonify({'train_station_density': train_density}), 201


if __name__== "__main__":


    # print(get_trains_arriveby("1", "33", "17", "07", "2020", time="0000"))

    # print(get_trains("GREYSTONE", "GREENWICH", "17", "07", "2020"))

    app.run(debug=True)