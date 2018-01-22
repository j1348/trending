import axios from 'axios';

function trending() {
    return axios.get('http://127.0.0.1:3000/trending');
};

export default { trending };
