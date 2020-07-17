import requests
import copy
import json
import random
import datetime

from utils import config

api_key = config.get("url","api_key")
stations_list = []

def get_station_details():
    global stations_list
    payload = {}
    headers = {}
    url = config.get("url","traintime_stations_url") + "/" + api_key + "/stations.json"
    response = requests.request("GET", url, headers=headers, data=payload)
    stations_list = json.loads(response.text.encode('utf8'))['GetStationsJsonResult']
    return stations_list

def get_station_names():
    if len(stations_list)==0:
        get_station_details()
    station_names = []
    for tmp in stations_list:
        station_names.append(tmp["StationName"])
    return station_names

def get_station_id(station):
    if len(stations_list) == 0:
        get_station_details()
    station_names = []
    for tmp in stations_list:
        if station == tmp["StationName"]:
            return str(tmp["StationID"])
    return ""

def get_trains(origin, dest, day, month, year, time="0000"):
    origin_id = get_station_id(origin)
    dest_id = get_station_id(dest)
    imp_tags = ["BranchID","BranchIDConn1","BranchIDConn2","ConnectionCount","DateAsString","Destination","DestinationAda","DestinationID","DestinationTime","DestinationZoneStationID","Duration","LocationTime","NumberOfConnections","Origin","OriginAda","OriginID","OriginTime","OriginZoneStationId","Peak","PeakConn1","PeakConn2","StationStops","StationStopsConn1","StationStopsConn2","Track","TrackConn1","TrackConn2","TrainName","TrainNameConn1","TrainNameConn2","TrainStatus","TrainStatusConn1","TrainStatusConn2","Transfer1","Transfer1ArrTime","Transfer1DeptTime","Transfer1StationAda","Transfer1StationID","Transfer2","Transfer2ArrTime","Transfer2DeptTime","Transfer2StationAda","Transfer2StationID","OriginDateTime","DestinationDateTime","OriginETA","Train1MinutesLate","Train2MinutesLate","Train3MinutesLate"]
    trains_list = []
    if origin_id=="" or dest_id=="":
        return ["Unable to find the station details"]
    url = config.get("url", "traintime_train_url")
    url = url + "/" + origin_id + "/" + dest_id + "/ArriveBy/" + year + "/" + month + "/" + day + "/" + time + "/" + api_key + "/TripStatus.json"
    payload = {}
    headers = {}
    response = requests.request("GET", url, headers=headers, data=payload)
    tmp_list = json.loads(response.text.encode('utf8'))["GetTripStatusJsonResult"]
    for tmp in tmp_list:
        tmp_dict = dict.fromkeys(imp_tags)
        for key in imp_tags:
            tmp_dict[key] = tmp[key]
        trains_list.append(tmp_dict)

    return trains_list

def get_station_location(station):
    url = config.get("url", "traintime_station_url")
    url = url + "/" + get_station_id(station) + "/" + api_key + "/station.json"
    payload = {}
    headers = {}
    response = requests.request("GET", url, headers=headers, data=payload)
    tmp_json = json.loads(response.text.encode('utf8'))["GetStationDetailJsonResult"]
    station_dict = {"station": station, "latitude":tmp_json["StopLat"], "longitude":tmp_json["StopLong"]}
    return station_dict

def get_train_details(input_json):
    origin = input_json["Origin"]
    dest = input_json["Destination"]
    date = input_json["DateAsString"]
    datetime_obj = datetime.datetime.strptime(date,"%m/%d/%Y").date()
    train_list = get_trains(origin, dest, str(datetime_obj.day), str(datetime_obj.month), str(datetime_obj.year))
    origin_time = input_json["OriginTime"]
    train_name = input_json["TrainName"]
    train_conn1 = input_json["TrainNameConn1"]
    train_conn2 = input_json["TrainNameConn2"]
    for train in train_list:
        if(origin_time==train["OriginTime"] and  train_name == train["TrainName"] and train_conn1 == train["TrainNameConn1"] and train_conn2 == train["TrainNameConn2"]):
            return train
    return ""

