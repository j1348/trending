import axios from 'axios';

function trending() {
    return axios.get('http://127.0.0.1:4000/trending');
};

export default { trending };
