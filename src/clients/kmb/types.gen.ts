// This file is auto-generated by @hey-api/openapi-ts

export type GetV1TransportKmbStopResponse = ({
    type: "StopList";
    version: string;
    generated_timestamp: string;
    data: Array<{
        stop: string;
        name_en: string;
        name_tc: string;
        name_sc: string;
        lat: string;
        long: string;
    }>;
});

export type GetV1TransportKmbStopError = unknown;

export type GetV1TransportKmbStopEtaByStopIdData = {
    path: {
        /**
         * 16-character representation of a bus stop. Case sensitive.
         */
        stop_id: string;
    };
};

export type GetV1TransportKmbStopEtaByStopIdResponse = ({
    /**
     * Always "StopETA"
     */
    type: string;
    version: string;
    /**
     * The timestamp of the initial generated time of the response before it is cached.
     */
    generated_timestamp: string;
    /**
     * The object that of the data requested.
     */
    data: Array<{
        /**
         * The value will always be "KMB".
         */
        co: string;
        route: string;
        /**
         * "I" for inbound or
         * "O" for outbound
         */
        dir: string;
        service_type: number;
        seq: number;
        dest_tc: string;
        dest_sc: string;
        dest_en: string;
        eta_seq: number;
        eta: (string) | null;
        rmk_tc: string;
        rmk_sc: string;
        rmk_en: string;
        data_timestamp: string;
    }>;
});

export type GetV1TransportKmbStopEtaByStopIdError = unknown;

export type GetV1TransportKmbStopByStopIdData = {
    path: {
        stop_id: string;
    };
};

export type GetV1TransportKmbStopByStopIdResponse = ({
    type: string;
    version: string;
    generated_timestamp: string;
    data: {
        stop: string;
        name_en: string;
        name_tc: string;
        name_sc: string;
        lat: string;
        long: string;
    };
});

export type GetV1TransportKmbStopByStopIdError = unknown;