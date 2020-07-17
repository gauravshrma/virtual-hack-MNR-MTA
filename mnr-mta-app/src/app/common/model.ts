export class TrainDetailOld {
    name: string;
    startTime: string;
    endTime: string;
    track: number;
    originStation: string;
}

export class Station {
    station: string;
    Arrival: string;
    Departure: string;
    Pax: string;
}


export class TrainDetail {
    TrainName: string;
    Origin: string;
    Destination: string;
    OriginETA: string;
    DestinationTime: string;
    Track: string;
    TrackConn1: string;
    TrackConn2: string;
    Duration: string;
    TrainNameConn1: string;
    TrainNameConn2: string;
    DateAsString: string;
    OriginTime: string;
}

export class TrainRequest {
    origin: string;
    dest: string;
    day: string;
    month: string;
    year: string;
}

export class TrainDensityRequest {
    Origin: string;
    Destination: string;
    DateAsString: string;
    OriginTime: string;
    TrainName: string;
    TrainNameConn1: string;
    TrainNameConn2: string;
}