def get_train_density(input_json):
    train_details = get_train_details(input_json)
    if len(train_details) ==0:
        return ["Details not found"]
    train_json = {}
    train1_json = {}
    train2_json = {}

    tmp_url = config.get("url", "mymnr_train_details_url")
    url = tmp_url + "/" + train_details["TrainName"] + "/" + api_key + "/"
    payload = {}
    headers = {}
    count = 0
    while (count < 30):
        response = requests.request("GET", url, headers=headers, data=payload)
        train_json = json.loads(response.text.encode('utf8'))
        count = count + 1
        if ("Message" in train_json.keys()) and ("not found" in train_json["Message"]):
            print("train details request failed")
        else:
            break

    if train_details["TrainNameConn1"]!=None:
        count = 0
        while(count<10):
            url = tmp_url + "/" + train_details["TrainNameConn1"] + "/" + api_key + "/"
            response = requests.request("GET", url, headers=headers, data=payload)
            train1_json = json.loads(response.text.encode('utf8'))
            count = count + 1
            if ("Message" in train1_json.keys()) and ("not found" in train1_json["Message"]):
                print("train1 details request failed")
            else:
                break
    if train_details["TrainNameConn2"]!=None:
        count = 0
        while (count < 30):
            url = tmp_url + "/" + train_details["TrainNameConn2"] + "/" + api_key + "/"
            response = requests.request("GET", url, headers=headers, data=payload)
            train2_json = json.loads(response.text.encode('utf8'))
            count = count + 1
            if ("Message" in train2_json.keys()) and ("not found" in train2_json["Message"]):
                print("train2 details request failed")
            else:
                break
                
    tmp_list = []
    pos_list = []
    density_list = []
    car_dict = {"train":[], "train1":[], "train2":[]}
    if "consist" in train_json.keys():
        for car in train_json["consist"]["Cars"]:
            tmp_list.append(car["UnitNumber"])
            pos_list.append(car["Position"])
            density_list.append(float(car["PassengerCount"])/100)
        tmp_dict = dict.fromkeys(tmp_list)
        i = 0
        for key in tmp_dict.keys():
            tmp_dict[key] = {"density": density_list[i], "position": pos_list[i]}
            i = i + 1
        car_dict["train"].append(tmp_dict)

    tmp_list = []
    pos_list = []
    density_list = []
    if train_details["TrainNameConn1"] != None:
        if "consist" in train1_json.keys():
            for car in train1_json["consist"]["Cars"]:
                tmp_list.append(car["UnitNumber"])
                pos_list.append(car["Position"])
                density_list.append(float(car["PassengerCount"]) / 100)
            tmp_dict = dict.fromkeys(tmp_list)
            i = 0
            for key in tmp_dict.keys():
                tmp_dict[key] = {"density": density_list[i], "position": pos_list[i]}
                i = i+1
            car_dict["train1"].append(tmp_dict)

    tmp_list = []
    pos_list = []
    density_list = []
    if train_details["TrainNameConn2"] != None:
        if "consist" in train2_json.keys():
            for car in train2_json["consist"]["Cars"]:
                tmp_list.append(car["UnitNumber"])
                pos_list.append(car["Position"])
                density_list.append(float(car["PassengerCount"]) / 100)
            tmp_dict = dict.fromkeys(tmp_list)
            i = 0
            for key in tmp_dict.keys():
                tmp_dict[key] = {"density": density_list[i], "position": pos_list[i]}
                i = i + 1
            car_dict["train2"].append(tmp_dict)

    train_details["car_population_density"] = [car_dict]

    return train_details


