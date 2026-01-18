import {useCallback, useState} from "react";
import type {AxiosRequestConfig, Method} from "axios";
import trainAPI from "../axios/axios.tsx";


const useApiRequest = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [status, setStatus] = useState<number | null>(null);

    const sendRequest = useCallback(
        (
            method: Method,
            url: string,
            requestData?: any,
            isFormData?: boolean,
            queryParams?: AxiosRequestConfig["params"]
        ) => {
            setLoading(true);
            setData(null);
            setError(null);
            setStatus(null);

            trainAPI({
                method: method,
                url: url,
                data: requestData,
                params: queryParams,
                responseType: "json",
            })
                .then((res) => {
                    setData(res.data);
                    setStatus(res.status);
                })
                .catch((err) => {
                    setError(err.response);
                    setStatus(err.response?.status || 500);
                })
                .finally(() => setLoading(false));
        },
        []
    );

    return {sendRequest, data, error, loading, status};
};

export default useApiRequest;
