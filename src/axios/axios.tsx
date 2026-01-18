import axios from 'axios';

const trainAPI = axios.create({
    baseURL: `http://transport.opendata.ch/v1/`
})

export default trainAPI;