def get_train_station_density(input_json):
    train_details = get_train_details(input_json)
    if len(train_details) == 0:
        return ["Details not found"]
    train_json = {}
    train1_json = {}
    train2_json = {}

    tmp_url = config.get("url", "mymnr_train_details_url")
    url = tmp_url + "/" + train_details["TrainName"] + "/" + api_key + "/"
    payload = {}
    headers = {}
    count = 0
    while (count < 300):
        response = requests.request("GET", url, headers=headers, data=payload)
        train_json = json.loads(response.text.encode('utf8'))
        count = count + 1
        if ("Message" in train_json.keys()) and ("not found" in train_json["Message"]):
            print("train details request failed")
        else:
            break

    if train_details["TrainNameConn1"] != None:
        count = 0
        while (count < 300):
            url = tmp_url + "/" + train_details["TrainNameConn1"] + "/" + api_key + "/"
            response = requests.request("GET", url, headers=headers, data=payload)
            train1_json = json.loads(response.text.encode('utf8'))
            count = count + 1
            if ("Message" in train1_json.keys()) and ("not found" in train1_json["Message"]):
                print("train1 details request failed")
            else:
                break
    if train_details["TrainNameConn2"] != None:
        count = 0
        while (count < 300):
            url = tmp_url + "/" + train_details["TrainNameConn2"] + "/" + api_key + "/"
            response = requests.request("GET", url, headers=headers, data=payload)
            train2_json = json.loads(response.text.encode('utf8'))
            count = count + 1
            if ("Message" in train2_json.keys()) and ("not found" in train2_json["Message"]):
                print("train2 details request failed")
            else:
                break

    tmp_list = []
    pos_list = []
    density_list = []
    station_dict = {"station_stop": [], "station_stop1": [], "station_stop2": []}
    for station in train_details["StationStops"].split(","):
        tmp_list.append(station)
        density_list.append(random.uniform(0,0.8))
    tmp_dict = dict.fromkeys(tmp_list)
    i = 0
    for key in tmp_dict.keys():
        tmp_dict[key] = {"density": density_list[i]}
        i = i + 1
    station_dict["station_stop"].append(tmp_dict)

    tmp_list = []
    pos_list = []
    density_list = []
    if train_details["TrainNameConn1"] != None:
        for station in train_details["StationStopsConn1"].split(","):
            tmp_list.append(station)
            density_list.append(random.uniform(0, 0.8))
        tmp_dict = dict.fromkeys(tmp_list)
        i = 0
        for key in tmp_dict.keys():
            tmp_dict[key] = {"density": density_list[i]}
            i = i + 1
        station_dict["station_stop1"].append(tmp_dict)

    tmp_list = []
    pos_list = []
    density_list = []
    if train_details["TrainNameConn2"] != None:
        for station in train_details["StationStopsConn1"].split(","):
            tmp_list.append(station)
            density_list.append(random.uniform(0, 0.8))
        tmp_dict = dict.fromkeys(tmp_list)
        i = 0
        for key in tmp_dict.keys():
            tmp_dict[key] = {"density": density_list[i]}
            i = i + 1
        station_dict["station_stop2"].append(tmp_dict)

    train_details["station_population_density"] = [station_dict]

    return train_details

def get_trains_arriveby(origin_id, dest_id, day, month, year, time="0000"):
    url = config.get("url","traintime_train_url")
    url = url + "/" + origin_id + "/" + dest_id + "/ArriveBy/" + year + "/" + month + "/" + day + "/" + time + "/" + api_key + "/TripStatus.json"
    payload = {}
    headers = {}
    response = requests.request("GET", url, headers=headers, data=payload)
    trains_list = json.loads(response.text.encode('utf8'))["GetTripStatusJsonResult"]
    return trains_list

def get_trains_departby(origin_id, dest_id, day, month, year, time="0000"):
    url = config.get("url","traintime_train_url")
    url = url + "/" + origin_id + "/" + dest_id + "/DepartBy/" + year + "/" + month + "/" + day + "/" + time + "/" + api_key + "/TripStatus.json"
    payload = {}
    headers = {}
    response = requests.request("GET", url, headers=headers, data=payload)
    trains_list = json.loads(response.text.encode('utf8'))["GetTripStatusJsonResult"]
    return trains_list

def get_trains_mymta(origin_id, dest_id, day, month, year, time="0000"):
    url = config.get("url","traintime_mymta_train_url")
    url = url + "/" + origin_id + "/" + dest_id + "/0/" + year + "/" + month + "/" + day + "/" + time + "/" + api_key + "/TripStatus.json"
    payload = {}
    headers = {}
    response = requests.request("GET", url, headers=headers, data=payload)
    trains_list = json.loads(response.text.encode('utf8'))["GetTripStatusJsonResult"]
    return trains_list

input_json = dict.fromkeys(["DateAsString","Destination","Origin","OriginTime","TrainName","TrainNameConn1","TrainNameConn2"])

input_json["Origin"] = "GREYSTONE"
input_json["Destination"] = "GREENWICH"
input_json["DateAsString"] = "7/17/2020"
get_train_station_density(input_json)