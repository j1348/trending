import { getRepos, getRepo } from '../../models/repo';

export default function initRepo(app) {
    app.get('/repos', function(req, res) {
        const { hour } = req.query;

        getRepos(hour)
            .then(repos => {
                res.send({ repos });
            })
            .catch(console.error);
    });

    app.get('/repos/:id', function(req, res) {
        const { id } = req.params;

        getRepo(id)
            .then(repos => {
                res.send({ repo: repos });
            })
            .catch(console.error);
    });
}
